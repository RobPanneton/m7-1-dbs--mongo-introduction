const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = await client.db("exercise_1");
  const data = await db.collection("users").find().toArray();

  if (data.length !== 0) {
    await res.status(200).json({
      status: 200,
      data: data,
    });
  } else {
    await res.status(400).json({
      status: 404,
      message: "there is no data in this database",
    });
  }
};

module.exports = {
  getUsers,
};
