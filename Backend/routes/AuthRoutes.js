import express from "express";
import {
    loginUser,
    singUpUser,
    forgotPassword,
    resetPassword
} from "../controllers/UserRoutesController.js";
import { googleLogin } from "../controllers/GoogleAuthController.js";

const AuthRoutes = express.Router();

// Login route
AuthRoutes.post("/login", loginUser);

// Sign up route
AuthRoutes.post("/signup", singUpUser);

// Google OAuth login/signup route
AuthRoutes.post("/google-login", googleLogin);

AuthRoutes.post("/forgot-password", forgotPassword);
AuthRoutes.post("/reset-password/:token", resetPassword);

export default AuthRoutes;
