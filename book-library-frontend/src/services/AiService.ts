import api from "./api";

export const searchFreeBooks = async (query: string) => {
  const url = `http://localhost:5049/api/ai/free-books?query=${encodeURIComponent(query)}`;
  console.log("TEMP AiService fetch ->", url);
  const resp = await fetch(url);
  const txt = await resp.text();
  try {
    return JSON.parse(txt);
  } catch {
    return { raw: txt, text: txt };
  }
};

