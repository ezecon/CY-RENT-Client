import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";
import * as yup from "yup";
import TextInputField from "../../Componants/Shared/TextInputField";
import axios from "axios";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    retypePassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please retype your password"),
  })
  .required();

export function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRegisterForm = async (data) => {
    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password,
      city: data.city,
      district: data.district,
      price: data.price,
      image: data.image,
      category: data.category,
    };

    try {
      const response = await axios.post('https://cy-rent-server.vercel.app/api/users', newUser);
      
      if (response.data.error) {
        toast.error(response.data.error); // Assuming your backend sends an error message if email already exists
      } else {
        toast.success("Successfully Registered!");
        reset(); // Reset form fields on successful registration
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Display specific backend error message
      } else {
        console.error('Error adding item:', error);
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Register
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit(handleRegisterForm)}>
          <CardBody className="flex flex-col gap-4">
            <TextInputField
              label="Name"
              type="text"
              name="name"
              size="lg"
              errors={errors}
              register={register}
            />
            <TextInputField
              label="Email"
              type="email"
              name="email"
              size="lg"
              errors={errors}
              register={register}
            />
            <TextInputField
              label="Password"
              type="password"
              name="password"
              size="lg"
              errors={errors}
              register={register}
            />
            <TextInputField
              label="Retype Password"
              type="password"
              name="retypePassword"
              size="lg"
              errors={errors}
              register={register}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">
              Register
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Already have an account?
              <Typography
                as="a"
                href="/login"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold"
              >
                <Link to="/login">Login</Link>
              </Typography>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
