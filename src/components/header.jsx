import React, { Component, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import * as userService from "../servicesToBackEnd/user";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { blue } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles(theme => ({
  button: {
    display: "inline",
    marginTop: theme.spacing(2)
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 150
  },
  avatar: {
    backgroundColor: blue[500],
    marginRight: 10,
    "&:hover": {
      cursor: "pointer"
    },
    marginLeft: "3rem"
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: blue[500],
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const Header = props => {
  const [open, setOpen] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectChange = event => {
    setSearchType(event.target.value);
  };

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
  };
  const handleClose2 = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmitSearch = () => {
    props.handleSearch(searchType, searchValue);
  };

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/home">
          BLOG.DOT
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                onClick={props.handleClickHome}
                to="/home"
              >
                Home
              </NavLink>
            </li>
            {props.tokenExist && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/addBlog">
                  Add Blog
                </NavLink>
              </li>
            )}
          </ul>
          {props.tokenExist && (
            <div className="d-flex">
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">
                  Type Of Search
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={open}
                  onClose={handleClose2}
                  onOpen={handleOpen}
                  value={searchType}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"auther"}>Auther</MenuItem>
                  <MenuItem value={"title"}>Title</MenuItem>
                  <MenuItem value={"tag"}>Tags</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search Value"
                onChange={handleSearchChange}
                value={searchValue}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <SearchIcon onClick={handleSubmitSearch} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          )}
          {props.tokenExist && (
            <div>
              <Avatar
                className={classes.avatar}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
              ></Avatar>
              <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem>
                  <NavLink
                    className="nav-link"
                    to={`/userProfile/${props.currentUser._id}`}
                  >
                    <ListItemText
                      primary="My Profile"
                      onClick={props.handleOnMyProfile}
                    />
                  </NavLink>
                </StyledMenuItem>

                <StyledMenuItem>
                  <ListItemText
                    primary=" Sign Out"
                    onClick={props.handleSignOUt}
                  />
                </StyledMenuItem>
              </StyledMenu>
            </div>
          )}

          {!props.tokenExist && (
            <div className="d-flex">
              <NavLink className="nav-link" to="/login">
                <button className="btn btn-primary my-2 my-sm-0" type="text">
                  SING IN
                </button>
              </NavLink>
              <NavLink className="nav-link" to="/register">
                <button className="btn btn-primary my-2 my-sm-0" type="text">
                  SING UP
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
