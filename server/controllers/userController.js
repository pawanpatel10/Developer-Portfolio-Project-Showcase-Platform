const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Project = require('../models/Project');

const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, skills, socialLinks, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = name ?? user.name;
  user.bio = bio ?? user.bio;
  user.skills = Array.isArray(skills)
    ? skills.map((skill) => skill.trim()).filter(Boolean)
    : user.skills;
  user.socialLinks = {
    ...user.socialLinks,
    ...(socialLinks || {}),
  };
  user.avatar = avatar ?? user.avatar;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    bio: updatedUser.bio,
    skills: updatedUser.skills,
    socialLinks: updatedUser.socialLinks,
    avatar: updatedUser.avatar,
  });
});

const getProfileById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const projects = await Project.find({ userId: user._id }).sort({ createdAt: -1 });

  res.json({ user, projects });
});

module.exports = {
  updateProfile,
  getProfileById,
};
