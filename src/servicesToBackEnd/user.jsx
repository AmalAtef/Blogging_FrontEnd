import axios from "axios";

//Register
export function Register(NewUser) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/users/register`,
    NewUser
  );
}
//Login
export function Login(user) {
  return axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, user);
}
//Set Token in headers
export function setToken(token) {
  if (token) axios.defaults.headers.common["autherization"] = `${token}`;
  else delete axios.defaults.headers.common["autherization"];
  return token;
}
//LogOut
export function LogOut(user) {
  localStorage.removeItem("token");
}
// Get specific User
export function getById(id) {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`);
}

export function getCurrentUser() {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`);
}

// Follow specific User
export function followUser(id) {
  return axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/follow/${id}`);
}

// unFollow specific User
export function unFollowUser(id) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/users/unfollow/${id}`
  );
}

//Edit current User
export function Edit() {
  return axios.update(`${process.env.REACT_APP_BACKEND_URL}/users`);
}

//Delete current User

export function Delete(id) {
  return axios.Delete(`${process.env.REACT_APP_BACKEND_URL}/users`);
}
