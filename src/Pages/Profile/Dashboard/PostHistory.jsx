import { Button, Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToken } from "../../../Componants/Hook/useToken";

const TABLE_HEAD = ["Date", "Title", "Category", "Status"];

export default function PostHistory() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectValues, setSelectValues] = useState({});
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post("https://cy-rent-server.vercel.app/api/verifyToken", { token });

        if (response.status === 200 && response.data.valid) {
          setUserEmail(response.data.decoded.email);
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
    if (userEmail) {
      axios.get("https://cy-rent-server.vercel.app/api/items/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          const filteredOrders = response.data.filter(order => order.user === userEmail);
          setOrders(filteredOrders);
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Failed to fetch orders");
          setLoading(false);
        });
    }
  }, [userEmail, token]);

  const handleStatusChange = (id) => {
    const selectedValue = selectValues[id];
    if (!selectedValue) {
      toast.error("Please select a category");
      return;
    }

    const isProceed = window.confirm("Are you sure?");
    if (isProceed) {
      axios.put(`https://cy-rent-server.vercel.app/api/items/${id}`, { category: selectedValue }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === id ? { ...order, category: selectedValue } : order
            )
          );
          toast.success("Category updated");
        })
        .catch((error) => {
          console.error("Error updating category:", error);
          toast.error("Update failed");
        });
    }
  };

  const handleSelectChange = (id, value) => {
    setSelectValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleDelete = (id) => {
    const isProceed = window.confirm("Are you sure you want to delete this item?");
    if (isProceed) {
      axios.delete(`https://cy-rent-server.vercel.app/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
          toast.success("Item deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
          toast.error("Failed to delete item");
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-blue-gray-800 py-6">Post History</h1>
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
            {orders.reverse().map((item) => (
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
                    {item.name}
                  </Typography>
                </td>
                <td className="p-2">
                  <Typography
                    as="div"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {item.category}
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
                      <select
                        className="border p-1.5 rounded-md"
                        value={selectValues[item._id] || item.category}
                        onChange={(e) => handleSelectChange(item._id, e.target.value)}
                      >
                        <option value="Unavailable">Unavailable</option>
                        <option value="On Rent">On Rent</option>
                        <option value="Available">Available</option>
                      </select>
                      <Button size="sm" onClick={() => handleStatusChange(item._id)}>
                        Save
                      </Button>
                      <Button className="bg-red-500" size="sm" onClick={() => handleDelete(item._id)}>
                        Delete
                      </Button>
                      {/* Link to navigate to post detail */}
                      <Link to={`/rent-now/${item._id}`} className="cursor-pointer">
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
