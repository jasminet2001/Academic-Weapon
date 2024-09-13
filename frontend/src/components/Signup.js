import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../Signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    picture: null, // Store the file object
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null); // Profile from both manual form and Google login
  const [user, setUser] = useState(null); // Google user data
  const [preview, setPreview] = useState(null); // Preview for the image

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({
        ...formData,
        picture: file, // Store the file object itself
      });
      setPreview(URL.createObjectURL(file)); // Show preview
    } else {
      // For text inputs like name, email, password, etc.
      setFormData({
        ...formData,
        [name]: value, // Update the form data by field name
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const form = new FormData(); // Creating form data
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("name", formData.name);
    form.append("profile_photo", formData.picture); // Append the image file

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
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
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

          {!profile && (
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
          )}

          <hr />

          {profile && (
            <div>
              <img
                src={profile.picture || "https://via.placeholder.com/100"}
                alt="User Profile"
              />
              <h3>User Logged in</h3>
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
              <br />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={logOut}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
