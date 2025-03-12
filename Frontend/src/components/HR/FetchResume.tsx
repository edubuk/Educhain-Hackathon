


const FetchResume = ({ data }: { data: any }) => {

   
  return (
    <div className='flex justify-center items-center'>
      {data.length===0&&<p>Loading Resume...</p>}
      <ul className="flex flex-col gap-6">
        {
          data?.map((res:any,i:any)=>(
            <li className="flex justify-center items-center gap-8"><a href={`https://educhain-hackathon-livid.vercel.app/cv/${res.cv.replace(".pdf","")}`} className="border rounded border-[#006666] p-2">View CV </a> →<p>Rank-{i+1}</p></li>
          ))
        }
      </ul>
    </div>
  )
}

export default FetchResume
