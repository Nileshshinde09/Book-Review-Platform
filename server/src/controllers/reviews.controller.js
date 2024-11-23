import { Reviews, Books } from "../model/index.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const createReviewHandler = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;
  if (!user_id) {
    throw new ApiError(402, "User not found, Unauthorized access!");
  }

  const { rating, bookId } = req.body;
  if (Number(rating) < 0 || Number(rating) > 6) {
    throw new ApiError(
      401,
      "Invalid rating! Rating should be between 0 and 5."
    );
  }

  const book = await Books.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found with this ID");
  }

  const reviewed = await Reviews.create({
    bookId: book._id,
    userId: user_id,
    rating: rating,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { reviewed }, "Book reviewed successfully!"));
});

const updateReviewHandler = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;
  if (!user_id) {
    throw new ApiError(402, "User not found, Unauthorized access!");
  }

  const { reviewId, rating } = req.body;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required for updating.");
  }

  if (Number(rating) < 0 || Number(rating) > 6) {
    throw new ApiError(
      401,
      "Invalid rating! Rating should be between 0 and 5."
    );
  }

  const review = await Reviews.findOne({ _id: reviewId, userId: user_id });
  if (!review) {
    throw new ApiError(404, "Review not found or not authorized to update.");
  }

  review.rating = rating;
  await review.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedReview: review },
        "Review updated successfully!"
      )
    );
});

const deleteReviewHandler = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;
  if (!user_id) {
    throw new ApiError(402, "User not found, Unauthorized access!");
  }

  const { reviewId } = req.body;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required for deletion.");
  }

  const review = await Reviews.findOne({ _id: reviewId, userId: user_id });
  if (!review) {
    throw new ApiError(404, "Review not found or not authorized to delete.");
  }

  await review.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully!"));
});

const getReviewsByBookIdHandler = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    throw new ApiError(400, "Book ID is required to fetch reviews.");
  }

  const book = await Books.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found with this ID.");
  }

  const reviews = await Reviews.find({ bookId }).populate(
    "userId",
    "name email"
  );
  if (reviews.length === 0) {
    throw new ApiError(404, "No reviews found for this book.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { reviews }, "Reviews fetched successfully!"));
});

export {
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
  getReviewsByBookIdHandler,
};
