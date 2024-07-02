import axios from "axios";
import { useEffect, useState } from "react";
import { useToken } from "../../Componants/Hook/useToken";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfileUpdate() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [ID, setID] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    district: '',
    email: '',
    numberOfRent: '',
    nidImage: ''
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.post('https://cy-rent-server.vercel.app/api/verifyToken', { token });

        if (response.status === 200 && response.data.valid) {
          setID(response.data.decoded.id);
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
    if (ID) {
      fetch(`https://cy-rent-server.vercel.app/api/users/${ID}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setFormData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setLoading(false);
        });
    }
  }, [ID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://cy-rent-server.vercel.app/api/users/${ID}`, formData);
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        navigate('/profile'); // Redirect to /profile after successful update
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An error occurred while updating the profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>User not found</div>;
  }

  return (
    <div className="my-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <img className="object-cover rounded w-9/12 h-[450px]" src={product.image} alt="" />
        </div>
        <div className="bg-white text-left shadow-md rounded-lg p-5 text-pretty box-border">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="district">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number">Phone Number</label>
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <button type="submit" className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
