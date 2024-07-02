/* eslint-disable react/prop-types */

import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function PostHistoryCard({ data }) {
  const { _id, date, name } = data;
  const navigate = useNavigate();

  console.log(data);

  const handleNavigate = (id) => {
    navigate(`/rent-now/${id}`);
  };

  const TABLE_ROWS = [
    {
      date: date,
      name: name,
      temp: "See Post",
    },
  ];


  return (
    <div>
      <table className="w-full min-w-max table-auto text-left">
        <tbody>
          {TABLE_ROWS.map(({ date, name,temp }, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {date}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                {name}
                </Typography>
              </td>
              <td className="p-4">
                <div>
                  <Typography as="a" href="#" onClick={() => handleNavigate(_id)} variant="small" color="blue-gray" className="font-medium">
                    {temp}
                  </Typography>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
