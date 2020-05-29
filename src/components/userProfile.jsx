import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Blog from "./blog";
import UserCard from "./user";
import * as blogService from "./../servicesToBackEnd/blog";
import { useParams } from "react-router";

const UserProfile = props => {
  const params = useParams();
  const location = useLocation();
  const [user, setUser] = useState();
  const [userBlogs, setUserBlogs] = useState();
  const [page, setPage] = useState(1);
  const [pagesNum, setPagesNum] = useState();
  const handelChangePagination = async (event, page) => {
    setPage(page);
    props.handelPagination(page);
  };
  useEffect(() => {
    if (props.user && !params.id) {
      setUser(props.user);
      setPagesNum(Math.ceil(props.totalNumOfBlogs / props.size));
      setUserBlogs(props.Blogs);
    } else {
      async function getData() {
        const { data } = await blogService.getUserBlogs(
          props.currentUser._id,
          props.pagesNum,
          props.size
        );
        setUserBlogs(data.userBlogs);
        setUser(props.currentUser);
        setPagesNum(Math.ceil(data.totalNumOfBlogs / props.size));
      }
      getData();
    }
  }, [params.id]);
  return (
    <React.Fragment>
      {user && (
        <UserCard
          user={user}
          isFollow={props.isFollow}
          currentUser={props.currentUser}
          handleFollowUser={props.handleFollowUser}
        ></UserCard>
      )}
      {user && (
        <div className="row">
          <div className="col-12">
            <h2 className="m-2" style={{ color: "#2196f3" }}>
              Latest {user.firstName}'s Blogs
            </h2>
            {userBlogs &&
              userBlogs.map(blog => (
                <Blog
                  key={blog._id}
                  blog={blog}
                  handleUserClicked={props.handleUserClicked}
                  currentUser={props.currentUser}
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
      )}
    </React.Fragment>
  );
};

export default UserProfile;
