import React, { useState } from "react";
import "../Profile.css";
import BottomNavbar from "./Navbar";


const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "Doe",
    email: "doe@gmail.com",
    password: "123",
    retypePassword: "123",
    profilePicture: "../../public/cute-cat-white.gif",
  });

  const [preview, setPreview] = useState(formData.profilePicture);
  const [validated, setValidated] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePicture: file,
    });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const isFormValid = form.checkValidity();

    // Check password match
    if (formData.password !== formData.retypePassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }

    if (!isFormValid || passwordMismatch) {
      e.stopPropagation();
    } else {
      // Form is valid and passwords match
      console.log("Form submitted successfully:", formData);
    }

    setValidated(true);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="card shadow-lg p-2 bg-body w-75 mt-5">
          <div className="card-body d-flex flex-column align-items-center">
            <h3 className="card-title text-center mb-4">Edit Profile</h3>
            <form
              noValidate
              className={`d-flex flex-column align-items-center w-100 ${
                validated ? "was-validated" : ""
              }`}
              onSubmit={handleSubmit}
            >
              {/* Profile Picture Preview */}
              <div className="form-group w-100 mt-4 mb-3">
                <div className="row g-3 d-flex align-items-center">
                  <div className="col mb-3 mt-2 w-100">
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
                  <div className="col mb-3 mt-2 w-100 d-flex flex-column align-items-center justify-content-center">
                    <label htmlFor="profilePicture" className="form-label">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="form-group w-100 mb-3">
                <div className="row d-flex align-items-center mb-3">
                  <div className="col">
                    {" "}
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder={formData.name}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">
                      Please provide a valid name.
                    </div>
                  </div>
                  <div className="col">
                    {" "}
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder={formData.email}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    />
                    <div className="invalid-feedback">
                      Please provide a valid email.
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group w-100">
                <div className="row g-3 d-flex align-items-center mb-3">
                  {" "}
                  <div className="col mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder={formData.password}
                      value={formData.password}
                      onChange={handleChange}
                      minLength="8"
                      required
                    />
                    <div className="invalid-feedback">
                      Password must be at least 8 characters long.
                    </div>
                  </div>
                  <div className="col mb-3">
                    <label htmlFor="retypePassword" className="form-label">
                      Retype Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        passwordMismatch ? "is-invalid" : ""
                      }`}
                      id="retypePassword"
                      name="retypePassword"
                      placeholder={formData.retypePassword}
                      value={formData.retypePassword}
                      onChange={handleChange}
                      minLength="8"
                      required
                    />
                    <div className="invalid-feedback">
                      {passwordMismatch
                        ? "Passwords do not match."
                        : "Password must be at least 8 characters long."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-left w-100">
                <button type="submit" className="btn btn-primary mt-2">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default EditProfile;
