import { useEffect, useState } from "react";
import { Input, Button } from "@material-tailwind/react";
import { useToken } from "../../Componants/Hook/useToken";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function NIDverify() {
  const [image, setImage] = useState("");
  const onChange = ({ target }) => setImage(target.value);

  const { token, removeToken } = useToken();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.post('https://cy-rent-server.vercel.app/api/verifyToken', { token });

        if (response.status === 200 && response.data.valid) {
          console.log("Email:", response.data.decoded.email);
          setUserEmail(response.data.decoded.email);

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

  const handleUpload = async () => {
    try {
      const response = await axios.put('https://cy-rent-server.vercel.app/api/uploadNID', {
        email: userEmail,
        imageUrl: image
      });

      if (response.status === 200) {
        toast.success('NID image URL uploaded successfully');
        navigate('/home'); // Redirect to home page after successful upload
      } else {
        toast.error('Failed to upload NID image URL');
      }
    } catch (error) {
      toast.error('Failed to upload NID image URL');
      console.error('Failed to upload NID image URL', error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="relative flex w-full max-w-[24rem]">
        <Input
          type="number"
          label="Enter NID/Birth Certificate Number"
          value={image}
          onChange={onChange}
          className="pr-20"
          containerProps={{
            className: "min-w-0",
          }}
        />
        <Button
          size="sm"
          color={image ? "gray" : "blue-gray"}
          disabled={!image}
          className="!absolute right-1 top-1 rounded"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </div>
    </>
  )
}
