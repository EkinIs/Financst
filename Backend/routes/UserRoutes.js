import express from "express";
import {
    updateUser,
    deleteUser,
    getUser,
    addSymbolToWatchlist,
    deleteSymbolFromWatchlist
} from "../controllers/UserRoutesController.js";

const UserRoutes = express.Router();

// Update user route
UserRoutes.put("/:id", updateUser);

// Delete user route
UserRoutes.delete("/:id", deleteUser);

// Get user route
UserRoutes.get("/:id", getUser);

// Add symbol to watchlist route
UserRoutes.post("/:id/watchlist", addSymbolToWatchlist);

// Delete symbol from watchlist route
UserRoutes.delete("/:id/watchlist", deleteSymbolFromWatchlist);

export default UserRoutes;
