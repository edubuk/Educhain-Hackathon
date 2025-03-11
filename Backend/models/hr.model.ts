import mongoose, { Schema, Document } from "mongoose";

// Define Job interface
interface IJob extends Document {
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salary?: string;
  description: string;
  techStack: string; 
}

// Define HR interface
interface IHR extends Document {
  field: string;
  jobs: IJob[];
}

// Job Schema
const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String},
  salary: { type: String },
  description: { type: String, required: true },
  techStack: { type: String }, // Tech stack remains as a string
});

// HR Schema
const hrSchema = new Schema<IHR>({
  field: { type: String, required: true },
  jobs: [jobSchema],
});

export const HRModel = mongoose.model<IHR>("JobPosts", hrSchema);
