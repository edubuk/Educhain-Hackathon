import { Request, Response } from "express";
import { HRModel } from "../models/hr.model";


// Post a new job
export const postJob = async (req: Request, res: Response) => {
  try {
    const {title, companyName, location, jobType, salary, description, techStack } = req.body;
    if(!title || !companyName || !location || !jobType || !description )
    {
      return res.status(400).json({
        success:false,
        message:"all input fields are required"
      })
    }

    // Creating a new job object
    const newJob = {
      title,
      companyName,
      location,
      jobType,
      salary,
      description,
      techStack,
    };
    const field="jobs"
    // Check if HR field already exists
    let hrData = await HRModel.findOne({ field });

    if (!hrData) {
      hrData = new HRModel({
        field:"jobs",
        jobs: [newJob],
      });
    } else {
      hrData.jobs.push(newJob as any);
    }

    await hrData.save();
    res.status(201).json({success:true, message: "Job posted successfully!"});
  } catch (error) {
    console.error("Error posting job: ", error);
    res.status(500).json({ success:false, error: "Internal Server Error" });
  }
};

// Fetch all jobs
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await HRModel.find();
    res.status(200).json({success:true,jobs:jobs});
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    res.status(500).json({ success:false, error: "Internal Server Error" });
  }
};
