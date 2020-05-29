import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as auth from "../../servicesToBackEnd/user";
import Joi from "joi-browser";
import { toast } from "react-toastify";

const RegisterForm = props => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    aboutU: ""
  });
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const schema = Joi.object().keys({
    firstName: Joi.string()
      .required()
      .min(3)
      .max(15),
    lastName: Joi.string()
      .min(3)
      .max(15),
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(8)
      .label("Password"),
    aboutU: Joi.string()
  });
  const validate = () => {
    const result = Joi.validate(user, schema, {
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
    const Newuser = { ...user };
    //Edit
    Newuser[target.id] = target.value;
    //SetState
    setUser(Newuser);
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
    //call backEnd to Login

    const { data } = await auth.Register(user);
    props.handleSignIn(data.user);
    history.push("/home");
    toast.success(
      `${data.user.firstName} YOU REGISTERED SUCCESSFULLY WELCOME TO BLOGGING SITE`
    );
  };

  return (
    <React.Fragment>
      <div className="card w-50  mx-auto my-4 rounded p-2">
        <h5 className="ml-0">REGISTER</h5>
        <div class="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                className="form-control"
                id="firstName"
                aria-describedby="basic-addon1"
                placeholder="First Name"
              />
              {errors.firstName && (
                <div class="alert alert-danger" role="alert">
                  {errors.firstName}
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                className="form-control"
                id="lastName"
                aria-describedby="basic-addon1"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <div class="alert alert-danger" role="alert">
                  {errors.lastName}
                </div>
              )}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
              {errors.email && (
                <div class="alert alert-danger" role="alert">
                  {errors.email}
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="form-control"
                id="password"
                placeholder="Password"
              />
              {errors.password && (
                <div class="alert alert-danger" role="alert">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="form-group">
              <textarea
                class="form-control"
                aria-label="With textarea"
                name="aboutU"
                value={user.aboutU}
                onChange={handleChange}
                className="form-control"
                placeholder="About You"
                id="aboutU"
              ></textarea>
              {errors.aboutU && (
                <div class="alert alert-danger" role="alert">
                  {errors.aboutU}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              SING UP
            </button>
          </form>
        </div>
        <div className="card-footer text-muted">
          <small>Already have an account?</small>
          <Link to="/login" className="small font-weight-bold">
            Sign In
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RegisterForm;
