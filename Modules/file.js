const multer = require("multer");
const fileUploader = require("../Models/fileUpload");
const fs = require("fs");
const gltfValidator = require("gltf-validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(glb)$/)) {
      return cb(new Error("Only GLB files are allowed."));
    }
    cb(null, true);
  },
});

module.exports.fileUpload = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single("file")(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or upload failed" });
    } else {
      const file = req.file;
      const fileName = req.file.filename;
      const filePath = req.file.path;
      const uploadTime = new Date();

      const validationResult = await gltfValidator.validateBytes(
        new Uint8Array(file.buffer)
      );
      if (validationResult.issues.numErrors > 0) {
        return res
          .status(400)
          .json({ errors: validationResult.issues.messages });
      } else {
        await fileUploader.dbStore(fileName, filePath, uploadTime);

        return res.json({
          message: "File uploaded successfully",
        });
      }
    }
  } catch (error) {
    console.error("...........`", error);
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports.listFiles = async (req, res) => {
  try {
    const response = await fileUploader.loadData();
    if (response) {
      return res.json({
        data: response.data,
      });
    }
  } catch {
    return res.json({
      message: "something went wrong",
    });
  }
};
