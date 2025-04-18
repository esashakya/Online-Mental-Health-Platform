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
  //delete auth tokens after certain time
  useEffect(() => {
    const storedLocalTokens = JSON.parse(localStorage.getItem("authTokens"));
    if (storedLocalTokens) {
        const decodedUser = jwtDecode(storedLocalTokens.access);
        if (decodedUser.exp * 1000 < Date.now()) {
          logoutRegisteredUser(); 
        } else {
            setAuthTokens(storedLocalTokens);
            setUser(decodedUser);
        }
    }
}, []);

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
    } else if (response.status === 401 || response.status === 400) {
      const errorKey = Object.keys(data)[0];
      const errorText = data[errorKey][0];
    
      msg.fire({
        title: "Login Failed!",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#ffffff",
        text: errorText,
        didOpen: () => {
          msg.showLoading();
        },
        willClose: () => {
          msg.hideLoading();
        },
      });
    }
    else {
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
  const addNewPost = async(post_title,post_detail,anonymous,posts)=>{
    console.log("Sending Post Data:", posts);
     console.log("Access Token:", authTokens.access);
    const response = await fetch("http://127.0.0.1:8000/api/forum/", {
      method : "POST",
      headers: {
        "Authorization": `Bearer ${authTokens.access}`,
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({
        post_title,post_detail,anonymous,
        user_id : user.user_id,
      }),

    });
    

    if (response.status === 201) {
      navigate("/login");
      msg.fire({
        title: "Added post successfully!",
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
    } 
  }
  
  const addNewUser = async (
    formData
  ) => {
    try {
    const response = await fetch("http://127.0.0.1:8000/api/admin/add", {
      method: "POST",
      body: formData,
    });
    if (response.status === 400) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
  }
    if (response.status === 201) {
      navigate("/admin/RegisteredUsers");
      

      msg.fire({
        title: "Registration Successful",
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
    }}catch(error){
      console.error("Error:", error);
    }
  };
  //blog
  const addNewBlog = async (formData) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/blog/add", {
      method: "POST",
      body: formData,
    });
    
   
    let data;
    try {
      data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error parsing response:", error);
    }

    if (response.status === 400) {
      console.error("Error response:", data);
      
      // Show specific error message from the server if available
      const errorMessage = data && data.message 
        ? data.message 
        : "The entered credentials are incorrect. Please try again";
        
      msg.fire({
        title: "Error Occurred in Input Fields",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#dc3545",
        color: "#ffffff",
        text: errorMessage,
      });
      
      return false;
    }
    
    if (response.status === 201) {
      navigate("/admin/Post/Blog");
      
      msg.fire({
        title: "New Blog Added Successfully",
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
      
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      
      return true;
    } else {
      msg.fire({
        title: "An Error Occurred " + response.status,
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
      
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    msg.fire({
      title: "Connection Error",
      icon: "error",
      toast: true,
      timer: 5000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#dc3545",
      color: "#ffffff",
      text: "Cannot connect to the server. Please check your connection.",
    });
    return false;
  }
};
  //music
  const addNewMusic = async (
    formData
  ) => {
    try {
    const response = await fetch("http://127.0.0.1:8000/api/music/add", {
      method: "POST",
      body: formData,
    });
    if (response.status === 400) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
  }
    if (response.status === 201) {
      navigate("/admin/RegisteredMusics");
      

      msg.fire({
        title: "New Music Added Successfully",
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
        
        
      });setTimeout(() => {
        window.location.reload();
      }, 5000);
      
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
    }}catch(error){
      console.error("Error:", error);
    }
  };
  const registerNewUser = async (
    email,
    user_fullname,
    password,
    retype_password,
    userGender
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
        user_gender: userGender
      }),
    });
    const data = await response.json();
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
    }else if (response.status === 400) {
      // email error
      if (data.user_email && data.user_email[0] === "user with this user email already exists.") {
        msg.fire({
          title: "Given email exists in our system!",
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#dc3545",
          color: "#ffffff",
          text: "This email address is already registered in system. Please try again with different email address.",
        });
      } 
      //  password  error
      else if (data.password && data.password[0] === "Password fields are not the same") {
        msg.fire({
          title: "Password Mismatch",
          icon: "error",
          toast: true,
          timer: 5000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#dc3545",
          color: "#ffffff",
          text: "Passwords you provided do not match with each other. Please try again with correct passwords.",
        });
      } 
      else if (
        data.user_email &&
        data.user_email[0] === "Enter a valid email address."
      ) {
        msg.fire({
          title: "Invalid Email Format",
          icon: "error",
          toast: true,
          timer: 5000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#dc3545",
          color: "#ffffff",
          text: "Please provide your valid email address. Example: youremail@gmail.com",
        });
      }
      
      //  400 error
      else {
        
        const errorMessage = data[Object.keys(data)[0]]?.[0] || "Please check your input and try again.";
        msg.fire({
          title: "Invalid Input",
          icon: "error",
          toast: true,
          timer: 5000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#dc3545",
          color: "#ffffff",
          text: errorMessage,
        });
      }
    
    
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
  const registerNewDoctor = async (
    formData
  ) => {
    try {
    const response = await fetch("http://127.0.0.1:8000/api/register/doctor", {
      method: "POST",
      body: formData,
    });
    if (response.status === 400) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
  }
    if (response.status === 201) {
      navigate("/admin/RegisteredDoctorUsers");
      msg.fire({
        title: "Registration Successful",
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
    }}catch(error){
      console.error("Error:", error);
    }
  };

  
  
  
  
  const contextData = {
    user,
    setUser,
    authTokens,
    registerNewDoctor,
    setAuthTokens,
    registerNewUser,
    loginRegisteredUser,
    logoutRegisteredUser,
    addNewPost,
    addNewUser,
    addNewBlog,
    addNewMusic,
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
