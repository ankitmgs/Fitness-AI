import Workout from '../models/workout.model.js';

export const getAllWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.uid }).sort({ date: -1 });
        res.json(workouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addWorkout = async (req, res) => {
    try {
        const workoutData = req.body;
        const newWorkout = new Workout({ ...workoutData, userId: req.user.uid });
        await newWorkout.save();
        res.status(201).json(newWorkout);
    } catch (error) {
        console.error("Error adding workout:", error);
        res.status(400).json({ message: 'Invalid workout data' });
    }
};

export const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const workoutData = req.body;
        const userId = req.user.uid;

        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, userId: userId },
            workoutData,
            { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout not found or you do not have permission to edit it.' });
        }

        res.json(updatedWorkout);
    } catch (error) {
        console.error("Error updating workout:", error);
        res.status(400).json({ message: 'Invalid workout data' });
    }
};

export const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const deletedWorkout = await Workout.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Workout not found or you do not have permission to delete it.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting workout:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};