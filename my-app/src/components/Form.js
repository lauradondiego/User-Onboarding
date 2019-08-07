import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

const UserForm = ({ errors, touched, values, handleSubmit, status }) => {
  const [user, setUser] = useState([]);
  console.log(user);

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
    name: Yup.string().required("You don't have a name?!"),
    email: Yup.string().required("Hmm this doesn't seem right..."),
    password: Yup.string().required("Try entering password again!")
  }),

  handleSubmit(values, { setStatus }) {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        setStatus(res.data);
      })
      .catch(err => console.log(err.response));
  }
})(UserForm); // currying functions in Javascript

export default FormikForm;
