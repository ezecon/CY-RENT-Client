import axios from "axios";
import { useEffect, useState } from "react";
import { useToken } from "../../Componants/Hook/useToken";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";


export default function Profile() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [ID, setID] = useState(null);
  const [product, setProduct] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);

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
    fetch(`https://cy-rent-server.vercel.app/api/users/${ID}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [ID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>User not found</div>;
  }



  return (
    <div className="flex items-center justify-center ">
      <div className="upc items-center">
        <div className="gradient"></div>
        <div className="profile-down text-center p-4 bg-white shadow-md rounded-lg">
          <img src={product.image} alt="" className="mx-auto mb-4 rounded" />
          <div className="profile-title text-2xl font-bold mb-2">{product.name}</div>
          <div className="profile-description text-lg mb-4">
            <b>Address:</b> {product.city}, {product.district} <br />
            <b>Email:</b> {product.email} <br /> 
            <b>Phone Number:</b> 0{product.number} <br />
            <b>Number of Rent Given:</b> {product.numberOfRent} <br />
           
            <b>Number of Rent Taken:</b> {product.numberOfRentTaken} <br />
            <b>NID/BC Number:</b> {product.nidImage} <br />
          </div>
          <div className="profile-button">
            <Link to="/profile-update">
              <Button variant="gradient" type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
