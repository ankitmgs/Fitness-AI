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
