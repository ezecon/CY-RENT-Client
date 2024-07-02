import { useNavigate } from 'react-router-dom';
import HeroSection from '../../Componants/HeroSection/HeroSection';
import { useToken } from '../../Componants/Hook/useToken';

import { useEffect, useState } from 'react';
import axios from 'axios';
import TopUsers from '../../Componants/ToUsers/TopUsers';

export default function Home() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.post('https://cy-rent-server.vercel.app/api/verifyToken', { token });

        if (response.status === 200 && response.data.valid) {
          console.log("Email:", response.data.decoded.email);
          setUserEmail(response.data.decoded.email);

        } else {
          console.log("Token verification failed:", response.data);
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


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://cy-rent-server.vercel.app/api/users');
        const users = response.data;

        console.log('User data fetched:', users); // Debugging log

        if (userEmail) {
          const user = users.find(user => user.email === userEmail);
          if (user) {
            if (user.nidCheck === 0) {
              console.log('User has NID check 0, redirecting...');
              navigate('/nid-verify');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail, navigate]);


  return (
    <div>
      <HeroSection />
      <h1 className="text-3xl m-10 text-center hover:text-gray-500">Top 08 Users</h1>
      <TopUsers />
      <div className="m-10"></div>
    </div>
  );
}
