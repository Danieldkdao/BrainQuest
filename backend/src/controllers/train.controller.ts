import { getAuth } from "@clerk/express";
import axios from "axios";
import { type Request, type Response } from "express";
import trainingSessionModel from "../models/training-session.model.ts";
import puzzleModel from "../models/puzzle.model.ts";

type CheckAnswerBody = {
  response: string;
  answer: string;
  id?: string;
};

type OpenRouterChatCompletion = {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: "system" | "user" | "assistant" | "tool";
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: string;
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

type SaveTSBody = {
  pointsEarned: number;
  puzzlesAttempted: number;
  puzzlesSolved: number;
  timeLimit: string;
  timeTaken: string;
};

export const checkAnswer = async (
  req: Request<{}, {}, CheckAnswerBody>,
  res: Response
) => {
  const { userId } = getAuth(req);
  const { response, answer, id } = req.body;
  try {
    if(id && userId){
      const puzzle = await puzzleModel.findById(id);
      if(puzzle?.attempts.includes(userId)) return res.json({success: true, message: "Sorry, you've already attempted this puzzle previously.", correct: false});
    }
    const checkResponse = await axios.post<OpenRouterChatCompletion>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "x-ai/grok-4-fast:free",
        messages: [
          {
            role: "system",
            content:
              "You leniently compare the meaning of a response and an answer and only returns the strings true or false.",
          },
          {
            role: "user",
            content: `Compare this response: (${response}) to this answer: (${answer}) and check if the response is has similar meaning to the answer. One might be longer than the other or contain extra details but your job is to check if the main idea semantically is the same. Return true or false.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY!}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (id) {
      await puzzleModel.findByIdAndUpdate(id, { $push: { attempts: userId } });
    }
    const isCorrect = checkResponse.data.choices[0].message.content;
    if (isCorrect === "true") {
      if(id){
        await puzzleModel.findByIdAndUpdate(id, { $push: { successes: userId } });
      }
      res.json({
        success: true,
        message: `Correct! The answer is ${answer}`,
        correct: true,
      });
    } else {
      res.json({
        success: true,
        message: `Sorry, incorrect... The answer is ${answer}`,
        correct: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message:
        "Something went wrong while your answer was being checked. Please try again later.",
    });
  }
};

export const saveTrainingSession = async (
  req: Request<{}, {}, SaveTSBody>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const {
      pointsEarned,
      puzzlesAttempted,
      puzzlesSolved,
      timeLimit,
      timeTaken,
    } = req.body;
    const newSession = new trainingSessionModel({
      user: userId,
      pointsEarned,
      puzzlesAttempted,
      puzzlesSolved,
      timeLimit,
      timeTaken,
    });
    await newSession.save();
    res.json({
      success: true,
      message: "Training session saved successfully!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save training session." });
  }
};

export const getTrainingSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const sessions = await trainingSessionModel
      .find({ user: userId })
      .sort({ createdAt: -1, _id: -1 });
    res.json({
      success: true,
      message: "Sessions fetched successfully!",
      sessions,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching sessions." });
  }
};

export const deleteTrainingSession = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await trainingSessionModel.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Training session deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting training session." });
  }
};

export const clearSessionHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    await trainingSessionModel.deleteMany({ user: userId });
    res.json({
      success: true,
      message: "Session history cleared successfully!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error clearing session history." });
  }
};
