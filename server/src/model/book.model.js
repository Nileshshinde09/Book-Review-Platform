import mongoose, { Schema } from "mongoose";
import { GenreEnum } from "../validator/schema/index.js";
const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    genre: {
      type: String,
      enum: GenreEnum,
      required: [true, "please provide book genre."],
    },
    publishedDate: { type: Date },
  },
  {
    timestamps: true,
  }
);
export const Books = mongoose.model("Books", bookSchema);
