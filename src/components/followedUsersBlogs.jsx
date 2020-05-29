import React, { useState, useEffect } from "react";
import Pagination from "@material-ui/lab/Pagination";
import Blog from "./blog";

const FollowedUsers = props => {
  const [page, setPage] = useState(1);
  const [pagesNum, setPagesNum] = useState();
  useEffect(() => {
    setPagesNum(Math.ceil(props.totalNumOfBlogs / props.size));
  }, []);
  const handelChangePagination = async (event, page) => {
    setPage(page);
    props.handelPagination(page);
  };
  return (
    <React.Fragment>
      {props.totalNumOfBlogs === 0 ? (
        <h2 className="m-2" style={{ color: "#2196f3" }}>
          No Followed Authers
        </h2>
      ) : (
        <h2 className="m-2" style={{ color: "#2196f3" }}>
          Latest Followed Authers' Blogs
        </h2>
      )}
      {props.Blogs && (
        <div className="row">
          <div className="col-12">
            {props.Blogs.map(blog => (
              <Blog
                key={blog._id}
                blog={blog}
                handleUserClicked={props.handleUserClicked}
              />
            ))}
          </div>
        </div>
      )}
      <div className="row">
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

export default FollowedUsers;
