import { Request, Response } from "express";
import axios from "axios";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const diagnosticsPredict = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schema = z.object({
    symptomsText: z.string().trim(),
    symptomsOptions: z.array(z.string().trim()).optional(),
  });

  const { symptomsText, symptomsOptions }: z.infer<typeof schema> = req.body;

  try {
    schema.parse({ symptomsText, symptomsOptions });
  } catch (err) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Invalid input data",
      },
    });
    return;
  }

  console.log(symptomsText);

  try {
    await axios
      .post(
        `${process.env.AI_API_ENDPOINT}/ai/text`,
        {
          prompt: symptomsText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((result) => {
        res.json({
          disease: result.data.disease,
          description: `https://www.google.com/search?q=${result.data.disease}`,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: "error",
          error: { code: 500, message: error.message },
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const diagnosticsInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schema = z.object({
    disease: z.string().trim(),
  });

  const { disease }: z.infer<typeof schema> = req.body;

  try {
    schema.parse({ disease });
  } catch (err) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Invalid input data",
      },
    });
    return;
  }

  const model = google("gemini-2.0-flash-lite", {
    safetySettings: [
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_CIVIC_INTEGRITY",
        threshold: "BLOCK_NONE",
      },
    ],
  });

  await generateText({
    model: model,
    prompt: "What is " + disease + "in brief? do not use markdown.",
    maxTokens: 150,
    temperature: 1,
  })
    .then((result) => {
      res.send(result.text);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};
