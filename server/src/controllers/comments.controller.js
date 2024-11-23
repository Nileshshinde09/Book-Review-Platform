import { Comments } from "../model/comments.model.js";
import { User } from "../model/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
// content
// bookId
// user
const createCommentHandler = asyncHandler(async () => {
  try {
    const {
      bookId,
      title,
      author,
      description,
      genre,
      publishedDate,
      accessibility,
    } = req.body;
    const user_id = req.user?._id;
    if (!res.user?.isAdmin)
      throw new ApiError(
        401,
        "Admin only can authorised access this funcations."
      );
    // Check if user is authorized
    if (!user_id) {
      throw new ApiError(402, "User not found, Unauthorized access!");
    }

    // Validate bookId
    if (!bookId) {
      throw new ApiError(400, "Book ID is required.");
    }

    // Find and update the book
    let updatedBook;
    try {
      updatedBook = await Books.findOneAndUpdate(
        { _id: bookId, createdBy: user_id }, // Ensure user owns the book
        {
          title,
          author,
          description,
          genre,
          publishedDate: publishedDate ? new Date(publishedDate) : undefined,
          accessibility,
        },
        { new: true, runValidators: true } // Return the updated document
      );
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to update book. Ensure all fields are correct."
      );
    }

    if (!updatedBook) {
      throw new ApiError(404, "Book not found or unauthorized access.");
    }

    // Send success response
    return res
      .status(200)
      .json(new ApiResponse(200, updatedBook, "Book updated successfully!"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }

    console.error("Unexpected Error:", error);
    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred.",
    });
  }
});
const updateCommentHandler = asyncHandler(async () => {

});
const deleteCommentHandler = asyncHandler(async () => {

});
const hideCommentHandler = asyncHandler(async () => {

});
export {
  createCommentHandler,
  updateCommentHandler,
  deleteCommentHandler,
  hideCommentHandler,
};
