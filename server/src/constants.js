import path from "path";
import { fileURLToPath } from "url";
export const DATABASE_NAME = String(process.env.DATABASE_NAME);
export const GLOBAL_API_RATELIMITER_REQUEST_COUNT = Number(
  process.env.GLOBAL_API_RATELIMITER_REQUEST_COUNT
);
export const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET);
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
export const ACCESS_TOKEN_EXPIRY = String(process.env.ACCESS_TOKEN_EXPIRY);
export const REFRESH_TOKEN_EXPIRY = String(process.env.REFRESH_TOKEN_EXPIRY);
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((val) => val.trim())
  .filter((val) => val !== "");

// -----------Image Converter Values--------------------------------------------------------------

export const VALID_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".webp",
];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export constants
export const INPUTDIRECTORY = path.resolve(__dirname, "public", "users-logo");
export const OUTPUTJSONFILE = path.resolve(
  __dirname,
  "assets",
  "profileImages",
  "base64ProfileImages.json"
);
// -----------------------------------------------------------------------------------
export const GENDER_TYPE = ["male", "female", "others"];
export const ACCESSIBILITY_TYPES_ENUM = Object.freeze({
  PRIVATE: "private",
  PUBLIC: "public",
  ADMIN_ONLY: "admin-only",
});

export const BOOKGENERS = [
  "Adventure",
  "Classics",
  "Contemporary",
  "Crime/Detective",
  "Drama",
  "Fantasy",
  "Historical Fiction",
  "Horror",
  "Humor",
  "Literary Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller/Suspense",
  "Western",
  "Young Adult",
  "Dystopian",
  "Biography/Autobiography",
  "Self-Help",
  "True Crime",
  "History",
  "Philosophy",
  "Psychology",
  "Travel",
  "Science",
  "Cooking/Food",
  "Art/Photography",
  "Health/Fitness",
  "Business/Economics",
  "Religion/Spirituality",
  "Politics",
  "Essays",
  "Memoirs",
  "Epic",
  "Sonnet",
  "Haiku",
  "Lyric Poetry",
  "Narrative Poetry",
  "Free Verse",
  "Limerick",
  "Ode",
  "Elegy",
  "Ballad",
  "Graphic Novels",
  "Short Stories",
  "Anthologies",
  "Children's Books",
  "New Adult",
  "Paranormal",
  "Urban Fantasy",
  "Steampunk",
];
