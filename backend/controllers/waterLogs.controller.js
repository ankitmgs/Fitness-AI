import WaterLog from '../models/waterLog.model.js';

export const getAllWaterLogs = async (req, res) => {
    try {
        const waterLogs = await WaterLog.find({ userId: req.user.uid }).sort({ date: 1 });
        res.json(waterLogs);
    } catch (error) {
        console.error("Error fetching water logs:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const saveWaterLog = async (req, res) => {
    try {
        const { date, amount } = req.body;
        const userId = req.user.uid;

        const updatedLog = await WaterLog.findOneAndUpdate(
            { userId, date },
            { amount },
            { new: true, upsert: true, runValidators: true }
        );
        
        res.status(201).json(updatedLog);
    } catch (error) {
        console.error("Error saving water log:", error);
        res.status(400).json({ message: 'Invalid water log data' });
    }
};

export const deleteWaterLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const deletedLog = await WaterLog.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedLog) {
            return res.status(404).json({ message: 'Water log not found or permission denied.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting water log:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};