export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY belum dikonfigurasi di Environment Variables Vercel." });
  }

  const cleanAIText = (text) => String(text || "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/###/g, "")
    .replace(/##/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")
    .replace(/\$/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Pertanyaan kosong." });
    }

    const prompt = `
Kamu adalah Gemini Campus Guide untuk landing page IDCE Institut Teknologi Sains Bandung.

Jawab dalam Bahasa Indonesia yang jelas, ramah, akademik, dan profesional.
Jawaban maksimal 2 sampai 4 paragraf pendek.
Jangan gunakan Markdown.
Jangan gunakan tanda bintang.
Jangan gunakan heading.
Jangan gunakan LaTeX.
Jangan gunakan tabel.
Jika perlu daftar, gunakan angka 1, 2, 3.

Konteks:
IDCE adalah website interaktif ITSB dengan virtual campus, hotspot kampus, Gemini ChatBot, gamification, Data Science dashboard, YouTube preview, Google Maps, dan registration funnel.

Pertanyaan:
${message}
`;

    const contents = [
      ...history.map((item) => ({
        role: item.role === "model" ? "model" : "user",
        parts: [{ text: String(item.text || "") }]
      })),
      { role: "user", parts: [{ text: prompt }] }
    ];

    const models = [
      process.env.GEMINI_MODEL || "gemini-2.0-flash",
      "gemini-2.0-flash",
      "gemini-2.5-flash-lite",
      "gemini-1.5-flash"
    ].filter(Boolean);

    const uniqueModels = [...new Set(models)];

    let lastError = "";
    let lastStatus = 500;

    for (const model of uniqueModels) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.55,
            maxOutputTokens: 520
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya belum bisa memberikan jawaban saat ini.";
        return res.status(200).json({ reply: cleanAIText(reply), model });
      }

      lastStatus = response.status;
      lastError = data.error?.message || "Gagal menghubungi Gemini API.";

      const retryable = response.status === 429 || response.status === 503 || /high demand|overloaded|temporarily|try again later/i.test(lastError);
      if (!retryable) break;
    }

    return res.status(lastStatus).json({ error: lastError || "Gagal menghubungi Gemini API." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Terjadi kesalahan server." });
  }
}
