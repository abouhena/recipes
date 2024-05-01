// models/Users.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipess" }], // Reference the 'recipess' collection here
}, { collection: 'users' }); // Assuming 'users' is the collection for user data

export const UserModel = mongoose.model("User", userSchema);
