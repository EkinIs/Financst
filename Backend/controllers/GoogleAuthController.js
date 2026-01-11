import { OAuth2Client } from 'google-auth-library';
import usermodel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper Function: Token Generator
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

/**
 * Google OAuth Login/Signup Handler
 * Verifies Google token and creates/logs in user
 */
export const googleLogin = async (req, res) => {
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
        return res.status(400).json({ error: "Google credential or access token is required" });
    }

    try {
        let googleId, email, firstName, lastName, profilePicture;

        if (credential) {
            // Verify Google ID Token
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            googleId = payload.sub;
            email = payload.email;
            firstName = payload.given_name;
            lastName = payload.family_name;
            profilePicture = payload.picture;
        }else if (accessToken) {
            // 1. First, validate the access token
            const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
            const tokenInfo = await tokenInfoResponse.json();

            // If the token is not issued for our Client ID, reject it!
            if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
                return res.status(401).json({ error: "Invalid token audience. This token was not issued for this app." });
            }

            // 2. Then, fetch user info
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!userInfoResponse.ok) {
                throw new Error("Failed to fetch user info from Google");
            }

            const payload = await userInfoResponse.json();
            googleId = payload.sub;
            email = payload.email;
            firstName = payload.given_name;
            lastName = payload.family_name;
            profilePicture = payload.picture;
        }

        // Check if user exists by email or googleId
        let user = await usermodel.findOne({
            $or: [{ email }, { googleId }]
        });

        if (user) {
            // User exists - Update Google info if needed
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                user.profilePicture = profilePicture;
                await user.save();
            }
        } else {
            // User doesn't exist - Create new user
            user = new usermodel({
                name: firstName || email.split('@')[0],
                surname: lastName || '',
                email,
                googleId,
                profilePicture,
                authProvider: 'google',
                // No password needed for Google users
            });

            await user.save();
        }

        // Generate JWT token
        const token = createToken(user._id);

        // Send response
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider,
                watchList: user.watchList,
            },
            token,
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(401).json({ error: "Invalid Google token" });
    }
};
