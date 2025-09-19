import axios from "axios";
import { type Request, type Response } from "express";

type CheckAnswerBody = {
  response: string;
  answer: string;
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

export const checkAnswer = async (
  req: Request<{}, {}, CheckAnswerBody>,
  res: Response
) => {
  const { response, answer } = req.body;
  try {
    const checkResponse = await axios.post<OpenRouterChatCompletion>(
      "https://openrouter.ai/api/v1/chat/completions",
      JSON.stringify({
        model: "openrouter/sonoma-sky-alpha",
        messages: [
          {
            role: "system",
            content:
              "You compare the meaning of text and only returns the strings true or false.",
          },
          {
            role: "user",
            content: `Compare this response: (${response}) to this answer: (${answer}) and check if the response is has similar meaning to the answer. One might be longer than the other or contain extra details but try to see if the main idea is the same. Return true or false.`,
          },
        ],
      }),
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY!}`,
          "Content-Type": "application/json",
        },
      }
    );

    const isCorrect = checkResponse.data.choices[0].message.content;
    if (isCorrect === "true") {
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
