import { getAuth } from "@clerk/express";
import axios from "axios";
import { type Request, type Response } from "express";
import trainingSessionModel from "../models/training-session.model.js";
import puzzleModel, {
  type PuzzleCategory,
  type PuzzleDifficulty,
} from "../models/puzzle.model.js";
import userModel, {
  type PuzzleCategoryData,
  type LevelType,
  type IUser,
  createNewWeekPuzzles,
  createNewWeekPoints,
  createNewWeekTimeSpent,
  calcDaysTillSun,
} from "../models/user.model.js";
import badgeModel from "../models/badge.model.js";
import OpenAI from "openai";
import { Levels } from "./user.controller.js";
import {
  PointsReference,
  BadgeReference,
  ChallengeReference,
} from "../utils/reference.js";
import challengeModel from "../models/challenge.model.js";

type QueryForLevel = {
  userId: string | null;
  points: { $gte: number; $lt?: number };
  "puzzles.correct": { $gte: number; $lt?: number };
};

export type CategoryArrayItemSave = {
  category: PuzzleCategory;
  isCorrect: boolean;
  timeSpent: number;
};

type CheckAnswerBody = {
  puzzle: string;
  response: string;
  answer: string;
  difficulty: PuzzleDifficulty;
  category: PuzzleCategory;
  hintUsed?: boolean;
  id?: string;
  timeTaken?: number;
  isDaily: boolean;
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
  timeTakenNumber: number;
  allPuzzlesAnswered: CategoryArrayItemSave[];
};

export const addNewWeeks = async (
  userId: string | null,
  numDate: number,
  correctPuzzles: number,
  incorrectPuzzles: number,
  pointsEarned: number,
  timeSpent: number
) => {
  try {
    await userModel.updateOne(
      {
        userId,
      },
      {
        $push: {
          weekPuzzles: {
            from: numDate,
            to: calcDaysTillSun(numDate),
            data: createNewWeekPuzzles(correctPuzzles, incorrectPuzzles),
          },
          weekPoints: {
            from: numDate,
            to: calcDaysTillSun(numDate),
            data: createNewWeekPoints(pointsEarned),
          },
          weekTimeSpent: {
            from: numDate,
            to: calcDaysTillSun(numDate),
            data: createNewWeekTimeSpent(timeSpent),
          },
        },
      }
    );
  } catch (error) {
    console.error("Error adding new weeks: ", error);
  }
};

const updatePercentageText = async (userId: string | null) => {
  try {
    const categoryDataObject: {
      puzzleCategoryData: PuzzleCategoryData[];
    } | null = await userModel.findOne(
      { userId },
      { puzzleCategoryData: 1, _id: 0 }
    );
    if (!categoryDataObject) return;
    const categoryData = categoryDataObject.puzzleCategoryData;
    const pendingTotalValue = categoryData.reduce((a, b) => a + b.value, 0);
    const totalValue = pendingTotalValue <= 0 ? 1 : pendingTotalValue;
    const newData: PuzzleCategoryData[] = categoryData.map((item) => {
      return {
        value: item.value,
        color: item.color,
        label: item.label,
        text: `${Math.round((item.value / totalValue) * 100)}%`,
        focused: item.label === "Logic",
        correct: item.correct,
        timeSpent: item.timeSpent,
      };
    });
    await userModel.updateOne(
      { userId },
      { $set: { puzzleCategoryData: newData } }
    );
  } catch (error) {
    console.error("Update percentage text error: ", error);
  }
};

const checkEarnedBadges = async (userId: string | null) => {
  try {
    const badges = await badgeModel.find();
    if (!badges || badges.length === 0) return;
    badges.forEach(async (item) => {
      await BadgeReference[item.condition as keyof typeof BadgeReference](
        userId,
        item._id as string
      );
    });
  } catch (error) {
    console.error("check earned badges error: ", error);
  }
};

const checkStreak = async (userId: string | null) => {
  try {
    const user = await userModel.findOne({ userId }, { lastLogged: 1, _id: 0 });
    if (!user) return;
    const now = Date.now();
    const lastLogged = user.lastLogged;
    const date = new Date(lastLogged);

    const nextMidnight = new Date(date);
    nextMidnight.setHours(24, 0, 0, 0);

    const endOfNextDay = new Date(nextMidnight);
    endOfNextDay.setHours(24, 0, 0, 0);
    await userModel.updateOne({ userId }, { $set: { lastLogged: Date.now() } });
    if (nextMidnight.getTime() <= now && now <= endOfNextDay.getTime()) {
      await userModel.updateOne(
        {
          userId,
        },
        { $inc: { streak: 1 } }
      );
    }
    if (endOfNextDay.getTime() < now) {
      await userModel.updateOne(
        {
          userId,
        },
        { $set: { streak: 1 } }
      );
    }
  } catch (error) {
    console.error("check streak error: ", error);
  }
};

