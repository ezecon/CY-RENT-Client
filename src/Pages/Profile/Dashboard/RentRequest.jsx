import { Button, Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToken } from "../../../Componants/Hook/useToken";
import { Spinner } from "@material-tailwind/react"; // Assuming Spinner is available in your UI library

const TABLE_HEAD = ["Date", "Rent","User", "Status", " "];

export default function RentRequest() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
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
          const filteredHistory = response.data.filter(temp => temp.OwnerID === userID && temp.status !== 'Pending');
          setOrders(filteredHistory);

          const filteredPendingRequests = response.data.filter(temp => temp.OwnerID === userID && temp.status === 'Pending');
          setPendingRequests(filteredPendingRequests);

          setLoading(false);
        })
        .catch((error) => {
          toast.error("Failed to fetch orders");
          setLoading(false);
        });
    }
  }, [userID, token]);

  const handleAccept = (id) => {
    axios.put(`https://cy-rent-server.vercel.app/api/rent-history/${id}`, { status: 'accepted' }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setPendingRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
        toast.success("Request accepted successfully");
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
        toast.error("Failed to accept request");
      });
  };

  const handleReject = (id) => {
    axios.put(`https://cy-rent-server.vercel.app/api/rent-history/${id}`, { status: 'rejected' }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setPendingRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
        toast.success("Request rejected successfully");
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
        toast.error("Failed to reject request");
      });
  };
  const handleUser = (id) => {
    axios.get(`https://cy-rent-server.vercel.app/api/users/${id}`,  {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        navigate(`/user/${id}`)
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
        toast.error("User not found");
      });
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
      <h1 className="text-xl font-bold text-blue-gray-800 py-6">Pending Requests</h1>

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
            {pendingRequests.length > 0 ? (
              pendingRequests.reverse().map((item) => (
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
                     <Button size="sm" onClick={() => handleUser(item.RenterID)}>
                          See User
                      </Button>
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
                        <Button className="bg-green-500" size="sm" onClick={() => handleAccept(item._id)}>
                          Accept
                        </Button>
                        <Button className="bg-red-500" size="sm" onClick={() => handleReject(item._id)}>
                          Reject
                        </Button>
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
                    No pending requests found.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <h1 className="text-xl font-bold text-blue-gray-800 py-6">History of Requests</h1>

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
                     <Button size="sm" onClick={() => handleUser(item.RenterID)}>
                          See User
                      </Button>
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
                      <Link to={`/rent-now/${item.PostID}`} className="cursor-pointer">
                        <Button size="sm">View Post</Button>
                      </Link>
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
