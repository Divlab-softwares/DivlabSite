// pages/api/chat.ts ou app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const res = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const data = await res.json();

    // Pour GPT2 ou similaire, le texte généré est dans data[0].generated_text
    return NextResponse.json({ reply: data[0].generated_text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur API Hugging Face" }, { status: 500 });
  }
}
