export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { resume, jobDescription, apiKey: clientKey } = req.body;

  if (!resume?.trim() || !jobDescription?.trim()) {
    return res
      .status(400)
      .json({ error: "Resume and job description are required." });
  }

  const HF_KEY = process.env.HUGGINGFACE_API_KEY || clientKey;
  if (!HF_KEY) return res.status(500).json({ error: "NO_KEY" });

  const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

  const prompt = `<s>[INST] You are a professional resume coach and ATS expert. Analyze the resume against the job description.

RESUME:
${resume.slice(0, 2000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 1500)}

Return ONLY a raw JSON object — no explanation, no markdown, no code fences. Use exactly this structure:
{"match_score":75,"ats_score":68,"keyword_strength":60,"job_title":"Frontend Developer","present_keywords":["React","JavaScript","CSS"],"missing_keywords":["TypeScript","Next.js","REST API"],"rewritten_bullets":[{"original":"Built a news app","improved":"Engineered a real-time news aggregation app using React.js, reducing load time by 40% via lazy loading and deployed on Vercel for 99.9% uptime"},{"original":"Made a landing page clone","improved":"Developed a pixel-perfect responsive landing page clone achieving 95+ Lighthouse score with cross-browser compatibility"}],"tips":["Add TypeScript to your skills","Include measurable outcomes in bullets","Add a Next.js project to match the stack","Quantify your leadership role"],"overall_summary":"Your resume shows solid fundamentals but lacks key keywords. Adding targeted skills and metric-driven bullets would significantly improve your score."}

Now analyze the actual content above and return the real JSON for that resume and JD: [/INST]`;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1200,
            temperature: 0.3,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
          },
        }),
      },
    );

    if (response.status === 503) {
      return res
        .status(503)
        .json({
          error: "Model is warming up. Wait 20 seconds and try again.",
          retry: true,
        });
    }
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HuggingFace error ${response.status}: ${err}`);
    }

    const hfData = await response.json();
    const raw = Array.isArray(hfData)
      ? hfData[0]?.generated_text
      : hfData?.generated_text;
    if (!raw) throw new Error("Empty response from model.");

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      throw new Error("Model returned invalid output. Try again.");

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Analysis error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
