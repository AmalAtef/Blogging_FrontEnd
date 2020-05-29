import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as auth from "../../servicesToBackEnd/user";
import Joi from "joi-browser";
import { toast } from "react-toastify";

const LoginForm = props => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const schema = Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(8)
      .label("Password")
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

    const { data } = await auth.Login(user);
    if (data.token !== undefined) {
      localStorage.setItem("token", data.token);
      auth.setToken(data.token);
      props.handleSignIn(data.userFound);
      history.push("/home");
      toast.success(`WELCOME ${data.userFound.firstName} TO BLOGGING SITE`);
    } else {
      toast.error("incorrect Email Or Password try again !");
    }
  };

  return (
    <React.Fragment>
      <div className="card w-50 mx-auto my-4 rounded p-2">
        <h5 className="ml-0">LOGIN</h5>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
                <div className="alert alert-danger" role="alert">
                  {errors.password}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              SING IN
            </button>
          </form>
        </div>
        <div className="card-footer text-muted">
          <small>Don't have an account? </small>
          <Link to="/register" className="small font-weight-bold">
            Sign Up
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginForm;
