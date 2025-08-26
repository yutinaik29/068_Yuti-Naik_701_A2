const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // to serve images
app.set("view engine", "ejs");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Routes
app.get("/", (req, res) => {
  res.render("form", { errors: [], old: {} });
});

app.post(
  "/submit",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "otherPics", maxCount: 5 },
  ]),
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("gender").notEmpty().withMessage("Select gender"),
    body("hobbies").custom((value, { req }) => {
      if (!req.body.hobbies) {
        throw new Error("Select at least one hobby");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // remove uploaded files if validation fails
      if (req.files) {
        Object.values(req.files).flat().forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }

      return res.render("form", {
        errors: errors.array(),
        old: req.body,
      });
    }

    // Save data for display
    const userData = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: Array.isArray(req.body.hobbies)
        ? req.body.hobbies
        : [req.body.hobbies],
      profilePic: req.files["profilePic"]
        ? req.files["profilePic"][0].filename
        : null,
      otherPics: req.files["otherPics"]
        ? req.files["otherPics"].map((f) => f.filename)
        : [],
    };

    // Save data into a file for download
    const downloadPath = path.join(
      __dirname,
      "downloads",
      `${userData.username}.txt`
    );

    let fileContent = `User Registration Details\n\n`;
    fileContent += `Username: ${userData.username}\n`;
    fileContent += `Email: ${userData.email}\n`;
    fileContent += `Gender: ${userData.gender}\n`;
    fileContent += `Hobbies: ${userData.hobbies.join(", ")}\n`;

    fs.writeFileSync(downloadPath, fileContent);

    res.render("result", { user: userData });
  }
);

// File download route
app.get("/download/:username", (req, res) => {
  const filePath = path.join(__dirname, "downloads", `${req.params.username}.txt`);
  res.download(filePath);
});

// Server start
app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
