import { Router } from 'express';
import { faker } from '@faker-js/faker';
import authMiddleware from '../middleware/auth.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

const router = Router();

// Initialize categories if they don't exist
const initializeCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    const categories = Array.from({ length: 100 }, () => ({
      name: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      image: faker.image.url()
    }));
    await Category.insertMany(categories);
    console.log('Categories initialized');
  }
};

// Initialize categories on server start
initializeCategories().catch(console.error);

// Get categories with pagination (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find().skip(skip).limit(limit),
      Category.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      categories,
      currentPage: page,
      totalPages,
      totalCategories: total
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Update user's selected categories (protected route)
router.post('/update-preferences', authMiddleware, async (req, res) => {
  try {
    const { selectedCategories } = req.body;
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { selectedCategories },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Preferences updated successfully',
      selectedCategories: user.selectedCategories
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

export const categoriesRouter = router; 