import axios from "axios";

// export const axiosInstance = axios.create({});

//  export const apiConnector = (method, url, bodyData, headers, params) =>{
//   return axiosInstance({
//     method:`${method}`,
//     url:`${url}`,
//     data: bodyData ? bodyData : null,
//     headers: headers ? headers: null,
//     params: params ? params : null,
//   });
//  }  original code $

//claude code resolved after network error issues



const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
  // timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  }
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? { ...headers } : null,
    params: params ? params : null,
  });
};