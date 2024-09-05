import React, { useState } from "react";

const SoundCloudPlayer = () => {
  const [soundCloudUrl, setSoundCloudUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const handleInputChange = (e) => {
    setSoundCloudUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = new URL(soundCloudUrl);
    const path = url.pathname;
    const embedBaseUrl =
      "https://w.soundcloud.com/player/?url=https://soundcloud.com";
    setEmbedUrl(
      `${embedBaseUrl}${path}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`
    );
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <form onSubmit={handleSubmit} className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Enter SoundCloud URL"
            value={soundCloudUrl}
            onChange={handleInputChange}
            className="form-control col-md-auto me-2"
          />
          <button type="submit" className="btn btn-outline-primary">
            Play
          </button>
        </form>
      </div>

      {embedUrl && (
        <div className="row">
          <iframe
            title="SoundCloud Player"
            width="100%"
            height="100"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={embedUrl}
            className="col"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default SoundCloudPlayer;