const updateLevel = async (
  userId: string | null,
  level: LevelType,
  nextPoints: number | undefined,
  nextPuzzles: number | undefined
) => {
  try {
    let query: QueryForLevel = {
      userId,
      points: { $gte: level.pointsNeeded, $lt: nextPoints },
      "puzzles.correct": { $gte: level.puzzlesNeeded, $lt: nextPuzzles },
    };
    if (!nextPoints || !nextPuzzles) {
      query = {
        userId,
        points: { $gte: level.pointsNeeded },
        "puzzles.correct": { $gte: level.puzzlesNeeded },
      };
    }
    await userModel.updateOne(query, { level });
  } catch (error) {
    console.error("update level error: ", error);
  }
};

const checkUpdateLevel = async (userId: string | null) => {
  Levels.forEach(async (item, index) => {
    const validPoints = Levels[index + 1]
      ? Levels[index + 1].pointsNeeded
      : undefined;
    const validPuzzles = Levels[index + 1]
      ? Levels[index + 1].puzzlesNeeded
      : undefined;
    await updateLevel(userId, item, validPoints, validPuzzles);
  });
};

const checkChallengeProgress = async (userId: string | null) => {
  try {
    const challenges = await challengeModel.find({ isDaily: true });
    if (!challenges || challenges.length === 0) return;
    challenges.forEach(async (item) => {
      await ChallengeReference[
        item.condition as keyof typeof ChallengeReference
      ](userId);
    });
  } catch (error) {
    console.error("check challenges progress error: ", error);
  }
};

const updateUser = async (
  userId: string | null,
  correctPuzzles: number,
  incorrectPuzzles: number,
  pointsEarned: number,
  timeSpent: number,
  categories: CategoryArrayItemSave[]
) => {
  const numDate = Date.now();
  const date = new Date(numDate);
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  console.log(day);
  try {
    const user: Pick<IUser, "weekPuzzles" | "_id" | "lastLogged"> | null =
      await userModel
        .findOneAndUpdate(
          {
            userId,
          },
          {
            $inc: {
              "puzzles.correct": correctPuzzles,
              "puzzles.incorrect": incorrectPuzzles,
              points: pointsEarned,
              timeSpent,
              "todayStats.puzzles.correct": correctPuzzles,
              "todayStats.puzzles.incorrect": incorrectPuzzles,
              "todayStats.points": pointsEarned,
              "todayStats.timeSpent": timeSpent,
              "weekPuzzles.$[week].data.$[day].value": correctPuzzles,
              "weekPuzzles.$[week].data.$[incorrect].value": incorrectPuzzles,
              "weekPoints.$[week].data.$[day].value": pointsEarned,
              "weekTimeSpent.$[week].data.$[day].value": timeSpent,
            },
          },
          {
            arrayFilters: [
              { "week.from": { $lte: numDate }, "week.to": { $gte: numDate } },
              { "day.label": day },
              { "incorrect.day": day },
            ],
            new: true,
          }
        )
        .select("weekPuzzles lastLogged");
    if (!user) return;
    const weeks = user.weekPuzzles;
    weeks.sort((a, b) => b.to - a.to);
    if (weeks[0].to < numDate) {
      await addNewWeeks(
        userId,
        numDate,
        correctPuzzles,
        incorrectPuzzles,
        pointsEarned,
        timeSpent
      );
    }
    const operations = categories.map((item) => {
      const update = item.isCorrect
        ? {
            $inc: {
              [`todayStats.categories.${item.category}.correct`]: 1,
              "puzzleCategoryData.$.value": 1,
              "puzzleCategoryData.$.correct": 1,
              "puzzleCategoryData.$.timeSpent": item.timeSpent,
            },
          }
        : {
            $inc: {
              [`todayStats.categories.${item.category}.incorrect`]: 1,
              "puzzleCategoryData.$.value": 1,
              "puzzleCategoryData.$.timeSpent": item.timeSpent,
            },
          };
      return {
        updateOne: {
          filter: {
            userId,
            "puzzleCategoryData.label":
              item.category.charAt(0).toUpperCase() + item.category.slice(1),
          },
          update,
        },
      };
    });
    await userModel.bulkWrite(operations);
    await Promise.all([
      updatePercentageText(userId),
      checkEarnedBadges(userId),
      checkStreak(userId),
      checkUpdateLevel(userId),
      checkChallengeProgress(userId),
    ]);
  } catch (error) {
    console.error("update user error: ", error);
  }
};

