import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function User() {
  const { id } = useParams(); // Get the id from the URL parameters
  const [product, setProduct] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://cy-rent-server.vercel.app/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>User not found</div>;
  }

  console.log(product.name)

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
      </div>
    </div>
  </div>
);
}
