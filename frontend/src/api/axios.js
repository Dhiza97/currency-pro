import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default API;




// import axios from "axios";

// const API = axios.create({
//     baseURL: 'http://localhost:5000/api'
// })

// // Fix corrupted localStorage
// const storedUser = localStorage.getItem("user");
// if (storedUser === "undefined" || !storedUser) {
//     localStorage.removeItem("user");
// }

// // Attach token automatically
// API.interceptors.request.use((req) => {
//     const userStr = localStorage.getItem("user")
    
//     if (userStr && userStr !== "undefined") {
//         try {
//             const user = JSON.parse(userStr)
//             if(user?.token) {
//                 req.headers.Authorization = `Bearer ${user.token}`
//             }
//         } catch (e) {
//             // Invalid JSON, ignore
//         }
//     }

//     return req
// })

// // Handle non-JSON error responses
// API.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             // Server responded with error status
//             const status = error.response.status;
//             let message = "An error occurred";
            
//             if (error.response.data?.message) {
//                 message = error.response.data.message;
//             } else if (status === 401) {
//                 message = "Unauthorized";
//             } else if (status === 404) {
//                 message = "Not found";
//             } else if (status === 500) {
//                 message = "Server error";
//             }
            
//             // Create a proper error object
//             return Promise.reject({
//                 response: {
//                     data: { message }
//                 }
//             });
//         }
//         return Promise.reject(error);
//     }
// )

// export default API