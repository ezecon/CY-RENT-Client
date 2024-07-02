import { useEffect, useState } from "react";
import UserPhotoCard from "../UserCard/UserPhotoCard";

// eslint-disable-next-line react/prop-types
export default function TopUsers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://cy-rent-server.vercel.app/api/users")
      .then((res) => res.json())
      .then((data) => {
        // Sort users by numberOfRent in descending order and take top 8
        const sortedData = data.sort((a, b) => b.numberOfRent - a.numberOfRent).slice(0, 8);
        setProducts(sortedData);
        setLoading(false);
      });
  }, []);

  const renderProduct = products.map((item) => <UserPhotoCard key={item._id} data={item} />);

  if (loading) {
    return "Loading...";
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-6">{renderProduct}</div>
    </div>
  );
}
