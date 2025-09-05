import { Navigate } from "react-router-dom";
import { authService } from "../utils/auth";

const PrivateRoute = ({ children }: { children: any }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;