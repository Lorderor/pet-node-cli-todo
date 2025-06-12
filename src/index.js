import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  addTask,
  clearTasks,
  deleteTask,
  getListOfTasks,
  setTaskCompleted,
} from "./todoService.mjs";

console.log("Welcome to the Todo CLI!");
yargs(hideBin(process.argv))
  .command(
    "add [task]",
    "Add todo task",
    (yargs) => {
      yargs.positional("task", { type: "string", describe: "todo task" });
    },
    (argv) => {
      addTask(argv.task)
        .then(() => {
          console.log("Task added successfully!");
          getListOfTasks().then((data) => console.log(data));
        })
        .catch((err) => console.error("Error adding task:", err));
    }
  )
  .command(
    "rm [id]",
    "Remove todo task",
    (yargs) => {
      yargs.positional("id", { type: "string", describe: "todo task id" });
    },
    (argv) => {
      deleteTask(argv.id)
        .then(() => {
          console.log("Task removed successfully!");
          getListOfTasks().then((data) => console.log(data));
        })
        .catch((err) => console.error("Error removing task:", err));
    }
  )
  .command("clear", "Remove all tasks", {}, () => {
    clearTasks()
      .then(() => console.log("All tasks cleared successfully!"))
      .catch((err) => console.error("Error cleared all tasks:", err));
  })
  .command(
    "mkDone [id]",
    "Mark todo task as done",
    (yargs) => {
      yargs.positional("id", { type: "string", describe: "todo task id" });
    },
    (argv) => {
      setTaskCompleted(argv.id)
        .then(() => {
          console.log("Task marked as done successfully!");
          getListOfTasks().then((data) => console.log(data));
        })
        .catch((err) => console.error("Task marked as done error:", err));
    }
  )
  .command(
    "mkUndone [id]",
    "Mark todo task as undone",
    (yargs) => {
      yargs.positional("id", { type: "string", describe: "todo task id" });
    },
    (argv) => {
      setTaskCompleted(argv.id, false)
        .then(() => {
          console.log("Task marked as undone successfully!");
          getListOfTasks().then((data) => console.log(data));
        })
        .catch((err) => console.error("Task marked as undone error:", err));
    }
  )
  .command("list", "Get all todo tasks", {}, () => {
    getListOfTasks()
      .then((data) => console.log(data))
      .catch((err) => console.error("Error", err));
  })
  .help().argv;
