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

export const updateWeightLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, weight } = req.body;
        const userId = req.user.uid;
        
        // Check for existing log on the new date, excluding the current log
        const existingLog = await WeightLog.findOne({ userId, date, _id: { $ne: id } });
        if (existingLog) {
            return res.status(409).json({ message: 'A weight log for this date already exists.' });
        }

        const updatedLog = await WeightLog.findOneAndUpdate(
            { _id: id, userId: userId },
            { date, weight },
            { new: true, runValidators: true }
        );

        if (!updatedLog) {
            return res.status(404).json({ message: 'Weight log not found or permission denied.' });
        }

        res.json(updatedLog);
    } catch (error) {
        console.error("Error updating weight log:", error);
        res.status(400).json({ message: 'Invalid weight log data' });
    }
};

export const deleteWeightLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const deletedLog = await WeightLog.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedLog) {
            return res.status(404).json({ message: 'Weight log not found or permission denied.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting weight log:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};