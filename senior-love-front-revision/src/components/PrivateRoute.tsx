import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // TODO: Improve security by using API Check
  return localStorage.getItem("token") !== null;
};

const PrivateRoute = ({ children }: { children: any }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;