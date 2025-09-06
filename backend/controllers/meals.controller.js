import Meal from '../models/meal.model.js';

export const getAllMeals = async (req, res) => {
    try {
        const meals = await Meal.find({ userId: req.user.uid }).sort({ createdAt: -1 });
        res.json(meals);
    } catch (error) {
        console.error("Error fetching meals:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addMeal = async (req, res) => {
    try {
        const mealData = req.body;
        // The frontend sends the meal ID as 'id', but we don't want to save it in the DB _id
        delete mealData.id;
        const newMeal = new Meal({ ...mealData, userId: req.user.uid });
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (error) {
        console.error("Error adding meal:", error);
        res.status(400).json({ message: 'Invalid meal data' });
    }
};
