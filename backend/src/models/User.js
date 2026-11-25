const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true,
      select: false
    },

    refreshTokenHash: {
      type: String,
      select: false,
      default: null
    },

    role: {
      type: String,
      enum: ["listener", "artist", "admin"],
      default: "listener"
    },

    avatar: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    preferences: {
      language: {
        type: String,
        default: "en"
      },

      explicitContent: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);