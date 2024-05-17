const { client } = require("../dbConn/connection");
const db = client.db("file_app");
const collection = db.collection("files");

module.exports.dbStore = async (fileName, filePath, uploadTime) => {
  try {
    await client.connect();
    const existingData = await collection.insertOne({
      filename: fileName,
      path: filePath,
      time: uploadTime,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports.loadData = async () => {
  try {
    const listData = collection.find({});
    if (listData) {
      return listData.data;
    }
  } catch (error) {}
};
