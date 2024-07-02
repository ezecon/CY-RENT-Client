import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Tooltip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useToken } from '../../Hook/useToken'; 
import { useNavigate } from 'react-router-dom';

export function NavMenu() {
const { removeToken } = useToken();
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    // Optional: You can send a request to the server to invalidate the token
    // For example, if you have a logout endpoint that clears server-side sessions

    // Remove the token from local storage
    removeToken();

    // Redirect to the login page or any other desired page
    navigate('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography as="div" className="mr-4 cursor-pointer py-1.5 font-medium">
        <Link to="/add-cycle">
          <Tooltip content="Post for rent">
            <div className="text-2xl">
              <IoMdAdd />
            </div>
          </Tooltip>
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <Menu>
          <MenuHandler>
            <IconButton>
              <FaUser className="text-xl text-white" />
            </IconButton>
          </MenuHandler>
          <MenuList>
            <Link to="/profile/">
              <MenuItem>Profile</MenuItem>
            </Link>
            <Link to="/dashboard/">
              <MenuItem>Dashboard</MenuItem>
            </Link>
              <MenuItem  onClick={handleLogout} >Logout</MenuItem>
          </MenuList>
        </Menu>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography as="div" className="mr-4 cursor-pointer py-1.5 font-medium">
          <Link to="/">CY-RENT</Link>
        </Typography>
        <div className="hidden lg:block">{navList}</div>

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          {navList}

        </div>
      </MobileNav>
    </Navbar>
  );
}
