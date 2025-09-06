import mongoose from 'mongoose';

const dailyGoalsSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    water: { type: Number, required: true },
}, { _id: false });

const reminderSettingsSchema = new mongoose.Schema({
    water: {
        enabled: { type: Boolean, required: true },
        frequency: { type: Number, required: true },
    },
    meal: { type: Boolean, required: true },
    goalReached: { type: Boolean, required: true },
}, { _id: false });

const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    gender: { type: String, required: true },
    activityLevel: { type: String, required: true },
    goal: { type: String, required: true },
    dailyGoals: { type: dailyGoalsSchema, required: true },
    reminderSettings: { type: reminderSettingsSchema, required: true },
}, { 
    timestamps: true,
    toJSON: {
        transform: (document, returnedObject) => {
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    } 
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;