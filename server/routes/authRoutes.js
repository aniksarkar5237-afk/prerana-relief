import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Profile accessed successfully', user: req.user });
});

router.get('/admin/stats', verifyToken, requireRoles('admin'), (req, res) => {
  res.json({ message: 'Admin stats accessed successfully' });
});

export default router;
