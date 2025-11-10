//api codes
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterModel = require("./models/Register");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// =============================

//============================

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/Safnet");

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  RegisterModel.findOne({ email: email }).then((user) => {
    if (user) {
      //using bcrypt
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          //jwt token
          const token = jwt.sign({ email: user.email }, "jwt-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          res.json("Success");
        } else {
          return res.json("The password is incorrect");
        }
      });
    } else {
      res.json("No record found");
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      RegisterModel.create({ name, email, password: hash })
        .then((registers) => res.json(registers))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message));
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("The token was not available");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json("Token is wrong");
      next();
    });
  }
};
app.get("/home", verifyUser, (req, res) => {
  return res.json("Success");
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  RegisterModel.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.send({ Status: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "1d",
    });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: "priyanshi0939.be23@chitkara.edu.in",
      subject: "Reset your password",
      text: `http://localhost:5173/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  });
});

app.listen(3001, () => {
  console.log("Server is running");
});

app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          RegisterModel.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
});

//==================================================Malware======
const axios = require("axios");
const multer = require("multer");

const upload = multer({ limits: { fileSize: 32 * 1024 * 1024 } }); // 32 MB limit
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;

// Helper to make requests
const makeRequest = async (url, options = {}) => {
  const response = await axios({
    url,
    ...options,
    headers: {
      "x-apikey": VIRUSTOTAL_API_KEY,
      ...options.headers,
    },
  });
  return response.data;
};

// ======================= Scan URL =======================
app.post("/api/scan-url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // Submit URL
    const submitResult = await makeRequest(
      "https://www.virustotal.com/api/v3/urls",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: `url=${encodeURIComponent(url)}`,
      }
    );

    const analysisId = submitResult.data?.id;
    if (!analysisId) throw new Error("Failed to get analysis ID");

    // Poll for results
    const result = await pollAnalysisResults(analysisId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================= Scan File =======================
app.post("/api/scan-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const uploadResult = await axios.post(
      "https://www.virustotal.com/api/v3/files",
      formData,
      {
        headers: {
          "x-apikey": VIRUSTOTAL_API_KEY,
          ...formData.getHeaders(),
        },
      }
    );

    const fileId = uploadResult.data?.data?.id;
    if (!fileId) throw new Error("Failed to get file ID");

    const result = await pollAnalysisResults(fileId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================= Poll Analysis =======================
const pollAnalysisResults = async (id) => {
  const maxAttempts = 20;
  let attempts = 0;
  let interval = 2000;

  while (attempts < maxAttempts) {
    const analysisResult = await makeRequest(
      `https://www.virustotal.com/api/v3/analyses/${id}`
    );

    const status = analysisResult.data?.attributes?.status;
    if (status === "completed") return analysisResult;
    if (status === "failed") throw new Error("Analysis failed");

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, interval));
    interval = Math.min(interval * 1.5, 8000);
  }

  throw new Error("Analysis timed out");
};
