import React, { Component } from "react";
import Header from "./components/header";
import LoginForm from "./components/Forms/LoginForm";
import RegisterForm from "./components/Forms/RegisterForm";
import Home from "./components/home";
import BlogForm from "./components/Forms/BlogForm";
import UserProfile from "./components/userProfile";
import FollowedUserBlogs from "./components/followedUsersBlogs";
import PageNotFound from "./components/errorPageNotFound";
import { ToastContainer } from "react-toastify";
import * as userService from "./servicesToBackEnd/user";
import * as blogService from "./servicesToBackEnd/blog";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import { toast } from "react-toastify";
import "./App.css";
class App extends Component {
  state = {
    blogs: [],
    pageNum: 1,
    size: 4,
    tokenExist: false,
    singleBlog: {},
    returnBlogsNum: 0,
    currentUser: null,
    onSearch: false,
    typeSearch: "",
    valueSearch: "",
    userClicked: null,
    userClikedBlogs: [],
    currentUserBlogs: [],
    returnUserClikedBlogsNum: 0,
    isFollow: false,
    FollowedUsersBlogs: [],
    totalFollowedNums: 0
  };
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const { pageNum, size } = this.state;
    const { data } = await blogService.getAllBlogs(pageNum, size);
    this.setState({
      blogs: data.Blogs,
      returnBlogsNum: data.totalNumOfBlogs
    });
    let token = localStorage.getItem("token");
    token = userService.setToken(token);
    if (token) {
      const { data } = await userService.getCurrentUser();
      this.setState({
        currentUser: data.user,
        tokenExist: true
      });
    }
    if (token) {
      const { data } = await blogService.getFollowedUsersBlogs(pageNum, size);
      if (data.blogs.length === 0) {
        this.setState({});
      } else {
        this.setState({
          FollowedUsersBlogs: data.blogs,
          totalFollowedNums: data.totalNumOfBlogs
        });
      }
    }
  }

  handelChangePagination = async page => {
    if (this.state.onSearch) {
      const { data } = await blogService.getBlogsBySearchType(
        this.state.typeSearch,
        this.state.valueSearch,
        page,
        this.state.size
      );
      this.setState({
        blogs: data.Blogs,
        returnBlogsNum: data.totalNumOfBlogs
      });
      this.state.onSearch = false;
    } else if (this.props.location.pathname === "/userProfile") {
      const { data } = await blogService.getUserBlogs(
        this.state.userClicked._id,
        page,
        this.state.size
      );
      this.setState({
        userClikedBlogs: data.userBlogs,
        returnUserClikedBlogsNum: data.totalNumOfBlogs
      });
    } else if (this.props.location.pathname === "/followed") {
      const { data } = await blogService.getFollowedUsersBlogs(
        page,
        this.state.size
      );
      this.setState({
        FollowedUsersBlogs: data.blogs
      });
    } else {
      const { data } = await blogService.getAllBlogs(page, this.state.size);
      this.setState({
        blogs: data.Blogs,
        returnBlogsNum: data.totalNumOfBlogs
      });
    }
  };
  handleSearch = async (type, value) => {
    const { pageNum, size } = this.state;
    this.state.typeSearch = type;
    this.state.valueSearch = value;
    const { data } = await blogService.getBlogsBySearchType(
      type,
      value,
      pageNum,
      size
    );
    this.state.onSearch = true;
    this.setState({ blogs: data.Blogs, returnBlogsNum: data.totalNumOfBlogs });
  };
  handleUserClicked = async user => {
    if (this.state.currentUser) {
      this.state.userClicked = user;
      const { data } = await blogService.getUserBlogs(
        this.state.userClicked._id,
        this.state.pageNum,
        this.state.size
      );
      this.setState({
        userClikedBlogs: data.userBlogs,
        returnUserClikedBlogsNum: data.totalNumOfBlogs
      });
      if (
        user._id !== this.state.currentUser._id &&
        this.state.currentUser.followedUsers.indexOf(user._id) === -1
      ) {
        this.setState({ isFollow: true });
      } else {
        this.setState({ isFollow: false });
      }
      this.props.history.push("/userProfile");
    } else {
      this.props.history.push("/login");
    }
  };
  handleClickHome = async () => {
    const { pageNum, size } = this.state;
    const { data } = await blogService.getAllBlogs(pageNum, size);
    this.setState({
      blogs: data.Blogs,
      returnBlogsNum: data.totalNumOfBlogs
    });
  };

  handleBlog = async blog => {
    let formData = new FormData();
    formData.append("title", blog.title);
    formData.append("body", blog.body);
    for (let i = 0; i < blog.tags.length; i++) {
      formData.append("tags", blog.tags[i]);
    }
    formData.append("imgPath", blog.imgPath);

    if (this.props.location.pathname === `/editBlog/${blog._id}`) {
      const { data } = await blogService.EditBlog(blog._id, formData);
      toast.success(data.message);
    } else {
      const { data } = await blogService.AddBlog(formData);
      toast.success(data.message);
    }
    const { pageNum, size } = this.state;
    const { data } = await blogService.getAllBlogs(pageNum, size);
    this.setState({
      blogs: data.Blogs,
      returnBlogsNum: data.totalNumOfBlogs
    });
    this.props.history.push(`/home`);
  };
  handleSignOUt = () => {
    userService.LogOut();
    this.setState({ tokenExist: false, currentUser: null });
  };
  handleSignIn = user => {
    this.setState({ tokenExist: true, currentUser: user });
  };
  handleDeleteBlog = async blog => {
    const blogs = this.state.blogs.filter(b => b._id !== blog._id);
    const { data } = await blogService.DeleteBlog(blog._id);
    toast.success(data.message);
    this.setState({ blogs, returnBlogsNum: this.state.returnBlogsNum - 1 });
  };
  handleFollowUser = async (isFollowed, user) => {
    if (isFollowed) {
      const { data } = await userService.followUser(user._id);
      toast.success(data.message);
      this.setState({ isFollow: false });
    } else {
      const { data } = await userService.unFollowUser(user._id);
      toast.success(data.message);
      this.setState({ isFollow: true });
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className="App">
          <ToastContainer />

          <Header
            tokenExist={this.state.tokenExist}
            handleSearch={this.handleSearch}
            handleClickHome={this.handleClickHome}
            handleBlog={this.handleBlog}
            currentUser={this.state.currentUser}
            handleSignOUt={this.handleSignOUt}
          ></Header>
          <div className="container">
            <Switch>
              <Route
                path="/register"
                render={props => (
                  <RegisterForm {...props} handleSignIn={this.handleSignIn} />
                )}
              />
              <Route
                path="/login"
                render={props => (
                  <LoginForm {...props} handleSignIn={this.handleSignIn} />
                )}
              />
              <Route
                path="/editBlog/:id"
                render={props => (
                  <BlogForm {...props} handleBlog={this.handleBlog} />
                )}
              />

              <Route path="/error" component={PageNotFound} />

              <Route
                path="/addBlog"
                render={props => (
                  <BlogForm {...props} handleBlog={this.handleBlog} />
                )}
              />
              <Route
                path="/userProfile/:id?"
                render={props => (
                  <UserProfile
                    {...props}
                    tokenExist={this.state.tokenExist}
                    Blogs={this.state.userClikedBlogs}
                    pageNum={this.state.pageNum}
                    size={this.state.size}
                    isFollow={this.state.isFollow}
                    user={this.state.userClicked}
                    currentUser={this.state.currentUser}
                    totalNumOfBlogs={this.state.returnUserClikedBlogsNum}
                    handelPagination={this.handelChangePagination}
                    handleUserClicked={this.handleUserClicked}
                    handleFollowUser={this.handleFollowUser}
                    handleBlog={this.handleBlog}
                  />
                )}
              />

              <Route
                path="/followed"
                render={props => (
                  <FollowedUserBlogs
                    {...props}
                    pageNum={this.state.pageNum}
                    size={this.state.size}
                    handelPagination={this.handelChangePagination}
                    handleUserClicked={this.handleUserClicked}
                    Blogs={this.state.FollowedUsersBlogs}
                    totalNumOfBlogs={this.state.totalFollowedNums}
                  />
                )}
              />
              <Route
                path="/home"
                exact={true}
                render={props => (
                  <Home
                    {...props}
                    tokenExist={this.state.tokenExist}
                    Blogs={this.state.blogs}
                    pageNum={this.state.pageNum}
                    size={this.state.size}
                    currentUser={this.state.currentUser}
                    totalNumOfBlogs={this.state.returnBlogsNum}
                    handelPagination={this.handelChangePagination}
                    handleUserClicked={this.handleUserClicked}
                    handleDeleteBlog={this.handleDeleteBlog}
                    handleBlog={this.handleBlog}
                  />
                )}
              />
              <Redirect from="/" to="/home" />
              <Redirect to="/error"></Redirect>
            </Switch>
          </div>
        </div>
        {/* <div class="card-footer text-muted text-center mt-3">
          Copyright © BLOG.DOT 2020
        </div> */}
      </React.Fragment>
    );
  }
}

export default withRouter(App);