export const checkAnswer = async (
  req: Request<{}, {}, CheckAnswerBody>,
  res: Response
) => {
  const { userId } = getAuth(req);
  const {
    puzzle,
    response,
    answer,
    difficulty,
    category,
    hintUsed,
    id,
    timeTaken,
    isDaily,
  } = req.body;
  try {
    if (id && userId) {
      const puzzle = await puzzleModel.findById(id);
      if (!isDaily && puzzle?.attempts.includes(userId))
        return res.json({
          success: true,
          message: "Sorry, you've already attempted this puzzle previously.",
          correct: false,
        });
      if (isDaily && puzzle?.dailyPuzzleAttempts.includes(userId)) {
        return res.json({
          success: true,
          message: "Sorry, you've already attempted the daily puzzle.",
          correct: false,
        });
      }
    }
    const checkResponse = await axios.post<OpenRouterChatCompletion>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content:
              "You leniently compare the meaning of a response to a puzzle and it's answer and only return the strings true or false.",
          },
          {
            role: "user",
            content: `Compare this response: (${response}) to this puzzle: (${[
              puzzle,
            ]}) and it's answer: (${answer}) and check if the user response is acceptable as a correct answer to the puzzle. Return true or false.`,
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
    // const openai = new OpenAI({
    //   apiKey: process.env.GEMINI_API_KEY!,
    //   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    // });

    // const checkResponse = await openai.chat.completions.create({
    //   model: "gemini-2.0-flash",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You leniently compare a response to a puzzle and it's answer and only return the strings true or false.",
    //     },
    //     {
    //       role: "user",
    //       content: `Compare this response: (${response}) to this puzzle: (${puzzle}) and it's answer: (${answer}) and check to see if the user response is acceptable as a correct answer to the puzzle. Return true or false.`,
    //     },
    //   ],
    // });
    if (id) {
      const updateField = isDaily ? "dailyPuzzleAttempts" : "attempts";
      await puzzleModel.findByIdAndUpdate(id, {
        $push: { [updateField]: userId },
      });
    }
    const isCorrect = checkResponse.data.choices[0].message.content?.trim();
    let send;
    let pointsEarned = 0;
    if (isCorrect === "true" || isCorrect?.includes("true")) {
      if (id) {
        await puzzleModel.findByIdAndUpdate(id, {
          $push: { successes: userId },
        });
        pointsEarned = PointsReference[difficulty] * (hintUsed ? 5 : 15);
      }
      send = {
        success: true,
        message: `Correct! The answer is ${answer}`,
        correct: true,
      };
    } else {
      send = {
        success: true,
        message: `Sorry, incorrect... The answer is ${answer}`,
        correct: false,
      };
    }
    if (id && Number.isFinite(timeTaken) && typeof timeTaken !== "undefined") {
      const correctPuzzles = pointsEarned > 0 ? 1 : 0;
      const incorrectPuzzles = pointsEarned === 0 ? 1 : 0;
      await updateUser(
        userId,
        correctPuzzles,
        incorrectPuzzles,
        pointsEarned,
        timeTaken,
        [
          {
            category,
            isCorrect: pointsEarned > 0,
            timeSpent: timeTaken,
          },
        ]
      );
    }
    res.json(send);
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
      timeTakenNumber,
      allPuzzlesAnswered,
    } = req.body;
    const newSession = new trainingSessionModel({
      user: userId,
      pointsEarned,
      puzzlesAttempted,
      puzzlesSolved,
      timeLimit,
      timeTaken,
    });
    await Promise.all([
      newSession.save(),
      updateUser(
        userId,
        puzzlesSolved,
        puzzlesAttempted - puzzlesSolved,
        pointsEarned,
        timeTakenNumber,
        allPuzzlesAnswered
      ),
    ]);
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
