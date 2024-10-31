import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
    host: mongoose.Types.ObjectId,
    guest: mongoose.Types.ObjectId,
    project: mongoose.Types.ObjectId,
    salary: Number
})

export default mongoose.model("Invite", inviteSchema);