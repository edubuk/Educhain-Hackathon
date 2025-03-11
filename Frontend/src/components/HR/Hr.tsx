import { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/main";
import axios from "axios";

interface JobProps {
    title: string;
    companyName: string;
    location: string;
    jobType: string;
    salary: string;
    description: string;
    techStack: string;
    applyLink: string;
  }
const Hr = () => {
    const [formData, setFormData] = useState<JobProps>({
      title: "",
      companyName: "",
      location: "",
      jobType: "",
      salary: "",
      description: "",
      techStack:"",
      applyLink: "",
    });

    const postJobs = async(e:any)=>{
        e.preventDefault();
        try {
            const data:any = await axios.post(`${API_BASE_URL}/cv/post-jobs`,
                formData,
                {              
                headers:{
                    "Content-Type":"application/json",
                }
            }
            );
            if(data.data.success)
            {
                toast.success("Job posted successfully");
            }
            if(!data.data.success)
            {
                toast.success(data.data.message);
            }
        } catch (error) {
            console.log("error while posting jobs",error);
            toast.error("something went wrong")
        }
    }
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    // const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   setFormData((prev) => ({ ...prev, techStack: e.target.value.split(",").map((tech) => tech.trim()) }));
    // };
  
    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   onSubmit(formData);
    // };
  
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-xl font-semibold text-[#008888] mb-4">Post a Job</h2>
        <form onSubmit={postJobs}>
          <input name="title" placeholder="Job Title" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
          <input name="companyName" placeholder="Company Name" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
          <input name="location" placeholder="Location" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
          <input name="jobType" placeholder="Job Type" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
          <input name="salary" placeholder="Salary" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
          <textarea name="description" placeholder="Job Description" className="w-full p-2 border rounded mb-2" onChange={handleChange}></textarea>
          <input name="techStack" placeholder="Tech Stack (comma-separated)" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
          <button type="submit" className="w-full bg-[#008888] text-white py-2 rounded-xl hover:bg-blue-700 transition">Post Job</button>
        </form>
      </div>
    );
  };

  export default Hr;