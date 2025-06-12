import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addTask = async (task) => {
  const id = uuidv4();
  const todosFilePath = path.join(__dirname, "todos.json");

  try {
    const data = await fs.readFile(todosFilePath, "utf8");

    if (data) {
      const todos = JSON.parse(data);
      todos.push({ id, task, completed: false });
      await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2));
    } else {
      await fs.writeFile(
        todosFilePath,
        JSON.stringify([{ id, task, completed: false }], null, 2)
      );
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(
        todosFilePath,
        JSON.stringify([{ id, task, completed: false }], null, 2)
      );
    } else {
      throw error;
    }
  }
};

const _getTasks = async () => {
  const todosFilePath = path.join(__dirname, "todos.json");

  try {
    const data = await fs.readFile(todosFilePath, "utf8");
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    } else {
      throw error;
    }
  }
};

export const deleteTask = async (id) => {
  const todosFilePath = path.join(__dirname, "todos.json");

  try {
    const data = await fs.readFile(todosFilePath, "utf8");
    if (!data) {
      return;
    }
    const todos = JSON.parse(data);
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    await fs.writeFile(todosFilePath, JSON.stringify(updatedTodos, null, 2));
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    } else {
      throw error;
    }
  }
};

export const clearTasks = async () => {
  const todosFilePath = path.join(__dirname, "todos.json");

  try {
    await fs.writeFile(todosFilePath, JSON.stringify([], null, 2));
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    } else {
      throw error;
    }
  }
};
export const setTaskCompleted = async (id, completed = true) => {
  const todosFilePath = path.join(__dirname, "todos.json");

  try {
    const data = await fs.readFile(todosFilePath, "utf8");
    if (!data) {
      return;
    }
    const todos = JSON.parse(data);
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    );
    await fs.writeFile(todosFilePath, JSON.stringify(updatedTodos, null, 2));
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    } else {
      throw error;
    }
  }
};

export const getListOfTasks = async () => {
  const todos = await _getTasks();
  return todos
    .map((todo) => {
      const statusColor = todo.completed ? chalk.green : chalk.yellow;
      const taskStatus = statusColor(`${todo.completed ? "[X]" : "[ ]"}`);
      return `${taskStatus} ${chalk.blue(todo.id)}: ${statusColor(todo.task)}`;
    })
    .join("\n");
};
