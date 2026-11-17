import { NextResponse } from "next/server";
import { readJson } from "@/lib/validate";

type Mode = "pressure" | "captaincy";
type Question = {
  id: string;
  prompt: string;
  options: string[];
  bestAnswerIndex: number;
  context: string;
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

const byId = new Map([...pressurePool, ...captaincyPool].map((q) => [q.id, q]));

/** Questions as the client sees them: no answer key. */
function publicQuestion({ id, prompt, options }: Question) {
  return { id, prompt, options };
}

function pickRandomQuestions(mode: Mode, count = 3): Question[] {
  const pool = [...(mode === "pressure" ? pressurePool : captaincyPool)];
  // Fisher-Yates: an unbiased shuffle.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

async function askGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

async function askOpenRouter(prompt: string): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  const model = process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-exp:free";
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a concise cricket tactics evaluator. Return 3 short bullet points and one final rating out of 10." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

type Graded = { question: Question; answer: number; correct: boolean };

function localFeedback(graded: Graded[]) {
  const score = graded.filter((g) => g.correct).length;
  const verdict =
    score === graded.length
      ? "Ice in the veins. That is exactly how he would have played it."
      : score === 0
        ? "The crowd got to you. Slow the moment down and play the percentages."
        : "Good instincts, a couple of rushed calls. Control the equation before you chase the boundary.";
  return verdict;
}

async function evaluate(mode: Mode, graded: Graded[]) {
  const score = graded.filter((g) => g.correct).length;
  // The prompt is built only from server-side data, never from client text.
  const lines = graded
    .map((g, i) => `${i + 1}. ${g.question.prompt}
   Chose: ${g.question.options[g.answer]}
   Best: ${g.question.options[g.question.bestAnswerIndex]} (${g.question.context})`)
    .join("\n");
  const prompt = `Mode: ${mode}
Score: ${score}/${graded.length}
${lines}
Give feedback in plain text.`;

  const gemini = await askGemini(prompt);
  if (gemini) return { provider: "gemini", feedback: gemini };
  const openRouter = await askOpenRouter(prompt);
  if (openRouter) return { provider: "openrouter", feedback: openRouter };
  return { provider: "local", feedback: localFeedback(graded) };
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const mode: Mode = body?.mode === "captaincy" ? "captaincy" : "pressure";

  if (body?.action === "generate") {
    const questions = pickRandomQuestions(mode, 3).map(publicQuestion);
    return NextResponse.json({ success: true, data: { questions } }, { status: 200 });
  }

  if (body?.action === "evaluate" && Array.isArray(body.answers)) {
    const graded: Graded[] = [];
    for (const item of body.answers.slice(0, 5)) {
      const id = (item as { id?: unknown })?.id;
      const answer = (item as { answer?: unknown })?.answer;
      const question = typeof id === "string" ? byId.get(id) : undefined;
      if (!question || typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer >= question.options.length) {
        return NextResponse.json({ success: false, error: "Answer every scenario before checking results." }, { status: 400 });
      }
      graded.push({ question, answer, correct: answer === question.bestAnswerIndex });
    }
    if (!graded.length) {
      return NextResponse.json({ success: false, error: "Answer every scenario before checking results." }, { status: 400 });
    }

    const ai = await evaluate(mode, graded);
    return NextResponse.json(
      {
        success: true,
        data: {
          score: graded.filter((g) => g.correct).length,
          total: graded.length,
          breakdown: graded.map((g) => ({
            id: g.question.id,
            correct: g.correct,
            bestAnswerIndex: g.question.bestAnswerIndex,
            context: g.question.context,
          })),
          ...ai,
        },
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ success: false, error: "Unknown challenge request." }, { status: 400 });
}
