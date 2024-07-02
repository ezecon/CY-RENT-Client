
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="hero-section text-center rounded-xl">
      <div className="hero-color px-10 py-[220px]  space-y-8 rounded-xl">
        <h1 className="text-5xl font-bold text-white">
          Catch Your Excitement today
        </h1>
        <p className="text-xl font-medium  text-white">
          Fullfill your dream, <br /> Dont let your Excitement down.
        </p>
        <Link to="/rent-now"><Button color="blue">Rent now</Button></Link>
      </div>
    </div>
  );
}
