import { v4 as uuidv4 } from "uuid";
import chalk from "chalk";
import { readTodos, writeTodos } from "./utils.mjs";

export const addTask = async (task) => {
  const id = uuidv4();

  try {
    const todos = await readTodos();

    if (todos.length) {
      todos.push({ id, task, completed: false });
      await writeTodos(todos);
    } else {
      await writeTodos([{ id, task, completed: false }]);
    }
    console.log(chalk.green("Task added successfully!"));
    await getListOfTasks();
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeTodos([{ id, task, completed: false }]);
      console.log(chalk.green("Task added successfully!"));
      await getListOfTasks();
    } else {
      throw error;
    }
  }
};

const _getTasks = async () => {
  try {
    const data = await readTodos();
    if (!data.length) {
      return [];
    }
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    } else {
      throw error;
    }
  }
};

export const deleteTask = async (id) => {
  try {
    const todos = await readTodos();
    if (!todos.length) {
      return;
    }
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    await writeTodos(updatedTodos);
    console.log(chalk.green("Task removed successfully!"));
    await getListOfTasks();
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    } else {
      throw error;
    }
  }
};

export const clearTasks = async () => {
  try {
    await writeTodos([]);
    console.log(chalk.green("All tasks cleared successfully!"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    } else {
      throw error;
    }
  }
};

export const setTaskCompleted = async (id, completed = true) => {
  try {
    const todos = await readTodos();
    if (!todos.length) {
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    );
    await writeTodos(updatedTodos);
    console.log(chalk.green("Task status updated successfully!"));
    await getListOfTasks();
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
  if(!todos.length) {
    return console.log(chalk.yellow("Todo list is empty."));
  }
  return console.log(
    todos
      .map((todo) => {
        const statusColor = todo.completed ? chalk.green : chalk.yellow;
        const taskStatus = statusColor(`${todo.completed ? "[X]" : "[ ]"}`);
        return `${taskStatus} ${chalk.blue(todo.id)}: ${statusColor(todo.task)}`;
      })
      .join("\n")
  );
};
export const updateTask = async (id, newTask) => {
  try {
    const todos = await readTodos();
    if (!todos.length) {
      return;
    }
    const taskIndex = todos.findIndex((todo) => todo.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with id "${id}" not found.`);
    }
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task: newTask } : todo
    );
    await writeTodos(updatedTodos);
    console.log(chalk.green("Task updated successfully!"));
    await getListOfTasks();
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    } else {
      throw error;
    }
  }
};
