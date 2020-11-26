"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1.3");
const { addUser } = require("./exercises/exercise-1.4");
const {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
} = require("./exercises/exercise-2");
const { batchImport } = require("./batchImport");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // exercise 1
  .get("/exercise-1/users", getUsers)
  // exercise 2
  .post("/exercise-1/users", addUser)

  .post("/exercise-2/greeting", createGreeting)

  .post("/exercise-2/greetingsInt", batchImport)

  .get("/exercise-2/:_id", getGreeting)

  .get("/ex-2/greeting", getGreetings)

  .delete("/ex-2/greeting/:_id", deleteGreeting)

  .put("/ex-2/greeting/:_id", updateGreeting)

  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
