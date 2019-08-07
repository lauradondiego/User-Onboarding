import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

const UserForm = ({ errors, touched, values, status }) => {
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  //   console.log(user);

  useEffect(() => {
    if (status) {
      setUser([...user, status]);
    }
  }, [status]);

  return (
    <div className="user-form">
      <h1>New User Onboard Form</h1>
      <Form>
        <Field type="text" name="name" placeholder="Name" />
        {touched.name && errors.name && <p className="error">{errors.name}</p>}

        <Field type="text" name="email" placeholder="Email" />
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        <Field type="text" name="password" placeholder="Password" />
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}

        <label className="checkbox-container">
          Terms of Service
          <Field type="checkbox" name="terms" checked={values.terms} />
          <span className="checkmark" />
        </label>

        <button type="submit">Submit!</button>
      </Form>

      {user.map(eachUser => (
        <p key={eachUser.id}>{eachUser.name}</p>
      ))}
    </div>
  );
};

// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// Function that takes in a component, extends some logic onto that component,
// returns a _new_ component (copy of the passed in component with the extended logic)
const FormikForm = withFormik({
  mapPropsToValues({ name, email, password, terms }) {
    return {
      terms: terms || false,
      name: name || "",
      email: email || "",
      password: password || ""
    };
  },

  validationSchema: Yup.object().shape({
    terms: Yup.boolean().oneOf([true], "You  must agree to terms of service"),
    // required("You must agree to terms of service"),
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required!"),
    email: Yup.string()
      .email("Email is not valid, try again!")
      .required("Email is required!"),
    password: Yup.string()
      .min(5, "Password must be 5 characters or longer")
      .required("Password is required!")
  }),

  handleSubmit(values, { setStatus }) {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(response => {
        console.log("user data", response.data);
        setStatus(response.data);
        // .then ({
        //   this.state.users.map(users => <Users setUser={users} />);
        // })
      })
      .catch(error => console.log("error", error.response));
  }
})(UserForm); // currying functions in Javascript

export default FormikForm;
