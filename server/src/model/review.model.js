import mongoose, { Schema } from "mongoose";
const reviewSchema = new Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: {
    type: mongoose.Schema.Types.ObjectId, ref: "Comments", required: true
  },
}, {
    timestamps:true
});
export const Reviews = mongoose.model("Reviews", reviewSchema);