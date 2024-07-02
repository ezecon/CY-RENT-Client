/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";

export default function PostCard({data}) {
    const {_id, name, city, district, price, image} = data;
    const navigate = useNavigate()

    console.log(data);

    const handleNavigate = (id)=>{
      console.log(id)
      navigate(`/rent-now/${id}`)
    }

  return (
    <div className="border rounded-lg">
        <img className="w-[300px] h-[280px] object-cover" src={image} alt="" onClick={()=>handleNavigate(_id)}/>
        <div className="p-2">
            <p className="text-medium font-medium truncate text-ellipsis">Title: {name}</p>
            <p className="text-medium font-medium truncate text-ellipsis">Location: {city}, {district}</p>
            <p className="text-2xl font-bold">৳{price}</p>
        </div>
    </div>
  )
}