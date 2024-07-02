import { Outlet } from "react-router-dom";
import Buttons from "../../Componants/ButtonGroup/ButtonGroup";

export default function Dashboard() {
  return (
    <div>
      <div>
      <Buttons/>
      </div>
      <Outlet/>
    </div>
  )
}
