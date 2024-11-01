import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: false,
    },
    description: {
        type: String,
        required: false,
        unique: false,
    },
    category: {
        type: String,
        required: true,
        unique: false,
    },
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: false
    }
  });
  
  const RequirementModel = mongoose.model('Requirement', requirementSchema);
  
export default RequirementModel;