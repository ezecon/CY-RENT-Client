import { Button, Input, Option, Select } from "@material-tailwind/react";
import { useState } from "react";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useToken } from "../../Componants/Hook/useToken";

export default function AddCycle() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [userID, setUserID] = useState(null);

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
          setUserID(response.data.decoded.id);

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








  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState('');
  const [num, setNum] = useState('');
  const [version, setVersion] = useState(''); // State for the selected version
 
  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      name: name,
      description: description,
      price: price,
      city: city,
      district: district,
      time: time,
      image: image,
      version: version,
      user: userEmail, 
      userID: userID,
      num: num,// Include the selected version in the form submission
    };

    axios.post('https://cy-rent-server.vercel.app/api/items', newItem)
      .then(response => {
        toast.success('Post added successfully!'); // Display success toast
        console.log('Item added:', response.data);
        setName('');
        setDescription('');
        setPrice('');
        setCity('');
        setDistrict('');
        setTime('');
        setImage('');
        setVersion('');
        setNum(''); // Reset the selected version
      })
      .catch(error => {
        toast.error('Something wents wrong!'); 
        console.error('Error adding item:', error);
      });
  };

  return (
    <div className="flex items-center rounded justify-center ">
      <Toaster /> 
      <div className="bg-white py-5 rounded-lg w-6/12">
        <h1 className="text-2xl font-semibold mb-4 text-center">Rent Post</h1>
        <form className="p-4 space-y-4" onSubmit={handleSubmit}>
          <div className="w-72 mx-auto">
            <Input type="text" required value={name} onChange={(e) => setName(e.target.value)} label="Cycle Brand Name" />
          </div>
          
          <div className="w-72 mx-auto">
            <Input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} label="Description" />
          </div>
          <div className="w-72 mx-auto">
            <Input type="number" required value={num} onChange={(e) => setNum(e.target.value)} label="Phone Number" />
          </div>
          
          <div className="w-72 mx-auto">
            <Input type="text" required value={city} onChange={(e) => setCity(e.target.value)} label="City" />
          </div>
          
          <div className="w-72 mx-auto">
            <Input type="text" required value={district} onChange={(e) => setDistrict(e.target.value)} label="District" />
          </div>
          
          <div className="w-72 mx-auto">
            <Input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} label="Rent for cycle" />
          </div>
          
          <div className="w-72 mx-auto">
            <Input type="time" required value={time} onChange={(e) => setTime(e.target.value)} label="Available From" />
          </div>

          <div className="w-72 mx-auto">
            <Select required label="Select Version" value={version} onChange={(e) => setVersion(e)}>
              <Option value="Unavailable">Unavailable</Option>
              <Option value="On Rent">On Rent</Option>
              <Option value="Available">Available</Option>
            </Select>
          </div>
          
          <div className="w-72 mx-auto">
            <Input type="text" required value={image} onChange={(e) => setImage(e.target.value)} label="Image URL" />
          </div>
          
          <div className="text-center">
            <Button type="submit">Post</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
