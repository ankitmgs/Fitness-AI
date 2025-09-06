import WeightLog from '../models/weightLog.model.js';

export const getWeightHistory = async (req, res) => {
    try {
        const weightLogs = await WeightLog.find({ userId: req.user.uid }).sort({ date: 1 });
        res.json(weightLogs);
    } catch (error) {
        console.error("Error fetching weight history:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addWeightLog = async (req, res) => {
    try {
        const { date, weight } = req.body;
        const userId = req.user.uid;

        // Find and update if exists, otherwise create
        const updatedLog = await WeightLog.findOneAndUpdate(
            { userId, date },
            { weight },
            { new: true, upsert: true, runValidators: true }
        );
        
        res.status(201).json(updatedLog);
    } catch (error) {
        console.error("Error adding weight log:", error);
        res.status(400).json({ message: 'Invalid weight log data' });
    }
};
