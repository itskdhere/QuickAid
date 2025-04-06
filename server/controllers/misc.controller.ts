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

  const gender = req.user?.gender;
  const dob = req.user?.dob;
  const age = dob
    ? Math.floor(
        (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  const prompt = `Generate 4 health tips for ${age} year old ${gender}. No markdown formatting.`;

  await generateObject({
    model: model,
    schema: HealthTipsSchema,
    prompt: prompt,
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
