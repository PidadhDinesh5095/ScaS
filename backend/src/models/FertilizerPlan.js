import mongoose from 'mongoose';

const FertilizerPlanSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  stage: { type: String, required: true },
  plan: { type: Object, required: true }, // Store the plan as a JSON object
}, { timestamps: true });

export default mongoose.model('FertilizerPlan', FertilizerPlanSchema);
