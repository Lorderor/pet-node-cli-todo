import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TODOS_FILE = path.join(__dirname, "todos.json");

export const isInvalidString = (str) => {
  return !str || typeof str !== "string" || str.trim() === "";
};

export const readTodos = async () => {
  try {
    const data = await fs.readFile(TODOS_FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

export const writeTodos = async (todos) => {
  await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
};