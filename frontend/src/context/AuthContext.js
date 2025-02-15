import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const msg = require("sweetalert2");

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginRegisteredUser = async (email, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: email,
        password,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
      msg.fire({
        title: "Login Successful!",
        icon: "success",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#28a745",
        color: "#ffffff",
        text: "Hope you have a great day!",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
    } else {
      msg.fire({
        title: "Invalid Username or password !",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#ffffff",
        text: "The entered credentials are incorrect. Please try again.",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
    }
  };

  const registerNewUser = async (
    email,
    user_fullname,
    password,
    retype_password
  ) => {
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: email,
        user_fullname: user_fullname,
        password,
        retype_password: retype_password,
      }),
    });
    if (response.status === 201) {
      navigate("/login");
      msg.fire({
        title: "Registration Successful, Login Now",
        icon: "success",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#28a745",
        color: "#ffffff",
        text: "Hope you have a great day!",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
    } else if (response.status === 400) {
      msg.fire({
        title: "Error Occured in input fields ",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#ffffff",
        text: "The entered creddentials are incorrect. Please try again",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
    } else {
      msg.fire({
        title: "An Error Occured " + response.status,
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#ffffff",
        text: "There is some server problem. Please try again in few minutes.",
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
    }
  };

  const logoutRegisteredUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    msg.fire({
      title: "Successfully logged out !",
      icon: "success",
      toast: true,
      timer: 5000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#28a745",
      color: "#ffffff",
      text: "Have a great day! Hope to see you soon",
      didOpen: () => {
        msg.showLoading();
      },
      willClose: () => {
        msg.hideLoading();
      },
    });
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerNewUser,
    loginRegisteredUser,
    logoutRegisteredUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
