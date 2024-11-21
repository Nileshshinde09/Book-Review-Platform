import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./components";

const App = (): React.ReactNode => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default App;
