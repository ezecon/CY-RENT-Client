import { Outlet } from "react-router-dom";
import { NavMenu } from "./NavMenu";



/////////////////////
import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../Hook/useToken'; // Adjust the path accordingly
import axios from 'axios';



export default function Main() {


  const { token, removeToken } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.post('https://cy-rent-server.vercel.app/api/verifyToken', { token });

        if (response.status === 200 && response.data.valid) {
          console.log("Token is valid:", response.data); // Log the response
          console.log("Email:", response.data.decoded.email); // Log the response
          // Proceed with loading home page content
        } else {
          console.log("Token verification failed:", response.data); // Log the response
          removeToken();
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        removeToken();
        navigate('/login');
      }
    };

    verifyToken();
  }, [token, navigate, removeToken]);

  return (
    <div> 
      <div className="flex-none   fixed left-0 right-0 top-0  overflow-y-auto">
      <NavMenu/>
      </div>
      <div className="mx-auto max-w-screen-xl mt-8 py-8">

        <Outlet/>
      </div>
      </div>
  )
}
