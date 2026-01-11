import usermodel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// --- Update ---
const updateUser = async (req, res) => {
  const userId = req.params.id;
  // Get the data to be updated from the body
  const { name, surname, profilePicture, bio, currentPassword, newPassword } = req.body;

  try {
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 1. Update Basic Information (If Provided)
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (profilePicture) user.profilePicture = profilePicture;
    if (bio) user.bio = bio;

    // 2. Password Change Logic
    if (newPassword) {
      // If local user or has a password, ask for the old password
      if (user.password) {
        if (!currentPassword) {
          return res.status(400).json({ error: "Current password is required to change password" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Incorrect current password" });
        }
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        authProvider: user.authProvider,
        watchList: user.watchList,
      }
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server error while updating user" });
  }
};

// --- DELETE USER ---
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await usermodel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Server error while deleting user" });
  }
};

// --- LOGIN ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    if (!user.password) {
      return res.status(400).json({ error: "Please login with Google" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const expiresIn = req.body.rememberMe ? '7d' : '1h';
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profilePicture: user.profilePicture,
        watchList: user.watchList,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- SIGNUP ---
const singUpUser = async (req, res) => {
  const { name, surname, email, password } = req.body;
  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new usermodel({
      name,
      surname,
      email,
      password: hashedPassword,
      authProvider: 'local',
      profilePicture: "",
    });

    await newUser.save();

    const expiresIn = req.body.rememberMe ? '7d' : '1h';
    const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, { expiresIn });

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- GET USER ---
const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await usermodel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- ADD TO WATCHLIST ---
const addSymbolToWatchlist = async (req, res) => {
  const userId = req.params.id;
  const { type, symbol, addPrice, notes } = req.body;

  try {
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Duplicate Check (Prevent adding the same stock twice)
    const exists = user.watchList.some(item => item.symbol === symbol);
    if (exists) {
      return res.status(400).json({ error: "Symbol already in watchlist" });
    }

    user.watchList.push({ type, symbol, addPrice, notes });
    await user.save();

    res.status(200).json({
      message: "Symbol added to watchlist",
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profilePicture: user.profilePicture, // Also return this
        watchList: user.watchList
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- DELETE FROM WATCHLIST ---
const deleteSymbolFromWatchlist = async (req, res) => {
  const userId = req.params.id;
  const { symbol } = req.body;

  try {
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.watchList = user.watchList.filter(item => item.symbol !== symbol);
    await user.save();

    res.status(200).json({
      message: "Symbol removed from watchlist",
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profilePicture: user.profilePicture, // Also return this
        watchList: user.watchList
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is Google Auth (no password to reset)
    if (!user.password) {
      return res.status(400).json({ error: "Please login with Google" });
    }

    // Generate a temporary token valid for 15 minutes
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "15m" });

    // Create Reset Link (Frontend URL)
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Initialize transporter here to ensure env vars are loaded
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// [NEW] Reset Password Controller
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify Token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await usermodel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Link expired. Please request a new one." });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// Export all controllers
export {
  loginUser,
  updateUser,
  deleteUser,
  getUser,
  singUpUser,
  addSymbolToWatchlist,
  deleteSymbolFromWatchlist,
  forgotPassword,
  resetPassword 
};