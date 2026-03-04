import { readFile } from "fs/promises";
import path from "path";

const MAX_TEXT_LENGTH = 50_000;

const TEXT_EXTENSIONS = new Set([".txt", ".csv", ".md", ".json", ".xml", ".html", ".htm", ".log", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".env"]);

export async function extractTextContent(filePath: string, mimeType: string): Promise<string | null> {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (TEXT_EXTENSIONS.has(ext) || mimeType.startsWith("text/")) {
      const content = await readFile(filePath, "utf-8");
      return content.slice(0, MAX_TEXT_LENGTH);
    }

    if (ext === ".pdf" || mimeType === "application/pdf") {
      return await extractPdfText(filePath);
    }

    return null;
  } catch (err) {
    console.error(`[file-text-extractor] Failed to extract text from ${filePath}:`, err);
    return null;
  }
}

async function extractPdfText(filePath: string): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
    const buffer = await readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text.slice(0, MAX_TEXT_LENGTH) || null;
  } catch (err) {
    console.error(`[file-text-extractor] PDF extraction failed for ${filePath}:`, err);
    return null;
  }
}
