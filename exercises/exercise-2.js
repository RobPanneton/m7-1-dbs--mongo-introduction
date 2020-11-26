const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = await client.db("exercise_2");

    const result = await db.collection("greetings").insertOne(req.body);

    assert.equal(1, result.insertedCount);

    res.status(201).json({
      status: 201,
      data: req.body,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    });
  }

  await client.close();
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = await client.db("exercise_2");

    const result = await db.collection("greetings").findOne({ _id });

    res.status(200).json({
      status: 200,
      _id,
      data: result,
    });

    client.close();
  } catch (err) {
    res.status(404).json({ status: 404, _id, data: "Not Found" });

    client.close();
  }
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { start, limit } = req.query;

  try {
    await client.connect();

    const db = await client.db("exercise_2");

    const result = await db.collection("greetings").find().toArray();

    let resultsArray = [];

    for (let i = start; i < start + limit; i++) {
      if (i >= result.length) {
        break;
      }
      if (resultsArray.length - 1 === limit) {
        break;
      }
      if (resultsArray.length < limit && i < result.length)
        resultsArray.push(result[i]);
    }

    res.status(200).json({
      status: 200,
      start: start,
      limit: limit,
      data: resultsArray,
    });

    client.close();
  } catch (err) {
    res.status(404).json({ status: 404, data: "Not Found" });

    client.close();
  }
};

const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;

  try {
    await client.connect();

    const db = await client.db("exercise_2");

    const result = await db.collection("greetings").deleteOne({ _id });

    res.status(204).json({
      status: 204,
      data: result,
      message: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "failure",
    });
  }

  await client.close();
};

const updateGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;
  const query = { _id };

  let bodyObject = { ...req.body };

  const checker = Object.keys(bodyObject).some((key) => key === "hello");
  if (!checker) {
    return res.status(500).json({
      status: 500,
      message: "failure",
    });
  }

  console.log(checker);

  Object.keys(bodyObject).forEach((key) => {
    if (key !== "hello") delete bodyObject.key;
  });
  const newValues = { $set: { ...bodyObject } };

  try {
    await client.connect();

    const db = await client.db("exercise_2");

    const results = await db
      .collection("greetings")
      .updateOne(query, newValues);

    assert.equal(1, results.matchedCount);
    assert.equal(1, results.modifiedCount);

    res.status(200).json({
      status: 200,
      _id,
      ...req.body,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "failure",
    });
  }

  await client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
