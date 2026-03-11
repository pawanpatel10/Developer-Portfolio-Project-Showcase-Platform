const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Comment = require('../models/Comment');

const normalizeList = (list = []) =>
  list
    .map((item) => String(item).trim())
    .filter(Boolean);

const getProjects = asyncHandler(async (req, res) => {
  const { search = '', tech = '', tag = '', userId = '' } = req.query;
  const filters = {};

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    filters.userId = userId;
  }

  if (tech) {
    filters.techStack = { $in: [new RegExp(tech, 'i')] };
  }

  if (tag) {
    filters.tags = { $in: [new RegExp(tag, 'i')] };
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    filters.$or = [
      { title: regex },
      { description: regex },
      { techStack: regex },
      { tags: regex },
    ];
  }

  const projects = await Project.find(filters)
    .populate('userId', 'name avatar skills')
    .sort({ createdAt: -1 })
    .lean();

  const projectIds = projects.map((project) => project._id);
  const comments = await Comment.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    { $group: { _id: '$projectId', count: { $sum: 1 } } },
  ]);

  const commentMap = comments.reduce((accumulator, item) => {
    accumulator[item._id.toString()] = item.count;
    return accumulator;
  }, {});

  const payload = projects.map((project) => ({
    ...project,
    likesCount: project.likes.length,
    commentsCount: commentMap[project._id.toString()] || 0,
    trendingScore: project.likes.length * 2 + (commentMap[project._id.toString()] || 0),
  }));

  res.json(payload);
});

const getTrendingProjects = asyncHandler(async (req, res) => {
  const trendingProjects = await Project.aggregate([
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'projectId',
        as: 'commentDocs',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$commentDocs' },
        trendingScore: {
          $add: [{ $multiply: [{ $size: '$likes' }, 2] }, { $size: '$commentDocs' }],
        },
      },
    },
    { $sort: { trendingScore: -1, createdAt: -1 } },
    { $limit: 6 },
    {
      $project: {
        title: 1,
        description: 1,
        techStack: 1,
        tags: 1,
        githubLink: 1,
        demoLink: 1,
        likesCount: 1,
        commentsCount: 1,
        trendingScore: 1,
        createdAt: 1,
        userId: {
          _id: '$user._id',
          name: '$user.name',
          avatar: '$user.avatar',
          skills: '$user.skills',
        },
      },
    },
  ]);

  res.json(trendingProjects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('userId', 'name avatar bio skills socialLinks');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const comments = await Comment.find({ projectId: project._id })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({
    ...project.toObject(),
    likesCount: project.likes.length,
    commentsCount: comments.length,
    trendingScore: project.likes.length * 2 + comments.length,
    comments,
  });
});

const createProject = asyncHandler(async (req, res) => {
  const { title, description, techStack, tags, githubLink, demoLink } = req.body;

  if (!title || !description || !githubLink || !demoLink) {
    res.status(400);
    throw new Error('Title, description, GitHub link, and demo link are required');
  }

  const project = await Project.create({
    title,
    description,
    techStack: normalizeList(techStack),
    tags: normalizeList(tags),
    githubLink,
    demoLink,
    userId: req.user._id,
  });

  const populatedProject = await Project.findById(project._id).populate('userId', 'name avatar skills');
  res.status(201).json(populatedProject);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only edit your own project');
  }

  const { title, description, techStack, tags, githubLink, demoLink } = req.body;

  project.title = title ?? project.title;
  project.description = description ?? project.description;
  project.techStack = Array.isArray(techStack) ? normalizeList(techStack) : project.techStack;
  project.tags = Array.isArray(tags) ? normalizeList(tags) : project.tags;
  project.githubLink = githubLink ?? project.githubLink;
  project.demoLink = demoLink ?? project.demoLink;

  const updatedProject = await project.save();
  const populatedProject = await Project.findById(updatedProject._id).populate('userId', 'name avatar skills');

  res.json(populatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only delete your own project');
  }

  await Comment.deleteMany({ projectId: project._id });
  await project.deleteOne();

  res.json({ message: 'Project deleted successfully' });
});

const toggleProjectLike = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const hasLiked = project.likes.some((like) => like.toString() === req.user._id.toString());

  if (hasLiked) {
    project.likes = project.likes.filter((like) => like.toString() !== req.user._id.toString());
  } else {
    project.likes.push(req.user._id);
  }

  await project.save();

  const commentsCount = await Comment.countDocuments({ projectId: project._id });

  res.json({
    likesCount: project.likes.length,
    commentsCount,
    trendingScore: project.likes.length * 2 + commentsCount,
    liked: !hasLiked,
  });
});

const addProjectComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const comment = await Comment.create({
    userId: req.user._id,
    projectId: project._id,
    text: text.trim(),
  });

  const populatedComment = await Comment.findById(comment._id).populate('userId', 'name avatar');

  res.status(201).json(populatedComment);
});

module.exports = {
  getProjects,
  getTrendingProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectLike,
  addProjectComment,
};
