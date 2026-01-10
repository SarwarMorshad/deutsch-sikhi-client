import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

const useAxiosSecure = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Request Interceptor - Add auth token to every request
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Handle auth errors
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
