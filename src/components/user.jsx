import React, { useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import clx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { blue } from "@material-ui/core/colors";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    marginTop: 20,
    width: "60%"
  },
  avatar: {
    backgroundColor: blue[500],
    marginRight: 10
  },
  btn: {
    backgroundColor: "#021935",
    color: "white",
    "&:hover": {
      backgroundColor: blue[500]
    },
    flex: {
      display: "flex",
      justifyContent: "space-between"
    }
  }
}));

const UserCard = props => {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [loggedUser, setLoggedUser] = useState();
  const [isFollow, setIsFollow] = useState();
  useEffect(() => {
    setUser(props.user);
    setLoggedUser(props.currentUser);
    setIsFollow(props.isFollow);
  });

  const handleFollowUser = async followed => {
    if (followed) {
      props.handleFollowUser(true, user);
      setIsFollow(false);
    } else {
      props.handleFollowUser(false, user);
      setIsFollow(true);
    }
  };
  return (
    <React.Fragment>
      {loggedUser && (
        <Paper elevation={2} className={clx(classes.flex, classes.paper)}>
          <div className="row">
            <div className="col-9 d-flex">
              <Avatar className={classes.avatar}>
                {props.user.firstName.charAt(0) + props.user.lastName.charAt(0)}
              </Avatar>
              <Typography component="h3" variant="h6">
                {props.user.firstName + " " + props.user.lastName}
              </Typography>
            </div>
            {user._id !== loggedUser._id && (
              <div>
                {isFollow ? (
                  <div className="col-3">
                    <Button
                      variant="contained"
                      className={classes.btn}
                      onClick={() => handleFollowUser(true)}
                    >
                      Follow
                    </Button>
                  </div>
                ) : (
                  <div className="col-3">
                    <Button
                      variant="contained"
                      className={classes.btn}
                      onClick={() => handleFollowUser(false)}
                    >
                      UnFollow
                    </Button>
                  </div>
                )}
              </div>
            )}

            {user._id === loggedUser._id && (
              <Link
                to="/followed"
                variant="contained"
                className={classes.btn + " p-1 rounded"}
              >
                Followed Authers
              </Link>
            )}
          </div>
          <Typography component="p" className="ml-5" variant="h6">
            {props.user.aboutU}
          </Typography>
        </Paper>
      )}
    </React.Fragment>
  );
};

export default UserCard;
