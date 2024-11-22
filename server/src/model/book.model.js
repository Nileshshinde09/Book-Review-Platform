import mongoose, { Schema } from "mongoose";
import { GenreEnum,AccessibilityEnum } from "../validator/schema/index.js";
import { ACCESSIBILITY_TYPES_ENUM } from "../constants.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
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
    accessibility:{
      type:String,
      enum:AccessibilityEnum,
      default:ACCESSIBILITY_TYPES_ENUM.PUBLIC
    }
  },
  {
    timestamps: true,
  }
);
bookSchema.plugin(mongooseAggregatePaginate)
export const Books = mongoose.model("Books", bookSchema);
