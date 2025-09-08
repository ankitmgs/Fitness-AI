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

export const updateMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const mealData = req.body;
        const userId = req.user.uid;

        const updatedMeal = await Meal.findOneAndUpdate(
            { _id: id, userId: userId },
            mealData,
            { new: true, runValidators: true }
        );

        if (!updatedMeal) {
            return res.status(404).json({ message: 'Meal not found or you do not have permission to edit it.' });
        }

        res.json(updatedMeal);
    } catch (error) {
        console.error("Error updating meal:", error);
        res.status(400).json({ message: 'Invalid meal data' });
    }
};

export const deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const deletedMeal = await Meal.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedMeal) {
            return res.status(404).json({ message: 'Meal not found or you do not have permission to delete it.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting meal:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
