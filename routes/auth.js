const router = require("express").Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken

const User = require("../models/User");

// Configuration for Multer for File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// User Register API
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    // Take all the information from the form
    const { firstName, lastName, email, password } = req.body;

    // The uploaded file is available as req.file
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No Files Uploaded.");
    }

    // Path to the uploaded profile photo
    const profileImagePath = profileImage.path;

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // We must hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    // Save the new user
    await newUser.save();

    // Send a successful message
    res
      .status(200)
      .json({ message: "User Registered successfully!", user: newUser });
  } catch (err) {
    console.log("Error: ", err);
    res
      .status(500)
      .json({ message: "Registration Failed!", error: err.message });
  }
});

// User Login API
router.post("/login", async (req, res) => {
  try {
    // Take the information from the form
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate the JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;