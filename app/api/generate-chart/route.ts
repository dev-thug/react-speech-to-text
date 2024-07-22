// app/api/generate-chart/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const openai = new OpenAIApi(
//   new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
//   })
// );

export async function POST(request: Request) {
  const { transcript } = await request.json();

  if (!transcript) {
    return NextResponse.json(
      { error: "No transcript provided" },
      { status: 400 }
    );
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate an EMR chart from the following transcript: ${transcript}`,
        },
      ],
      model: "gpt-3.5-turbo-instruct",
      //   model: "gpt-4o-mini",
    });

    const emrChart = response.choices[0];
    return NextResponse.json({ emrChart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
