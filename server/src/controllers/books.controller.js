import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
// This operations are needs to be done by Admin only
// title
// author
// description
// genre
// publishedDate
// accessibility
const addBookHandler = asyncHandler(async (req, res) => {
  const { title, author, description, genre, publishedDate, accessibility, images } =
    req.body;
  //TODO: image upload code

    
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