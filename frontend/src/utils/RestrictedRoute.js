import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

const RestrictedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log(user?.user_role);
    if (!user || ( user.user_role !== 2)) {
      setShowAlert(true);
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Sorry..You are not allowed to view the selected page",
        confirmButtonColor: "#3085d6",
      });
    }
  }, [user]);

  if (!user ||user.user_role !== 2) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RestrictedRoute;
