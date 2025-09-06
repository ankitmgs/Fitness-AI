import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    exerciseType: { type: String, required: true },
    duration: { type: Number, required: true },
    intensity: { type: String, required: true },
    caloriesBurned: { type: Number, required: true },
}, { 
    timestamps: true,
    toJSON: {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString();
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    }
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;