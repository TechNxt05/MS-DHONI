import { NextResponse } from "next/server";

type Mode = "pressure" | "captaincy";
type Question = {
  id: string;
  prompt: string;
  options: string[];
  bestAnswerIndex: number;
  context: string;
};

type EvaluatePayload = {
  mode: Mode;
  questions: Question[];
  answers: number[];
};

const pressurePool: Question[] = [
  {
    id: "p1",
    prompt: "12 runs needed off 6 balls, one set batter. What is the best first-ball intent?",
    options: ["Take a calculated boundary option", "Blind slog for six", "Defend to read conditions"],
    bestAnswerIndex: 0,
    context: "Dhoni style balances intent and risk at start of over.",
  },
  {
    id: "p2",
    prompt: "6 needed off 4, spinner bowling wide line. Best plan?",
    options: ["Force power through off side", "Take twos and finish late", "Swing every ball"],
    bestAnswerIndex: 1,
    context: "Dhoni often controlled equation before finishing burst.",
  },
  {
    id: "p3",
    prompt: "8 off 5 with tailender at non-striker. Priority?",
    options: ["Retain strike and target matchups", "Give strike to tailender", "Attempt only sixes"],
    bestAnswerIndex: 0,
    context: "Strike management is key in pressure chases.",
  },
  {
    id: "p4",
    prompt: "Crowd pressure peaks, bowler misses yorker first two balls. Best reaction?",
    options: ["Stay calm and exploit repeat error", "Rush and overhit", "Switch to defense"],
    bestAnswerIndex: 0,
    context: "Captain Cool mindset punishes predictable execution errors.",
  },
  {
    id: "p5",
    prompt: "11 off final over, long boundaries on leg side. Best targeting zone?",
    options: ["Straight and extra-cover pockets", "Only leg-side slog", "No risk singles only"],
    bestAnswerIndex: 0,
    context: "Smart boundary mapping beats panic hitting.",
  },
];

const captaincyPool: Question[] = [
  {
    id: "c1",
    prompt: "Defending 9 in last over, new batter on strike. Best bowling instruction?",
    options: ["Hard yorkers outside off with boundary riders", "Random bouncer mix", "Spin surprise first ball"],
    bestAnswerIndex: 0,
    context: "Clarity over chaos under pressure.",
  },
  {
    id: "c2",
    prompt: "Left-right pair rotating strike in middle overs. Best captaincy call?",
    options: ["Change spinner angle and attack stumps", "Spread field and wait", "Use part-timer immediately"],
    bestAnswerIndex: 0,
    context: "Dhoni often used subtle angle changes to induce mistakes.",
  },
  {
    id: "c3",
    prompt: "Bowler misses plan twice. Best response?",
    options: ["Simple one-line reset and field cue", "Publicly show frustration", "Change bowler instantly"],
    bestAnswerIndex: 0,
    context: "Calm communication builds execution confidence.",
  },
  {
    id: "c4",
    prompt: "Opposition needs 18 off 12 with one finisher set. Best fielding philosophy?",
    options: ["Cut high-value zones and force twos", "Boundary-only protection", "Attacking infield all balls"],
    bestAnswerIndex: 0,
    context: "Denying high percentage shots is death-over control.",
  },
  {
    id: "c5",
    prompt: "Powerplay wicket falls. New aggressive batter arrives. Best immediate move?",
    options: ["Test with disciplined channel and trap field", "Short ball barrage only", "Defensive line to settle batter"],
    bestAnswerIndex: 0,
    context: "Early pattern-setting creates pressure window.",
  },
];

function pickRandomQuestions(mode: Mode, count = 3): Question[] {
  const pool = mode === "pressure" ? pressurePool : captaincyPool;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function computeScore(questions: Question[], answers: number[]) {
  return questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.bestAnswerIndex ? 1 : 0),
    0
  );
}

async function askGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  const res = await fetch(`${url}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function askOpenRouter(prompt: string): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  const model = process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-exp:free";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a concise cricket tactics evaluator. Return 3 short bullet points and one final rating out of 10.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? null;
}

async function evaluateWithAi(payload: EvaluatePayload, score: number) {
  const prompt = `
Mode: ${payload.mode}
Questions: ${JSON.stringify(payload.questions)}
User answers: ${JSON.stringify(payload.answers)}
Raw score: ${score}/${payload.questions.length}
Give feedback in plain text.
`;
  const gemini = await askGemini(prompt);
  if (gemini) return { provider: "gemini", feedback: gemini };
  const openRouter = await askOpenRouter(prompt);
  if (openRouter) return { provider: "openrouter", feedback: openRouter };
  return {
    provider: "local",
    feedback:
      "No AI key configured. You played with good intent. Improve by balancing risk, strike rotation, and situational awareness.",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as
      | { action: "generate"; mode: Mode }
      | ({ action: "evaluate" } & EvaluatePayload);

    if (body.action === "generate") {
      const questions = pickRandomQuestions(body.mode, 3);
      return NextResponse.json({ success: true, data: { questions } }, { status: 200 });
    }

    const score = computeScore(body.questions, body.answers);
    const ai = await evaluateWithAi(body, score);
    return NextResponse.json(
      {
        success: true,
        data: {
          score,
          total: body.questions.length,
          ...ai,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process challenge request." },
      { status: 500 }
    );
  }
}
