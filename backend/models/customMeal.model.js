import mongoose from 'mongoose';

const macrosSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
}, { _id: false });

const customMealSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    macros: { type: macrosSchema, required: true },
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

const CustomMeal = mongoose.model('CustomMeal', customMealSchema);

export default CustomMeal;