import axios from "axios";
import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const apiURL = "http://127.0.0.1:8000/api/";
const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
  const apiAxios = axios.create({
    baseURL: apiURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });
  //this function runs before request is handled
  apiAxios.interceptors.request.use(async (userRequest) => {
    const user = jwtDecode(authTokens.access);
    // exp predefined claims
    //calculate total time left untill expiration of token
    const expirationToken = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!expirationToken) {
      return userRequest;
    } else {
      try {
        const response = await axios.post(`${apiURL}token/refresh/`, {
          refresh: authTokens.refresh,
        });
        localStorage.setItem("authToken", JSON.stringify(response.data));
        
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));
        userRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return userRequest;
      } catch{
        console.error("Error while refreshing token");
        console.log("Refresh token:", authTokens?.refresh);

      }
    }
  });
  return apiAxios;
};
export default useAxios;
