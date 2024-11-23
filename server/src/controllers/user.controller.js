import { asyncHandler } from "../utils/asynchHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../model/user.model.js"
import jwt from "jsonwebtoken"
import { REFRESH_TOKEN_SECRET } from "../constants.js"
import mongoose from "mongoose"

const findUsersByUsername = asyncHandler(
    async (req, res) => {
        const userId = req?.user?._id;
        const username = req.query?.username;
        if (!userId) throw new ApiError(
            404,
            "User not found,unauthorised access."
        )
        if (!username) throw new ApiError(
            400,
            "Username requirred to check existance of user"
        )

        const escapeRegex = (string) => {
            return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&amp;');
        };
        const escapedSearchUsername = escapeRegex(username);
        // const users = await User.find({ username: { $regex: `.*${escapedSearchUsername}.*`, $options: 'i' } });
        const users = await User.aggregate(
            [
                {
                    $match: {
                        username: { $regex: `.*${escapedSearchUsername}.*`, $options: 'i' }
                    }
                },
                {
                    $lookup: {
                        from: "follows",
                        localField: "_id",
                        foreignField: "followeeId",
                        as: "isFollowing",
                        pipeline: [
                            {
                                $match: {
                                    followerId: new mongoose.Types.ObjectId(userId)
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "follows",
                        localField: "_id",
                        foreignField: "followerId",
                        as: "isFollower",
                        pipeline: [
                            {
                                $match: {
                                    followerId: new mongoose.Types.ObjectId(userId)
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        isFollowing: {
                            $cond: {
                                if: {
                                    $gte: [
                                        {
                                            $size: "$isFollowing",
                                        },
                                        1,
                                    ],
                                },
                                then: true,
                                else: false,
                            },
                        },

                        isFollower: {
                            $cond: {
                                if: {
                                    $gte: [
                                        {
                                            $size: "$isFollower",
                                        },
                                        1,
                                    ],
                                },
                                then: true,
                                else: false,
                            },
                        },
                    }
                },
                {
                    $project: {
                        fullName:1,
                        username: 1,
                        avatar: 1,
                        email: 1,
                        isFollowing: 1,
                        isFollower: 1
                    }
                }
            ]
        )
        if (!users) throw new ApiError(
            "something went wrong fetching user from database"
        )
        if (!users[0]) return res.
            status(404)
            .json(
                new ApiResponse(
                    404,
                    {
                        users: null
                    },
                    "User not found !! 🙁🙁"
                )
            )
        return res.
            status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        users
                    },
                    "User found successfully 😊😊"
                )
            )

    }
)


const createProfile = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;
        const { dob, avatar, profileBanner, bio } = req.body;
        if (!userId) throw new ApiError(
            400,
            "User not found , unauthorised access"
        )
        if (
            [
                dob, avatar, profileBanner, bio
            ].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required")
        }
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    dob, avatar, profileBanner, bio
                }
            },
            { new: true }
        ).select(
            "-password -refreshToken"
        )

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user,
                    "Profine created successfully!"
                )
            )


    }
)
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save(
            {
                validateBeforeSave: false
            }
        )
        return {
            refreshToken,
            accessToken
        }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and Access Token ")
    }
}
const registerUser = asyncHandler(
    async (req, res) => {
        const {
            fullName, email, username, password, gender
        } = req.body;
        if (
            [
                fullName, email, username, password, gender
            ].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required")
        }

        const existedUserWithEmail = await User.findOne(
            {
                email
            }
        )

        if (existedUserWithEmail) throw new ApiError(409, "User with email already exists")

        const existedUserWithUsername = await User.findOne(
            {
                username
            }
        )
        if (existedUserWithUsername) throw new ApiError(409, "User with usename already exists")
            
        const isAdmin= ADMIN_EMAILS.some((email) => email === existedUserWithUsername.email)
        const user = await User.create({
            fullName,
            email,
            password,
            gender,
            username: username.toLowerCase(),
            isAdmin
        })
        const createdUser = await User.findById(user._id)
            .select(
                "-password -refreshToken"
            )
        if (!createdUser) throw new ApiError(500, "Something went wrong while registering the user")
        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    createdUser,
                    "user register Successfully"
                )
            )
    }
)

const isUsernameUnique = asyncHandler(
    async (req, res) => {
        const username = req.query?.username;
        if (
            username.trim() == ""
        ) {
            throw new ApiError(400, "username is required")
        }

        const existedUserWithUsername = await User.findOne(
            {
                username
            }
        )
        if (existedUserWithUsername) return res
            .status(409)
            .json(
                new ApiResponse(
                    200,
                    { username },
                    "User Already exist"
                )
            )
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { username },
                    "user name is unique"
                )
            )
    }
)


