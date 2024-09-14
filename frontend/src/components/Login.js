import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../Signup.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null); // Profile from both manual form and Google login
  const [user, setUser] = useState(null); // Google user data
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Ensure response.data and response.data.tokens are defined
      if (response && response.data && response.data.tokens) {
        const { access, refresh } = response.data.tokens;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        console.log("Login successful", response.data);

        // After successful login, redirect to the StudyPage
        navigate("/"); // Redirects to StudyPage (home)
      } else {
        throw new Error("Invalid response structure from the backend");
      }
    } catch (error) {
      console.error("Login error", error.response?.data || error.message);
      setError("Invalid login credentials");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential;

    try {
      // Send Google token to the backend for validation
      const result = await axios.post(
        "http://localhost:8000/api/accounts/google-login/",
        {
          token,
        }
      );

      console.log("Google login successful:", result.data);
      setProfile(result.data.user);

      // After successful Google login, redirect to the StudyPage
      navigate("/"); // Redirects to StudyPage (home)
    } catch (error) {
      console.error(
        "Google login error",
        error.response?.data || error.message
      );
    }
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
    onSuccess: (codeResponse) => handleGoogleLoginSuccess(codeResponse),
    onError: (error) => console.log("Google Login Failed:", error),
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="container d-flex justify-content-center ">
      <div className="card p-5 mt-5 shadow-lg p-3 mb-5 bg-body">
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
            <b>Login to Your Account</b>
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

              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="form-row">
                <div className="form-group">
                  <button className="btn btn-primary w-100" type="submit">
                    Login
                  </button>
                </div>
              </div>

              <div className="form-row mt-4">
                <div className="form-group text-center">
                  <p>Don't have an account? Sign Up</p>
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

export default Login;
