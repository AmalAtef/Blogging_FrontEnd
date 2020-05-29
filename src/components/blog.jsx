import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import clsx from "clsx";
import moment from "moment";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Link from "@material-ui/core/Link";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 500
  },
  media: {
    height: 0,
    paddingTop: "56.25%"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: blue[500]
  },
  auther: {
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

const Blog = props => {
  const { _id, title, body, imgPath, tags, auther, createdAt } = props.blog;
  const imgURL = imgPath ? imgPath : "placeholder.png";
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleUserClicked = () => {
    props.handleUserClicked(auther);
  };

  return (
    <React.Fragment>
      {props.blog && (
        <Card className={classes.root + " mx-auto my-4"}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {auther.firstName.charAt(0) + auther.lastName.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            className={classes.auther}
            title={auther.firstName + " " + auther.lastName}
            subheader={moment(createdAt).format("MMMM D, YYYY")}
            onClick={handleUserClicked}
          />
          <CardMedia
            className={classes.media}
            image={imgURL}
            title="Paella dish"
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {title}
            </Typography>
          </CardContent>
          <div className="ml-3">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="badge badge-pill badge-secondary px-2 py-1 mx-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <CardActions disableSpacing>
            {props.currentUser && auther._id == props.currentUser._id && (
              <div className="d-flex">
                <IconButton
                  aria-label="delete"
                  style={{ color: "#2196f3" }}
                  onClick={() => props.handleDeleteBlog(props.blog)}
                  className="m-2"
                >
                  <DeleteIcon />
                </IconButton>

                <NavLink
                  className="nav-link"
                  to={`/editBlog/${props.blog._id}`}
                >
                  <IconButton aria-label="edit" style={{ color: "#2196f3" }}>
                    <EditIcon />
                  </IconButton>
                </NavLink>
              </div>
            )}
            <Link
              onClick={handleExpandClick}
              component="button"
              style={{ color: "#2196f3" }}
              className={classes.expand}
            >
              More Details
              <IconButton
                aria-expanded={expanded}
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Link>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Details</Typography>
              <Typography paragraph>{body}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      )}{" "}
    </React.Fragment>
  );
};

export default Blog;
