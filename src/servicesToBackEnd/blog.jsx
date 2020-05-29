import axios from "axios";

export function getAllBlogs(pageNum, size) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/Blogs?pageNum=${pageNum}&size=${size}`
  );
}
export function getBlogById(id) {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/Blogs/${id}`);
}

export function getUserBlogs(userId, pageNum, size) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/Blogs/user/${userId}?pageNum=${pageNum}&size=${size}`
  );
}

export function getFollowedUsersBlogs(pageNum, size) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/Blogs/followedUsers?pageNum=${pageNum}&size=${size}`
  );
}
export function getBlogsBySearchType(type, value, pageNum, size) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/Blogs?type=${type}&value=${value}&pageNum=${pageNum}&size=${size}`
  );
}

export function AddBlog(blog) {
  return axios.post(`${process.env.REACT_APP_BACKEND_URL}/Blogs/`, blog);
}

export function EditBlog(id, blog) {
  return axios.patch(`${process.env.REACT_APP_BACKEND_URL}/Blogs/${id}`, blog);
}

export function DeleteBlog(id) {
  return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/Blogs/${id}`);
}
