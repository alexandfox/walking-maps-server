const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    avatar: {
      type: String,
      default: ""
    },
    location: String,
  	bio: String,
    social: {
      contact_name: String,
      website: String,
      twitter: String,
      instagram: String,
    },
    myMaps: [{type: Schema.Types.ObjectId, ref: 'Map'}],
    savedMaps: [{type: Schema.Types.ObjectId, ref: 'Map'}],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
