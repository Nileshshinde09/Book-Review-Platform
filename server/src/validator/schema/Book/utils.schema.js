import { object, z } from "zod";
import { ACCESSIBILITY_TYPES_ENUM, BOOKGENERS } from "../../../constants";

export const GenreEnum = z.enum(BOOKGENERS);    
export const AccessibilityEnum = z.enum(Object.values(ACCESSIBILITY_TYPES_ENUM));
