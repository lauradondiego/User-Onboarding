import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";
import { Card } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

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
        <Field type="text" name="location" placeholder="Location" />
        {touched.location && errors.location && (
          <p className="error">{errors.location}</p>
        )}
        <Field type="text" name="age" placeholder="Age" />
        {touched.age && errors.age && <p className="error">{errors.age}</p>}

        <Field type="text" name="experience" placeholder="Experience" />
        {touched.experience && errors.experience && (
          <p className="error">{errors.experience}</p>
        )}

        <Field component="select" className="role-select" name="role">
          <option>Choose Your Role</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </Field>

        <label className="checkbox-container">
          Terms of Service
          <Field type="checkbox" name="terms" checked={values.terms} />
          <span className="checkmark" />
          {touched.terms && errors.terms && (
            <p className="error">{errors.terms}</p>
          )}
        </label>

        <button type="submit">Submit!</button>
      </Form>

      <Card>
        <Card.Content>
          <Card.Header>Users:</Card.Header>
          {user.map(users => (
            <p key={users.id}>
              <p>Name: {users.name}</p>
              <p>Email: {users.email} </p>
              <p>Password: {users.password} </p>
              <p>Location: {users.location} </p>
              <p>Experience? {users.experience} </p>
              <p>Age: {users.age}</p>
            </p>
          ))}
        </Card.Content>
      </Card>
    </div>
  );
};

// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// Function that takes in a component, extends some logic onto that component,
// returns a _new_ component (copy of the passed in component with the extended logic)
const FormikForm = withFormik({
  mapPropsToValues({
    name,
    email,
    password,
    location,
    age,
    experience,
    role,
    terms
  }) {
    return {
      terms: terms || false,
      name: name || "",
      email: email || "",
      password: password || "",
      location: location || "",
      role: role || "",
      age: age || "",
      experience: experience || ""
    };
  },

  validationSchema: Yup.object().shape({
    terms: Yup.boolean().oneOf([true], "You must agree to terms of service"),
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required!"),
    email: Yup.string()
      .email("Email is not valid, try again!")
      .required("Email is required!"),
    password: Yup.string()
      .min(5, "Password must be 5 characters or longer")
      .required("Password is required!"),
    location: Yup.string().required("Location is required!"),
    age: Yup.string().required("Age is required!"),
    experience: Yup.string().required("Experience is required!")
  }),

  handleSubmit(values, { setStatus, setErrors, resetForm }) {
    if (values.email === "waffle@syrup.com") {
      setErrors({ email: "That email is already taken" });
    } else {
      axios
        .post("https://reqres.in/api/users/", values)
        .then(response => {
          console.log("user data", response.data);
          setStatus(response.data);
          resetForm();
          // .then ({
          //   this.state.users.map(users => <Users setUser={users} />);
          // })
        })
        .catch(error => console.log("error", error.response));
    }
  }
})(UserForm); // currying functions in Javascript

export default FormikForm;
