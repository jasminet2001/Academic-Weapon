import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../Signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    picture: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null); // Profile from both manual form and Google login
  const [user, setUser] = useState(null); // Google user data

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    // Set profile with form data on successful submission
    setProfile({
      email: formData.email,
      picture: formData.picture,
    });
    setError("");
    console.log("Submitting sign up data:", formData);
  };

  // Handles Google login success
  const handleGoogleLoginSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    console.log("Google user data: ", decoded);
    setProfile(decoded); // Use Google profile data directly
  };

  // Use Google login to fetch user info
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data); // Update profile with Google data
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card p-4 mt-5">
        {/* the jumping car */}
        {/* <div className="row justify-content-center mb-3">
          {" "}
          <div className="col-auto">
            <img
              src="../../public/cute-cat-white.gif"
              alt="Cat Jumping"
              className="img-fluid"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
          <div className="col-auto">
            <img
              src="path-to-second-cat-gif.gif"
              alt="Cat Jumping"
              className="img-fluid"
              style={{ width: "100px" }}
            />
          </div>
        </div> */}
        <div className="row justify-content-center text-center">
          <h4 className="card-title">
            <b>Create Your Account</b>
          </h4>
        </div>
        {!profile && (
          <div className="row justify-content-center">
            <form onSubmit={handleSubmit}>
              {/* <div className="form-row mb-4 mt-4">
                <div className="form-group">
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
              </div> */}
              <div className="form-row mb-4 mt-4">
                <div className="form-group">
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
              <div className="form-row mb-4">
                <div className="form-group">
                  <label for="picture" className="mb-2">
                    Photo
                  </label>
                  <input
                    type="file"
                    className="form-control-file col-md-auto form-control"
                    id="picture"
                    value={formData.picture}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row mb-4">
                <div className="form-group">
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
              </div>
              <div className="form-row mb-4">
                <div className="form-group">
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

              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="form-row">
                <div className="form-group">
                  <button
                    className="btn btn-outline-primary w-100"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="form-row mt-4">
                <div className="form-group text-center">
                  <p>Already have an account? Login</p>
                </div>
              </div>
            </form>
          </div>
        )}

        <hr />

        {profile ? (
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
        ) : (
          <button
            type="button"
            className="btn btn btn-outline-danger"
            onClick={login}
          >
            <span class="bi bi-google"> Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SignUp;
