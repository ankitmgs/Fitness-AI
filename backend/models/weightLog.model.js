import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    weight: { type: Number, required: true },
}, {
    toJSON: {
        transform: (document, returnedObject) => {
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    }
});

// To prevent multiple logs for the same day per user
weightLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WeightLog = mongoose.model('WeightLog', weightLogSchema);

export default WeightLog;