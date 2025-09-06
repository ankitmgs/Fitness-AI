import mongoose from 'mongoose';

const macrosSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
}, { _id: false });

const mealSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    macros: { type: macrosSchema, required: true },
    mealType: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
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

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;