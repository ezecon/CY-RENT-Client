import { Button } from "@material-tailwind/react";
import TextInputField from "../Shared/TextInputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToken } from "../Hook/useToken";
import axios from "axios";
import toast from "react-hot-toast";

const schema = yup.object({
  num: yup.string().min(11).required("Phone Number is required"),
  rentHour: yup.number().required("Rent Hour is required"),
}).required();

export default function SingleProduct() {
  const { id } = useParams(); // Get the id from the URL parameters
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [product, setProduct] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [rentRenterID, setRentRenterID] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.post('https://cy-rent-server.vercel.app/api/verifyToken', { token });

        if (response.status === 200 && response.data.valid) {
          console.log("ID:", response.data.decoded.id);
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
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://cy-rent-server.vercel.app/api/items/${id}`);
        const data = await response.json();
        console.log("Product data:", data);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (userID) {
      const checkRentHistory = async () => {
        try {
          const response = await fetch(`https://cy-rent-server.vercel.app/api/rent-history/check/${userID}`);
          const data = await response.json();
          setRentRenterID(data.RenterID);
        } catch (error) {
          console.error('Error fetching rent history:', error);
          toast.error('Error fetching rent history');
        }
      };

      checkRentHistory();
    }
  }, [userID]);

  const handleRentForm = async (data) => {
    if (userID === product.uid) {
      toast.error("It's your own post!");
    } else if (userID === rentRenterID) {
      toast.error("Already request sent. Please wait!");
    } else {
      const newRent = {
        Rent: data.rentHour * product.price,
        Hour: data.rentHour,
        RenterID: userID,
        OwnerID: product.uid,
        PostID: id,
        RenterNum: data.num,
        OwnerNum: product.num,
      };
      console.log(newRent);

      try {
        const response = await axios.post('https://cy-rent-server.vercel.app/api/rent-history', newRent);

        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.success("Rent request sent!");
          reset();
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          console.error('Error adding item:', error);
          toast.error("Taking Rent failed. Please try again.");
        }
      }
    }
  };

  const handleClick = () => {
    navigate(`/user/${product.uid}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="my-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <img className="object-cover rounded w-9/12 h-[450px]" src={product.image} alt="" />
        </div>
        <div className="bg-white shadow-md rounded-lg p-5 text-pretty box-border">
          <div>
            <Button onClick={handleClick} className="bg-transparent text-blue-gray-300" type='button'>See User</Button>
          </div>
          <form onSubmit={handleSubmit(handleRentForm)}>
            <br />
            <p className="text-4xl font-bold">Price: {product.price}</p>
            <h1 className="text-2xl font-bold">Location: {product.city}, {product.district}</h1>
            <p className="text-gray-600 mt-8">Phone: {product.num}</p>
            <p className="text-gray-600 mt-2"><span className="font-semibold text-gray-800">{product.category}</span> </p>

            <div className="mt-6 space-y-4">
              <div>
                <TextInputField
                  label="Phone Number"
                  type="text"
                  name="num"
                  size="lg"
                  errors={errors}
                  register={register}
                />
              </div>
              <div>
                <TextInputField
                  label="Rent Hour"
                  type="number"
                  name="rentHour"
                  size="lg"
                  errors={errors}
                  register={register}
                />
              </div>

              <div>
                <Button type='submit'>Take Rent</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
