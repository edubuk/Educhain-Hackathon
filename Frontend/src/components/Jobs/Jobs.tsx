import { useEffect, useState } from "react";
import axios from 'axios';
import { API_BASE_URL } from "@/main";
import toast from "react-hot-toast";

interface Job {
  title: string;
  companyName: string;
  location: string;
  jobType?: string;
  salary?: string;
  description: string;
  techStack: string;
}

const Jobs = () => {
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: string }>({});
  const [isFileUploaded,setFileUploaded] = useState<boolean>(false);

  const applyForJob = ()=>{
    try {
      if(!isFileUploaded)
      {
        return toast.error("Please upload your resume first !")
      }
      toast.success("Your application has been submitted successfully!");
      setFileUploaded(false);
    } catch (error) {
      console.log("error while applying for job",error);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, jobId: number) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFiles((prev) => ({
        ...prev,
        [jobId]: file.name, // Associate the file name with the correct job ID
      }));
      setFileUploaded(true);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const getJobsLists = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/cv/job-lists`);
      if (data.success) {
        setJobsList(data.jobs[0].jobs);
      }
    } catch (error) {
      console.error("Error while fetching jobs list:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getJobsLists();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Jobs</h2>
      {jobsList.length === 0 ? (
        <p className="text-center text-gray-500">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsList.map((job, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
              <p className="text-gray-700">
                {job.companyName} - {job.location}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Job Type: {job.jobType || "Not Specified"}
              </p>
              <p className="text-sm text-gray-500">Salary: {job.salary || "Negotiable"}</p>
              <p className="mt-2 text-gray-600">{job.description}</p>
              <div className="mt-3">
                <span className="text-sm font-medium text-gray-800">Tech Stack:</span>
                <p className="text-sm text-gray-500">{job.techStack}</p>
              </div>

              {/* Resume Upload Section */}
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="flex items-center gap-4">
                  {/* Apply Now Button */}
                  <button className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition duration-300" onClick={applyForJob}>
                    Apply Now
                  </button>

                  {/* File Upload Input (Styled as a button) */}
                  <label className="bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-lg shadow-md cursor-pointer hover:bg-gray-300 transition duration-300 flex items-center gap-2">
                    📄 {uploadedFiles[index] ? uploadedFiles[index] : "Upload PDF"}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => handleFileChange(event, index)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Show Uploaded File Name (Only for the corresponding job) */}
                {uploadedFiles[index] && (
                  <p className="text-green-600 font-medium text-sm">
                    Uploaded: {uploadedFiles[index]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
