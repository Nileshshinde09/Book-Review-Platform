import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Books, Images } from "../model/index.js";
// This operations are needs to be done by Admin only
const addBookHandler = asyncHandler(async (req, res) => {
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

  if (!user_id) {
    throw new ApiError(402, "User not found, Unauthorized access!");
  }

  if (!images || images.length === 0) {
    throw new ApiError(404, "Images not found!");
  }
  //Store book information
  const createdBook = await Books.create({
    createdBy: user_id,
    title,
    author,
    description,
    genre,
    publishedDate,
    accessibility,
    user,
  });
  if (!createdBook)
    return new ApiError(401, "Something went wrong while created book");

  //Store image to database
  const img_urls = [];
  for (const img of images) {
    const createdImage = await Images.create({
      userId: user_id,
      bookId: createdBook._id,
      imageFile: img,
    });
    img_urls.push(createdImage._id);
  }

  return res.status(200).json({
    message: "Book added successfully!",
    imageIds: img_urls,
  });
});

const updateBookHandler = asyncHandler(async () => {});
const deleteBookHandler = asyncHandler(async () => {});
const hideBookHandler = asyncHandler(async () => {});
export {
  addBookHandler,
  updateBookHandler,
  deleteBookHandler,
  hideBookHandler,
};
