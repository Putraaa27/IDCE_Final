import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5500;

function loadEnv() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    console.log(".env tidak ditemukan. Gemini akan memakai environment server jika ada.");
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex === -1) continue;

    const key = trimmed.slice(0, equalIndex).trim().replace(/^\uFEFF/, "");
    const value = trimmed.slice(equalIndex + 1).trim().replace(/^["']|["']$/g, "");

    process.env[key] = value;
  }

  const loadedKey = process.env.GEMINI_API_KEY || "";
  if (loadedKey) {
    console.log(`Gemini key terbaca: ${loadedKey.slice(0, 6)}...${loadedKey.slice(-4)}`);
  } else {
    console.log("GEMINI_API_KEY belum terbaca");
  }
}

loadEnv();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => body += chunk.toString());
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function cleanAIText(text) {
  return String(text || "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/###/g, "")
    .replace(/##/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")
    .replace(/\$/g, "")
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function makePrompt(message) {
  return `
Kamu adalah Gemini Campus Guide untuk landing page IDCE, yaitu Immersive Digital Campus Experience ITSB.

Tugas:
Jawab pertanyaan pengunjung tentang ITSB, kampus, PMB, lokasi, fasilitas, kehidupan mahasiswa, Data Science dashboard, gamification, dan fitur IDCE.

Gaya jawaban:
Gunakan bahasa Indonesia.
Gunakan gaya ramah, jelas, akademik, dan profesional.
Jawaban harus mudah dipahami calon mahasiswa dan orang awam.
Jawaban maksimal 2 sampai 4 paragraf pendek.
Jangan terlalu panjang.
Jangan terlalu kaku.

Aturan format wajib:
Jangan gunakan Markdown.
Jangan gunakan tanda bintang.
Jangan gunakan teks tebal.
Jangan gunakan heading.
Jangan gunakan LaTeX.
Jangan gunakan tabel.
Jangan gunakan bullet simbol.
Jika perlu daftar, gunakan angka 1, 2, 3 dengan kalimat pendek.
Jangan mengarang data angka yang tidak pasti.

Konteks:
IDCE adalah landing page interaktif untuk mengenalkan kampus ITSB secara modern melalui virtual campus, campus hotspot, student life preview, gamification mission, Data Science dashboard, YouTube preview, Google Maps, Gemini ChatBot, dan registration funnel.
ITSB adalah Institut Teknologi Sains Bandung.

Pertanyaan user:
${message}
`;
}

async function callGemini(apiKey, model, prompt, history = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = [
    ...history.map((item) => ({
      role: item.role === "model" ? "model" : "user",
      parts: [{ text: String(item.text || "") }]
    })),
    { role: "user", parts: [{ text: prompt }] }
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.55,
        topP: 0.9,
        maxOutputTokens: 520
      }
    })
  });

  const result = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    result
  };
}

function shouldTryNextModel(errorMessage, status) {
  const text = String(errorMessage || "").toLowerCase();

  return (
    status === 429 ||
    status === 503 ||
    text.includes("high demand") ||
    text.includes("overloaded") ||
    text.includes("temporarily") ||
    text.includes("try again later")
  );
}

async function handleGemini(req, res) {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "GEMINI_API_KEY belum terbaca oleh server. Isi file .env lalu restart server." }));
      return;
    }

    const rawBody = await readRequestBody(req);
    const body = JSON.parse(rawBody || "{}");
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Pertanyaan masih kosong." }));
      return;
    }

    const envModel = (process.env.GEMINI_MODEL || "").trim();
    const models = [
  envModel,
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash"
].filter(Boolean);

    const uniqueModels = [...new Set(models)];
    const prompt = makePrompt(message);

    let lastError = "";
    let lastStatus = 500;

    for (const model of uniqueModels) {
      console.log(`Mencoba model Gemini: ${model}`);

      const { ok, status, result } = await callGemini(apiKey, model, prompt, history);

      if (ok) {
        const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya belum bisa memberikan jawaban saat ini.";

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ reply: cleanAIText(reply), model }));
        return;
      }

      lastStatus = status;
      lastError = result?.error?.message || `Gemini gagal dijalankan pada model ${model}.`;

      console.log(`Model gagal: ${model}`);
      console.log(lastError);

      if (!shouldTryNextModel(lastError, status)) break;
    }

    res.writeHead(lastStatus, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: lastError || "Gemini belum dapat dijalankan. Coba beberapa saat lagi." }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: error.message || "Terjadi kesalahan pada server Gemini." }));
  }
}

function serveStatic(req, res) {
  let filePath = decodeURIComponent(req.url.split("?")[0]);
  if (filePath === "/") filePath = "/index.html";

  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(__dirname, safePath);

  if (!absolutePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(absolutePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404</h1><p>File tidak ditemukan.</p>");
      return;
    }

    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/gemini") && req.method === "POST") {
    await handleGemini(req, res);
    return;
  }

  serveStatic(req, res);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} sedang dipakai. Tutup server lama atau jalankan: Get-NetTCPConnection -LocalPort ${PORT} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`IDCE running at http://localhost:${PORT}`);
});
