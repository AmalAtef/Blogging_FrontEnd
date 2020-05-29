import React, { Component, useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as auth from "../../servicesToBackEnd/user";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import * as userService from "../../servicesToBackEnd/user";
import * as blogService from "../../servicesToBackEnd/blog";

const BlogForm = props => {
  const params = useParams();

  const [blog, setBlog] = useState({
    title: "",
    body: "",
    imgPath: "",
    tags: []
  });

  const [imgUrl, setImgUrl] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    async function getBlog() {
      if (params.id) {
        const { data } = await blogService.getBlogById(params.id);
        if (data.blog.imgPath) setImgUrl(data.blog.imgPath);
        else {
          setImgUrl("/placeholder.png");
          data.blog.imgPath = "placeholder.png";
        }
        setBlog(data.blog);
      } else {
        setImgUrl("");
        setBlog({
          title: "",
          body: "",
          imgPath: "",
          tags: []
        });
      }
    }
    getBlog();
  }, [params.id]);

  const schema = Joi.object().keys({
    _id: Joi.string(),
    auther: Joi.object(),
    title: Joi.string()
      .required()
      .label("title"),
    body: Joi.string()
      .required()
      .label("body"),
    imgPath: Joi.label("imgPath"),
    tags: Joi.array().items(Joi.string()),
    updatedAt: Joi.string(),
    createdAt: Joi.string()
  });
  const validate = () => {
    const result = Joi.validate(blog, schema, {
      abortEarly: false
    });
    // const error = {};
    if (result.error === null) {
      return null;
    }
    //Errors
    const errors = {};
    for (const error of result.error.details) {
      errors[error.path] = error.message;
    }
    return errors;
  };

  const handleChange = ({ target }) => {
    //Clone
    const Newblog = { ...blog };
    //Edit
    Newblog[target.id] = target.value;
    //SetState
    setBlog(Newblog);
  };
  const handleAddTag = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue = e.target.value;
      if (blog.tags.indexOf(inputValue) === -1) {
        setBlog({
          ...blog,
          tags: [...blog.tags, inputValue]
        });
        e.target.value = "";
      }
    }
  };
  const handleDeleteTag = val => {
    const tags = blog.tags.filter(tag => tag !== val);
    setBlog({
      ...blog,
      tags
    });
  };
  const handelImageUpload = e => {
    setBlog({ ...blog, imgPath: e.target.files[0] });
    let reader = new FileReader();
    reader.onload = function(event) {
      setImgUrl(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    //Validation
    const reserrors = validate();
    if (reserrors) {
      setErrors(reserrors);
      return;
    }
    setErrors({});
    //call backEnd
    props.handleBlog(blog);
  };

  return (
    <React.Fragment>
      <div className="card w-50 mx-auto my-4 rounded p-2">
        <h4 className="ml-0">{blog._id ? "Edit Blog" : "Add New Blog"}</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit} action="">
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={blog.title}
                onChange={handleChange}
                className="form-control border"
                id="title"
                placeholder="title"
              />
              {errors.title && (
                <div className="alert alert-danger" role="alert">
                  {errors.title}
                </div>
              )}
            </div>
            <div className="form-group">
              <textarea
                name="body"
                aria-label="With textarea"
                value={blog.body}
                onChange={handleChange}
                className="form-control border"
                placeholder="Body"
                id="body"
              ></textarea>
              {errors.body && (
                <div className="alert alert-danger" role="alert">
                  {errors.body}
                </div>
              )}
            </div>
            <div className="w-50 my-2">
              <img src={imgUrl} className="w-100" />
            </div>
            <div className="custom-file">
              <input
                className="custom-file-input form-control-file "
                type="file"
                name="imgPath"
                id="imgPath"
                placeholder={blog.imgPath.name}
                onChange={handelImageUpload}
              />
              <label className="custom-file-label" htmlFor="inputGroupFile01">
                Choose Image
              </label>
            </div>
            {errors.imgPath && (
              <div className="alert alert-danger" role="alert">
                {errors.imgPath}
              </div>
            )}

            <div className="form-group">
              <input
                type="text"
                name="tags"
                id="tags"
                placeholder="Add Tag"
                onKeyDown={handleAddTag}
                className="form-control border my-4"
              />
              {errors.tags && (
                <div className="alert alert-danger" role="alert">
                  {errors.tags}
                </div>
              )}
            </div>
            <div>
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="badge badge-pill badge-secondary px-2 py-1 m-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleDeleteTag(tag);
                  }}
                >
                  {tag}
                  <i className="far fa-times-circle ml-1"></i>
                </span>
              ))}
            </div>
            <input type="submit" className="btn btn-primary" value="Save" />
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogForm;
