import React, { useState } from "react";

const MusicPlayer = () => {
  const [musicUrl, setMusicUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [platform, setPlatform] = useState(""); // To track which platform is being played

  const handleInputChange = (e) => {
    setMusicUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Detect platform (SoundCloud or Spotify)
    if (musicUrl.includes("soundcloud.com")) {
      const soundCloudEmbedUrl = getSoundCloudEmbedUrl(musicUrl);
      setEmbedUrl(soundCloudEmbedUrl);
      setPlatform("SoundCloud");
    } else if (musicUrl.includes("spotify.com")) {
      const spotifyEmbedUrl = getSpotifyEmbedUrl(musicUrl);
      setEmbedUrl(spotifyEmbedUrl);
      setPlatform("Spotify");
    } else {
      alert("Please enter a valid SoundCloud or Spotify URL.");
    }
  };

  // Function to generate SoundCloud embed URL
  const getSoundCloudEmbedUrl = (url) => {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const embedBaseUrl =
      "https://w.soundcloud.com/player/?url=https://soundcloud.com";
    return `${embedBaseUrl}${path}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`;
  };

  // Function to generate Spotify embed URL
  const getSpotifyEmbedUrl = (url) => {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const embedBaseUrl = "https://open.spotify.com/embed";
    return `${embedBaseUrl}${path}`;
  };

  return (
    <div
      className="container card my-4 p-2 align-items-center"
      style={{ width: "23rem", height: "10rem" }}
    >
      <div className="row mb-3 w-100">
        <form onSubmit={handleSubmit} className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Enter SoundCloud or Spotify URL"
            value={musicUrl}
            onChange={handleInputChange}
            className="form-control me-2 shadow-lg  bg-body"
          />
          <button type="submit" className="btn btn-warning">
            Play
          </button>
        </form>
      </div>

      {embedUrl && (
        <div className="row w-100">
          <iframe
            title={`${platform} Player`}
            height="150"
            allow="autoplay; encrypted-media"
            src={embedUrl}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