const loginUser = asyncHandler(
    async (req, res) => {
        try {
            const { email, username, password } = req.body
            if (!email && !username) throw new ApiError(400, "username or email is required ")
            const user = await User.findOne(
                {
                    $or: [
                        { username }, { email }
                    ]
                }
            )
            if (ADMIN_EMAILS.some((email) => email === user.email)) {
                if (!user.isAdmin) {
                   await User.findByIdAndUpdate(
                    user?._id, 
                      { isAdmin: true }
                    );
                }
              }
            if (!user) return res
            .status(201)
            .json( new ApiResponse(
                404,
                {
                },
                "User with this email id not found!"
            ))

            const isPasswordWalid = await user.isPasswordCorrect(password)
            if (!isPasswordWalid) return res
            .status(201)
            .json( new ApiResponse(
                401,
                {
                },
                // "Invalid user credential"
                "Invalid Password."
            ))
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id)
            const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
            const options = {
                httpOnly: true,
                secure: true
            }
            return res
                .status(200)
                .cookie("accessToken", accessToken)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new ApiResponse(
                        200,
                        {
                            user: loggedInUser,
                            "refreshToken": refreshToken,
                            "accessToken": accessToken
                        },
                        "User logged in successfully!"
                    )
                )
        } catch (error) {
            throw new ApiError(
                500,
                error?.message || "Something went wrong while user login"
            )
        }
    }
)

const logoutUser = asyncHandler(
    async (req, res) => {

        try {
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    $unset: {
                        refreshToken: 1
                    }
                },
                {
                    new: true
                }
            )

            const options = {
                httpOnly: true,
                secure: true
            }

            return res.
                status(200)
                .clearCookie("accessToken")
                .clearCookie("refreshToken", options)
                .json(
                    new ApiResponse(
                        200,
                        {},
                        "User logged out successfully!"
                    )
                )
        } catch (error) {
            throw new ApiError(
                500,
                error?.message || "Something went wrong while logging out user"
            );
        }
    }
)

const refreshAccessToken = asyncHandler(
    async (req, res) => {
        try {
            const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

            if (!incomingRefreshToken) new ApiError(
                401,
                "unauthorised request"
            )

            const decodedToken = jwt.verify(
                incomingRefreshToken,
                REFRESH_TOKEN_SECRET
            )
            const user = await User.findById(decodedToken?._id)
            if (!user) throw new ApiError(401, "Invalid refresh Token")
            if (incomingRefreshToken != user?.refreshToken) throw new ApiError(401, "Refresh Token expired or used")

            const options = {
                httpOnly: true,
                secure: true
            }

            const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user?._id)

            return res
                .status(200)
                .cookie("accessToken", accessToken)
                .cookie("refreshToken", newRefreshToken, options)
                .json(
                    new ApiResponse(
                        200,
                        { accessToken, refreshToken: newRefreshToken },
                        "Access token refreshed"
                    )
                )
        } catch (error) {
            throw new ApiError(
                401,
                error?.message || "Invalid refresh token"
            )
        }
    }
)

const changeCurrentPassword = asyncHandler(
    async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user?._id)
        const isPasswordWalid = user.isPasswordCorrect(oldPassword)
        if (!isPasswordWalid) throw new ApiError(
            400,
            "Invalid old password"
        )
        user.password = newPassword
        await user.save(
            { validateBeforeSave: false }
        )
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password changed successfully"))
    }
)

const getCurrentUser = asyncHandler(
    async (req, res) => {
        if (!req.user) throw new ApiError(
            404,
            "User not found , unauthorised access."
        )
        //  await sendNotifications(String(req.user._id),"Hi Myself nilesh",{},"URL",NotificationTypesEnum.FOLLOWERS)
        await User.findByIdAndUpdate(
            req.user._id,
            {
                status: "Online"
            }
        )
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    req.user,
                    "User fetched successfully!"
                )
            )
    }
)

const updateAccountDetails = asyncHandler(
    async (req, res) => {
        const incomingObject = req.body;
        if (!incomingObject) throw new ApiError(
            404,
            "Account details not found"
        )
        const filteredObj = {};
        let hasFilledField = false;

        for (const key in incomingObject) {
            if (incomingObject[key] !== "") {
                filteredObj[key] = incomingObject[key];
                hasFilledField = true;
            }
        }
        if (!hasFilledField)
            throw new ApiError(400, "Atleast one field required")
        if (filteredObj?.email) {
            const existedUserWithEmail = await User.findOne(
                {
                    email: filteredObj?.email
                }
            )
            if (existedUserWithEmail) throw new ApiError(409, "User with email already exists")
        }
        if (filteredObj?.username) {

            const existedUserWithUsername = await User.findOne(
                {
                    username: filteredObj?.username
                }
            )
            if (existedUserWithUsername) throw new ApiError(409, "User with usename already exists")
        }
        if (!filteredObj) throw new ApiError(400,
            "data not available"
        )
        if (filteredObj.avatar) {
            filteredObj.avatar = new mongoose.Types.ObjectId(filteredObj.avatar)
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: filteredObj
            },
            { new: true }
        ).select(
            "-password -refreshToken"
        )

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user,
                    "Account details updated successfully!"
                )
            )
    }
)


export {
    generateAccessAndRefreshTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    isUsernameUnique,
    createProfile,
    findUsersByUsername,
}