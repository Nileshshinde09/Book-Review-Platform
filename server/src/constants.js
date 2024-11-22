export const DATABASE_NAME = String(process.env.DATABASE_NAME)
export const GLOBAL_API_RATELIMITER_REQUEST_COUNT = Number(process.env.GLOBAL_API_RATELIMITER_REQUEST_COUNT)
export const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET)
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET)
export const ACCESS_TOKEN_EXPIRY = String(process.env.ACCESS_TOKEN_EXPIRY)
export const REFRESH_TOKEN_EXPIRY = String(process.env.REFRESH_TOKEN_EXPIRY)
export const GENDER_TYPE = [
    "male",
    "female",
    "others"
]