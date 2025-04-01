import { Request, Response } from "express";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const healthTips = async (
  req: Request,
  res: Response
): Promise<void> => {
  const HealthTipsSchema = z.object({
    tips: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        })
      )
      .length(4),
  });

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

  await generateObject({
    model: model,
    schema: HealthTipsSchema,
    prompt: "Generate 4 health tips. No markdown formatting.",
    maxTokens: 500,
    temperature: 0.7,
  })
    .then((result) => {
      res.json(result.object);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};
