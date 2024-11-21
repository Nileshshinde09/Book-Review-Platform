import MARIO_GAME_ANIMATION_404_ERROR_PAGE_V3 from "/mario404.gif";
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL).split(",").map((val:string)=>val.trim());
export { MARIO_GAME_ANIMATION_404_ERROR_PAGE_V3, ADMIN_EMAIL };
