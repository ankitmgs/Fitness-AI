import Profile from '../models/profile.model.js';

export const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user.uid });
        if (!profile) {
            return res.status(404).json({ message: 'Profile Not Found' });
        }
        res.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createOrUpdateProfile = async (req, res) => {
    const profileData = req.body;
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: req.user.uid },
            { ...profileData, userId: req.user.uid },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json(updatedProfile);
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(400).json({ message: 'Invalid profile data' });
    }
};
