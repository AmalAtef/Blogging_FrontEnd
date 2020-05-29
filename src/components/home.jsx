import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as userService from "../servicesToBackEnd/user";
import Pagination from "@material-ui/lab/Pagination";
import Blog from "./blog";
import UserCard from "./user";
import * as blogService from "./../servicesToBackEnd/blog";

const Home = props => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const pagesNum = Math.ceil(props.totalNumOfBlogs / props.size);
  const handelChangePagination = async (event, page) => {
    setPage(page);
    props.handelPagination(page);
    // window.scrollTo({
    //   top: 500,
    //   left: 0,
    //   behavior: "smooth"
    // });
  };
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <h2 className="m-2" style={{ color: "#2196f3" }}>
            Latest Blogs
          </h2>
          {props.Blogs.map(blog => (
            <Blog
              key={blog._id}
              blog={blog}
              handleUserClicked={props.handleUserClicked}
              currentUser={props.currentUser}
              handleDeleteBlog={props.handleDeleteBlog}
              handleBlog={props.handleBlog}
            />
          ))}
        </div>
        <div className="col-12 d-flex">
          <Pagination
            count={pagesNum}
            color="primary"
            page={page}
            onChange={handelChangePagination}
            className="m-auto"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
