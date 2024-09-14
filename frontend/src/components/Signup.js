import React, { useState } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../Signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    picture: null,
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // Google user data
  const [preview, setPreview] = useState(null); // Preview for the image

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({
        ...formData,
        picture: file,
      });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("name", formData.name);
    form.append("profile_photo", formData.picture);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/signup/",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("User signed up:", response.data);
    } catch (error) {
      console.error("Sign-up error", error);
      setError("Error during sign-up.");
    }
  };

  const login = useGoogleLogin({
    flow: "implicit", // Ensure ID token is provided
    onSuccess: async (codeResponse) => {
      try {
        // Use id_token for decoding user information
        const decodedToken = jwtDecode(codeResponse.id_token); // Correct JWT token
        const { email, name, picture } = decodedToken;

        // Now send the user data to your backend
        await axios.post("http://localhost:8000/api/accounts/google-signup/", {
          email,
          name,
          picture, // Optional
        });

        console.log("User saved to database:", email, name);
      } catch (error) {
        console.log("Error saving Google user:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const logOut = () => {
    googleLogout();
    setUser(null);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="card w-75 p-4 mt-5 mb-5 shadow-lg bg-body">
          <div className="row justify-content-center text-center">
            <h4 className="card-title">
              <b>Create Your Account</b>
            </h4>
          </div>

          <div className="row justify-content-center">
            <form onSubmit={handleSubmit}>
              <div className="form-group w-100 mt-4 mb-3">
                <div className="row d-flex align-items-center">
                  <div className="col">
                    <label className="mb-2">Name</label>
                    <input
                      className="col-md-auto form-control"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="col-md-auto form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group w-100 mt-4 mb-3">
                <div className="row d-flex align-items-center">
                  <div className="col">
                    {preview && (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="preview-image"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                  <div className="col">
                    <label htmlFor="picture" className="mb-2">
                      Photo
                    </label>
                    <input
                      type="file"
                      className="form-control-file col-md-auto form-control"
                      id="picture"
                      name="picture"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group w-100 mt-4 mb-5">
                <div className="row d-flex align-items-center">
                  <div className="col">
                    <label className="mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="col-md-auto form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="col-md-auto form-control"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className="form-row m-4">
                <button className="btn btn-primary w-100" type="submit">
                  Sign Up
                </button>
              </div>

              <div className="form-row mt-2">
                <div className="form-group text-center">
                  <p>Already have an account? Login</p>
                </div>
              </div>
            </form>
          </div>

          <hr />

          <div>
            <div className="form-row m-4">
              <button
                type="button"
                className="w-100 btn btn-outline-danger "
                onClick={() => login()}
              >
                <span class="bi bi-google"> Sign up with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
