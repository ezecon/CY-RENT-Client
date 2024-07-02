import { useEffect, useState } from "react";
import UserPhotoCard from "../UserCard/UserPhotoCard";

// eslint-disable-next-line react/prop-types
export default function TopUsers({ page }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://cy-rent-server.vercel.app/api/users")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    setLoading(false);
  }, []);

  const renderProduct =
    page === "home"
      ? [...products]
          .reverse()
          .slice(0, 10)
          .map((item) => <UserPhotoCard key={item._id} data={item} />)
      : [...products]
          .reverse()
          .map((item) => <UserPhotoCard key={item._id} data={item} />);

  if (loading) {
    return "Loading...";
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-6">{renderProduct}</div>
    </div>
  );
}