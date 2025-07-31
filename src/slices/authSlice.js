import { createSlice } from "@reduxjs/toolkit";

//giving error Your backend is sending a raw JWT token string and Your frontend's authSlice.js (line 4) is trying to parse it as JSON with JSON.parse()
// const initialState = {
//   token: localStorage.getItem("token")
//     ? JSON.parse(localStorage.getItem("token"))
//     : null,
// };


// const authSlice = createSlice({
//   name: "auth",
//   initialState: initialState,
//   reducers: {
//     setToken(state, value) {
//       state.token = value.payload;
//     },
//   },
// });

// export const { setToken } = authSlice.actions;
// export default authSlice.reducer;

//Option 1: Remove JSON Parsing (Recommended)
// const initialState = {
//   token: localStorage.getItem("token") || null, // Remove JSON.parse
// };








// const initialState = {
//   // token: localStorage.getItem("token") || null,
//   token: null,
// };


// const authSlice = createSlice({
//   name: "auth",
//   initialState: initialState,
//   reducers: {
    
//     setToken(state, value) {
//       state.token = value.payload;
//     },
//   },
// });

// export const { setToken } = authSlice.actions;
// export default authSlice.reducer;











//Option 2: Keep JSON Format
// const initialState = {
//   token: localStorage.getItem("token")
//     ? JSON.parse(localStorage.getItem("token"))
//     : null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setToken(state, action) {
//       state.token = action.payload;
//       // Store as JSON string
//       if (action.payload) {
//         localStorage.setItem("token", JSON.stringify(action.payload));
//       } else {
//         localStorage.removeItem("token");
//       }
//     },
//   },
// });



// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   signupData: null,
//   loading: false,
//   token: localStorage.getItem("token") || null, // Remove JSON.parse
// };


//...................................................................................................

// const initialState = {
//   signupData: null,
//   loading: false,
//   // token: null,
//   token: localStorage.getItem("token") || null,
//  // Remove JSON.parse
// };



// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setSignupData(state, action) {
//       state.signupData = action.payload;
//     },
//     setLoading(state, action) {
//       state.loading = action.payload;
//     },
//     setToken(state, action) {
//       state.token = action.payload;
//       if (action.payload) {
//         localStorage.setItem("token", action.payload); // Store raw token
//       } else {
//         localStorage.removeItem("token");
//       }
//     },
//   },
// });

// export const { setSignupData, setLoading, setToken } = authSlice.actions;

// export default authSlice.reducer;

//........................................................................................

// Helper function to safely handle token storage
// const getStoredToken = () => {
//   const storedToken = localStorage.getItem("token");
//   if (!storedToken) return null;
  
//   try {
//     const parsedToken = JSON.parse(storedToken);
//     return parsedToken.token || parsedToken;
//   } catch {
//     return storedToken; // Return raw token if parsing fails
//   }
// };

// const initialState = {
//   signupData: null,
//   loading: false,
//   token: getStoredToken(),
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setSignupData(state, action) {
//       state.signupData = action.payload;
//     },
//     setLoading(state, action) {
//       state.loading = action.payload;
//     },
//     setToken(state, action) {
//       const token = action.payload;
//       state.token = token;
      
//       if (token) {
//         // Store token consistently as an object
//         localStorage.setItem(
//           "token", 
//           JSON.stringify(typeof token === 'string' ? { token } : token)
//         );
//       } else {
//         localStorage.removeItem("token");
//       }
//     }
//   },
// });

// export const { setSignupData, setLoading, setToken } = authSlice.actions;
// export default authSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";
// import jwt_decode from "jwt-decode"; // Add this import

// const getStoredToken = () => {
//   const storedToken = localStorage.getItem("token");
//   if (!storedToken) return null;
  
//   try {
//     const parsedToken = JSON.parse(storedToken);
//     return parsedToken.token || parsedToken;
//   } catch {
//     return storedToken;
//   }
// };

// // Add function to decode user from token
// const getUserFromToken = (token) => {
//   if (!token) return null;
//   try {
//     return jwt_decode(token);
//   } catch {
//     return null;
//   }
// };

// const initialState = {
//   signupData: null,
//   loading: false,
//   token: getStoredToken(),
//   user: getUserFromToken(getStoredToken()), // Add user to initial state
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setSignupData(state, action) {
//       state.signupData = action.payload;
//     },
//     setLoading(state, action) {
//       state.loading = action.payload;
//     },
//     setToken(state, action) {
//       const token = action.payload;
//       state.token = token;
//       state.user = getUserFromToken(token); // Update user when token changes
      
//       if (token) {
//         localStorage.setItem(
//           "token", 
//           JSON.stringify(typeof token === 'string' ? { token } : token)
//         );
//       } else {
//         localStorage.removeItem("token");
//         state.user = null; // Clear user when token is removed
//       }
//     }
//   },
// });

// export const { setSignupData, setLoading, setToken } = authSlice.actions;
// export default authSlice.reducer;





const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  signupData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setSignupData: (state, action) => {
      state.signupData = action.payload;
    },
  },
});

export const { setToken, setUser, setLoading, logout,setSignupData } = authSlice.actions;
export default authSlice.reducer;