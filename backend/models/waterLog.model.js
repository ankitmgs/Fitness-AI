import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
}, {
    toJSON: {
        transform: (document, returnedObject) => {
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    }
});

// To prevent multiple logs for the same day per user
waterLogSchema.index({ userId: 1, date: 1 }, { unique: true });


const WaterLog = mongoose.model('WaterLog', waterLogSchema);

export default WaterLog;