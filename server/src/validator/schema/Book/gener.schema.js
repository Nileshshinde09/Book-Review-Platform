import { z } from "zod";
import { BOOKGENERS } from "../../../constants";

export const GenreEnum = z.enum(BOOKGENERS);

