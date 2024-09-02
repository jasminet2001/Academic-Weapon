import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "@leecheuk/react-google-login";
import { gapi } from "gapi-script";

const CLIENT_ID = ".apps.googleusercontent.com";
const API_KEY = "";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

const CalendarComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          authInstance.isSignedIn.listen(setIsAuthenticated);
          setIsAuthenticated(authInstance.isSignedIn.get());
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    setIsAuthenticated(true);
    listUpcomingEvents();
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failed:", response);
  };

  const handleLogoutSuccess = () => {
    setIsAuthenticated(false);
    setEvents([]);
  };

  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response) => {
        const events = response.result.items;
        setEvents(events);
      });
  };

  return (
    <div className="card w-25">
      {!isAuthenticated ? (
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Login with Google"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          scope={SCOPES}
        />
      ) : (
        <GoogleLogout
          clientId={CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={handleLogoutSuccess}
        />
      )}

      {isAuthenticated && (
        <div>
          <h2>Upcoming Events</h2>
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                {event.summary} -{" "}
                {new Date(event.start.dateTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
