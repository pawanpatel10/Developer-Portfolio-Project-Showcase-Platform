const express = require('express');
const {
  getProjects,
  getTrendingProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectLike,
  addProjectComment,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProjects);
router.get('/trending', getTrendingProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/like', protect, toggleProjectLike);
router.post('/:id/comments', protect, addProjectComment);

module.exports = router;
