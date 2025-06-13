import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  addTask,
  clearTasks,
  deleteTask,
  getListOfTasks,
  setTaskCompleted,
  updateTask,
} from "./todoService.mjs";
import { isInvalidString } from "./utils.mjs";

console.log("Welcome to the Todo CLI!");
yargs(hideBin(process.argv))
  .command(
    "add [task]",
    "Add todo task",
    (yargs) => {
      yargs.positional("task", { type: "string", describe: "todo task" });
    },
    async (argv) => {
      if (isInvalidString(argv.task)) {
        console.error(
          "Task description is required and must be a non-empty string!"
        );
        return;
      }
      try {
        await addTask(argv.task);
      } catch (err) {
        console.error("Error adding task:", err);
        return;
      }
    }
  )
  .command(
    "rm [id]",
    "Remove todo task",
    (yargs) => {
      yargs.positional("id", { type: "string", describe: "todo task id" });
    },
    async (argv) => {
      if (isInvalidString(argv.id)) {
        console.error("Task id is required and must be a non-empty string!");
        return;
      }
      try {
        await deleteTask(argv.id);
      } catch (err) {
        console.error("Error removing task:", err);
      }
    }
  )
  .command("clear", "Remove all tasks", {}, async () => {
    try {
      await clearTasks();
    } catch (err) {
      console.error("Error cleared all tasks:", err);
    }
  })
  .command(
    "mkDone [id]",
    "Mark todo task as done",
    (yargs) => {
      yargs.positional("id", { type: "string", describe: "todo task id" });
    },
    async (argv) => {
      if (isInvalidString(argv.id)) {
        console.error("Task id is required and must be a non-empty string!");
        return;
      }
      try {
        await setTaskCompleted(argv.id);
      } catch (err) {
        console.error("Task marked as done error:", err);
      }
    }
  )
  .command(
    "mkUndone [id]",
    "Mark todo task as undone",
    (yargs) => {
      yargs.positional("id", { type: "string", describe: "todo task id" });
    },
    async (argv) => {
      if (isInvalidString(argv.id)) {
        console.error("Task id is required and must be a non-empty string!");
        return;
      }
      try {
        await setTaskCompleted(argv.id, false);
      } catch (err) {
        console.error("Task marked as undone error:", err);
      }
    }
  )
  .command("list", "Get all todo tasks", {}, async () => {
    try {
      await getListOfTasks();
    } catch (err) {
      console.error("Error", err);
    }
  })
  .command(
    "update [id] [task]",
    "Update task by [id] [task]",
    (yargs) => {
      yargs
        .positional("id", { type: "string", describe: "todo task id" })
        .positional("task", { type: "string", describe: "todo task text" });
    },
    async (argv) => {
      if (isInvalidString(argv.id) || isInvalidString(argv.task)) {
        console.error(
          "Both id and task are required and must be non-empty strings!"
        );
        return;
      }
      try {
        await updateTask(argv.id, argv.task);
      } catch (err) {
        console.error("Error", err);
      }
    }
  )
  .help().argv;
