const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    index: true,         // Index for faster lookups
    lowercase: true,     // Store usernames in lowercase
    trim: true           // Remove whitespace
  },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Hash password before saving - only if password was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method - check if provided password matches hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);