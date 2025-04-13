import { Outlet } from "react-router-dom";
import GuestNav from "../components/nav/guestnav"; // Import the GuestNav component

const BaseLayout = () => {
  return (
    <>
      <GuestNav />
      <Outlet />
    </>
  );
};

export default BaseLayout;