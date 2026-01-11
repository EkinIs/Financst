import mongoose from "mongoose";
const { Schema } = mongoose;

// Watchlist schema for embedded documents
const WatchListItemSchema = new Schema({
  type: { type: String, required: true }, // "Stock", "Crypto"
  symbol: { type: String, required: true }, // "AAPL"
  addPrice: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
  notes: { type: String }
});

const UserSchema = new Schema({
  // Naming standard: Google 'given_name' -> name, 'family_name' -> surname
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // Password: Can be empty for Google users, required for local users
  password: { type: String, required: function() { return this.authProvider === 'local'; } },
  
  // Google ID
  googleId: { type: String, unique: true, sparse: true },
  
  // Profile Picture (stored as URL) so will nıt be work :)
  profilePicture: { type: String, default: "" }, 
  
  // Optional: Short bio about the user
  bio: { type: String, default: "" },

  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  
  watchList: [WatchListItemSchema], 

  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;