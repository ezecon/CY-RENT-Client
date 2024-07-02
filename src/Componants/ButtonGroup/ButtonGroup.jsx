import { Button, ButtonGroup } from "@material-tailwind/react";
import { Link } from "react-router-dom";


export default function Buttons() {
  return (
    <div>
       <div>
       <ButtonGroup variant="text">
        <Link to='/dashboard/rent-request'><Button>Rent Request</Button></Link>
        <Link to='/dashboard/rent-history'><Button>Rent History</Button></Link>
        <Link to='/dashboard/post-history'><Button>Post History</Button></Link>
      </ButtonGroup>
       </div>
    </div>
  )
}
