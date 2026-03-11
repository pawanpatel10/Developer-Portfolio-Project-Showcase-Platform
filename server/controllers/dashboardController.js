const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Comment = require('../models/Comment');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user._id }).select('_id likes title createdAt').lean();
  const projectIds = projects.map((project) => project._id);

  const totalLikes = projects.reduce((sum, project) => sum + project.likes.length, 0);
  const totalComments = projectIds.length
    ? await Comment.countDocuments({ projectId: { $in: projectIds } })
    : 0;

  res.json({
    totalProjects: projects.length,
    totalLikes,
    totalComments,
    recentProjects: projects.slice(0, 5),
  });
});

module.exports = { getDashboardSummary };
