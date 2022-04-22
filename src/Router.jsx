import React from "react";
import Login from "./components/Login";
import { useSelector } from "react-redux";
import Home from "./Home";
import { userTokenSelector } from "./redux/settings/settings.selector";

const Router = () => {
  const token = useSelector(userTokenSelector);
  return (
    <div className="router">
      <Choose>
        <When condition={!token}>
          <Login />
        </When>
        <Otherwise>
          <Home />
        </Otherwise>
      </Choose>
    </div>
  );
};
export default Router;
