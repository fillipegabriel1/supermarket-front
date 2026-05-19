import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({
  children
}: Props) {

  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}