
import { useForm } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import PostCard from "../PostCard/PostCard";
import { useEffect, useState } from "react";

export default function Search() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://cy-rent-server.vercel.app/api/items")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    setLoading(false);
  }, []);

  const renderProduct =
          [...products]
          .reverse()
          .map((item) => <PostCard key={item._id} data={item} />);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Search Cycle</h1>
      <div className="bg-white rounded-lg ">
        <form className="p-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>

          <div className="flex gap-6">
          <div className="w-full">
              <select
                {...register("category", { required: "Category is required" })}
                className="px-3 py-2 rounded-md border border-gray-400 w-full"
              >
                <option value="#">Select District</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Noakhali">Noakhali</option>
              </select>
              {errors.category && (
                <small className="text-red-500">{errors.category.message}</small>
              )}
            </div>
            <div>
            <Button type="submit">Search</Button>
          </div>
           
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {renderProduct}
      </div>
    </div>
  );
}
