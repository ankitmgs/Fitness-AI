import CustomMeal from '../models/customMeal.model.js';

export const getCustomMeals = async (req, res) => {
    try {
        const customMeals = await CustomMeal.find({ userId: req.user.uid }).sort({ createdAt: -1 });
        res.json(customMeals);
    } catch (error) {
        console.error("Error fetching custom meals:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addCustomMeal = async (req, res) => {
    try {
        // Prevent duplicates by name (case-insensitive) for the same user
        const existingMeal = await CustomMeal.findOne({ 
            userId: req.user.uid,
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
        });

        if (existingMeal) {
            return res.status(409).json({ message: 'A custom meal with this name already exists.' });
        }

        const customMealData = req.body;
        const newCustomMeal = new CustomMeal({ ...customMealData, userId: req.user.uid });
        await newCustomMeal.save();
        res.status(201).json(newCustomMeal);
    } catch (error) {
        console.error("Error adding custom meal:", error);
        res.status(400).json({ message: 'Invalid custom meal data' });
    }
};
