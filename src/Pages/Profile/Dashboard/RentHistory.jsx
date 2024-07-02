import { Button, Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToken } from "../../../Componants/Hook/useToken";
import { Spinner } from "@material-tailwind/react"; // Assuming Spinner is available in your UI library

const TABLE_HEAD = ["Date", "Rent", "Status", " "];

export default function RentHistory() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post("https://cy-rent-server.vercel.app/api/verifyToken", { token });

        if (response.status === 200 && response.data.valid) {
          setUserID(response.data.decoded.id);
        } else {
          removeToken();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        removeToken();
        navigate("/login");
      }
    };

    verifyToken();
  }, [token, navigate, removeToken]);

  useEffect(() => {
    if (userID) {
      axios.get("https://cy-rent-server.vercel.app/api/rent-history/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          const filteredHistory = response.data.filter(temp => temp.RenterID === userID);
          setOrders(filteredHistory);
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Failed to fetch orders");
          setLoading(false);
        });
    }
  }, [userID, token]);

  const handleDelete = (id) => {
    console.log(id);
    const isProceed = window.confirm("Are you sure you want to delete this item?");
    if (isProceed) {
      axios.delete(`https://cy-rent-server.vercel.app/api/rent-history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
          toast.success("Request deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting request:", error);
          toast.error("Failed to delete request");
        });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="w-8 h-8 p-2" /> Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-blue-gray-800 py-6">Rent History</h1>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.reverse().map((item) => (
                <tr key={item._id}>
                  <td className="p-2">
                    <Typography
                      as="div"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {item.date.slice(0, 10)}
                    </Typography>
                  </td>
                  <td className="p-2">
                    <Typography
                      as="div"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {item.Rent}ট
                    </Typography>
                  </td>
                  <td className="p-2">
                    <Typography
                      as="div"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {item.status}
                    </Typography>
                  </td>
                  <td className="p-2">
                    <Typography
                      as="div"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <Button className="bg-red-500" size="sm" onClick={() => handleDelete(item._id)}>
                          Delete Request
                        </Button>
                        {console.log(item._id)}

                        <Link to={`/rent-now/${item.PostID}`} className="cursor-pointer">
                          <Button size="sm">View Post</Button>
                          
                        </Link>
                      </div>
                    </Typography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  <Typography
                    as="div"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    No rental history found.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
