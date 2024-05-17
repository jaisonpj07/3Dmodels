const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri =
  "mongodb+srv://user_1:jaison7@cluster0.fbiwq7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

module.exports = {
  client,
};
