import { useState } from "react";
import Hr from "./Hr"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast";
import axios  from 'axios';
import FetchResume from "./FetchResume";

const HRDashboard = () => {
    const [isHrButton , setHrButton] = useState<boolean>(true);
    const [isFetchList , setFetchList] = useState<boolean>(false);
    const [data,setData] = useState<[]>([]);

    const fetchResume = async()=>{
        try {
            const data = await axios.post('http://20.55.98.222:5000/match',
                {
                    "jd_path": "jd.txt",
                    "cv_folder": "CVs",
                    "must_have": ["Python", "CI/CD"],
                    "good_to_have": ["Docker", "Kubernetes"],
                    "bonus_skills": ["AWS", "Terraform"]
                },
                {
                    headers:{
                        'Content-Type':'application/json'
                    }
                }
            )
            console.log("data",data.data.ranked_cvs);
            setData(data.data.ranked_cvs);
            console.log("fafa",data);
        } catch (error) {
            console.log("Error while fetching resume list",error);
            toast.error("something went wrong");
        }
    }
    
  return (
    <div className="flex flex-col justify-start items-center h-[80vh] w-screen">
    <div className="flex justify-center items-start gap-2 w-screen">
    <Button className={`text-center border border-slate-300 text-[#006666] hover:bg-slate-100 ${isHrButton?"bg-slate-100":"bg-white border"}`} onClick={()=>{setHrButton(true);setFetchList(false)}}>Post a Job</Button>
    <Button className={`text-center border border-slate-300 text-[#006666] hover:bg-slate-100 ${isFetchList?"bg-slate-100":"bg-white border"}`} onClick={()=>{setFetchList(true);setHrButton(false);fetchResume()}}>Fetch Resume</Button>
    </div>
    <div className="flex justify-center items-center gap-2 h-auto p-4">
      {
        isHrButton&&<Hr />
      }
      {
        isFetchList&&<FetchResume data={data} />
      }
    </div>
</div>
  )
}

export default HRDashboard
