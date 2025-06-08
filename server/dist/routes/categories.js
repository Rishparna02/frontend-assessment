"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const faker_1 = require("@faker-js/faker");
const auth_1 = require("../middleware/auth");
const Category_1 = require("../models/Category");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Initialize categories if they don't exist
const initializeCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield Category_1.Category.countDocuments();
    if (count === 0) {
        const categories = Array.from({ length: 100 }, () => ({
            name: faker_1.faker.commerce.department(),
            description: faker_1.faker.commerce.productDescription(),
            image: faker_1.faker.image.url()
        }));
        yield Category_1.Category.insertMany(categories);
        console.log('Categories initialized');
    }
});
// Initialize categories on server start
initializeCategories().catch(console.error);
// Get categories with pagination (protected route)
router.get('/', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;
        const [categories, total] = yield Promise.all([
            Category_1.Category.find().skip(skip).limit(limit),
            Category_1.Category.countDocuments()
        ]);
        const totalPages = Math.ceil(total / limit);
        res.json({
            categories,
            currentPage: page,
            totalPages,
            totalCategories: total
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
}));
// Update user's selected categories (protected route)
router.post('/update-preferences', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectedCategories } = req.body;
        const userId = req.user.userId;
        const user = yield User_1.User.findByIdAndUpdate(userId, { selectedCategories }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            message: 'Preferences updated successfully',
            selectedCategories: user.selectedCategories
        });
    }
    catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ message: 'Error updating preferences' });
    }
}));
exports.categoriesRouter = router;
