import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Books, Images } from "../model/index.js";
const addBookHandler = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      genre,
      publishedDate,
      accessibility,
      images,
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
    // Validate images
    if (!images || images.length === 0) {
      throw new ApiError(404, "Images not found!");
    }

    // Store book information
    let createdBook;
    try {
      createdBook = await Books.create({
        createdBy: user_id,
        title,
        author,
        description,
        genre,
        publishedDate: new Date(publishedDate),
        accessibility,
      });
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to create book. Ensure all required fields are correct."
      );
    }

    if (!createdBook) {
      throw new ApiError(401, "Something went wrong while creating the book.");
    }

    // Store images in the database
    const img_urls = [];
    try {
      for (const img of images) {
        const createdImage = await Images.create({
          userId: user_id,
          bookId: createdBook._id,
          imageFile: img,
        });
        img_urls.push(createdImage._id);
      }
    } catch (error) {
      throw new ApiError(500, "Failed to upload images.");
    }

    // Send success response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: createdBook._id,
          createdBy: createdBook.createdBy,
          title: createdBook.title,
          author: createdBook.author,
          description: createdBook.description,
          genre: createdBook.genre,
          publishedDate: createdBook.publishedDate,
          accessibility: createdBook.accessibility,
          images: img_urls,
        },
        "Book added successfully!"
      )
    );
  } catch (error) {
    // Catch and handle errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }

    console.error("Unexpected Error:", error); // Log unexpected errors
    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred.",
    });
  }
});
const updateBookHandler = asyncHandler(async (req, res) => {
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

const deleteBookHandler = asyncHandler(async (req, res) => {
  try {
    const { bookId } = req.body;
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

    // Find and delete the book
    let deletedBook;
    try {
      deletedBook = await Books.findOneAndDelete({
        _id: bookId,
        createdBy: user_id, // Ensure user owns the book
      });
    } catch (error) {
      throw new ApiError(500, "Failed to delete the book.");
    }

    if (!deletedBook) {
      throw new ApiError(404, "Book not found or unauthorized access.");
    }

    // Send success response
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Book deleted successfully!"));
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

const hideBookHandler = asyncHandler(async (req, res) => {
  try {
    const { bookId } = req.body;
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

    // Find and update the book's visibility status
    let hiddenBook;
    try {
      hiddenBook = await Books.findOneAndUpdate(
        { _id: bookId, createdBy: user_id }, // Ensure user owns the book
        { accessibility: "" }, // Assuming an `isHidden` field in the schema
        { new: true }
      );
    } catch (error) {
      throw new ApiError(500, "Failed to hide the book.");
    }

    if (!hiddenBook) {
      throw new ApiError(404, "Book not found or unauthorized access.");
    }

    // Send success response
    return res
      .status(200)
      .json(new ApiResponse(200, hiddenBook, "Book hidden successfully!"));
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

export {
  addBookHandler,
  updateBookHandler,
  deleteBookHandler,
  hideBookHandler,
};
