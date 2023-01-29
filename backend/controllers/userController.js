import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc Auth the user & get token
// @route POST /api/users/login
// @ access  Public

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password 🤐");
  }
});

// @desc Register a New user
// @route POST /api/users
// @ access  Public

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

// @desc GET User Profile
// @route GET /api/users/profile
// @ access  Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found! 😫");
  }
});

// @desc Update  User Profile
// @route PUT /api/users/profile
// @ access  Private

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateduser = await user.save();
    res.json({
      _id: updateduser._id,
      name: updateduser.name,
      email: updateduser.email,
      isAdmin: updateduser.isAdmin,
      token: generateToken(updateduser._id),
    });
    res.json;
  } else {
    res.status(404);
    throw new Error("User Not Found! 😫");
  }
});

// @desc GET all Users
// @route GET /api/users
// @ access  Private/Admin

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc delete
// @route delete /api/users/:id
// @ access  Private/Admin

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User Deleted 😶" });
  } else {
    res.status(404);
    throw new Error("User Not Found 😛");
  }
  res.json(user);
});

// @desc GET Users by Id
// @route GET /api/users/:id
// @ access  Private/Admin

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found 🤐");
  }
});

// @desc Update  User
// @route PUT /api/users/:id
// @ access  Private

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updateduser = await user.save();
    res.json({
      _id: updateduser._id,
      name: updateduser.name,
      email: updateduser.email,
      isAdmin: updateduser.isAdmin,
    });
    res.json;
  } else {
    res.status(404);
    throw new Error("User Not Found! 😲");
  }
});
