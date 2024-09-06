import React, { useState, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from "@leecheuk/react-google-login";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // If you need to drag and drop events
import listPlugin from "@fullcalendar/list"; // If you want a list
import bootstrapPlugin from "@fullcalendar/bootstrap5"; // Import Bootstrap plugin
import "../Calendar.css";
const CLIENT_ID =
  "210279610391-el366v0eg5ohct8l9fgj2jknndf5r1h8.apps.googleusercontent.com";
const API_KEY = "AIzaSyC3iCgeUBr2YUzavl-KAC-w2d4k6VIlYkA";

const CalendarApp = () => {
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    function start() {
      gapi.load("client:auth2", () => {
        if (!gapi.auth2.getAuthInstance()) {
          gapi.auth2
            .init({
              client_id: CLIENT_ID,
              scope:
                "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
            })
            .then(() => {
              if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                setIsLoggedIn(true);
                loadEvents();
              }
            })
            .catch((error) => {
              console.error("Error initializing Google API:", error);
            });
        } else {
          loadEvents();
        }
      });
    }
    start();
  }, []);

  const loadEvents = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      })
      .then(() => {
        return gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime",
        });
      })
      .then((response) => {
        const events = response.result.items.map((event) => ({
          id: event.id,
          title: event.summary,
          start: event.start.dateTime || event.start.date, // FullCalendar expects either dateTime or date
          end: event.end.dateTime || event.end.date,
        }));
        setEvents(events);
      })
      .catch((error) => {
        console.error("Error loading events:", error);
      });
  };

  const handleLoginSuccess = (response) => {
    setIsLoggedIn(true);
    loadEvents();
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setEvents([]);
  };

  const handleAddEvent = () => {
    const event = {
      summary: "Sample Event",
      start: {
        dateTime: new Date().toISOString(),
      },
      end: {
        dateTime: new Date(new Date().getTime() + 3600000).toISOString(), // 1 hour later
      },
    };

    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: event,
      })
      .then(() => {
        alert("Event added successfully! Redirecting to Google Calendar...");
        window.open("https://calendar.google.com/calendar/u/0/r", "_blank");
        loadEvents(); // Refresh the events list
      })
      .catch((error) => {
        console.error("Error creating event:", error);
      });
  };

  return (
    <div className="container card py-4 px-4 shadow-lg p-3 mb-5 bg-body">
      <h1 className="card-title my-2">Google Calendar Events</h1>
      {!isLoggedIn ? (
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Login with Google"
          onSuccess={handleLoginSuccess}
          onFailure={(error) => console.error("Login Failed:", error)}
          cookiePolicy={"single_host_origin"}
        />
      ) : (
        <div className="calendar-container">
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={handleLogoutSuccess}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="btn btn-outline-primary mx-2 my-2"
              >
                Logout
              </button>
            )}
          />
          <button onClick={handleAddEvent} className="btn btn-outline-primary">
            Add Event
          </button>
          <h2 className="my-4">Your Events</h2>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              bootstrapPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={events} // Fetch events dynamically as you were before
            expandRows={true}
            navLinks={true} // Allows navigation by clicking on day/week names
            editable={true}
            selectable={true}
            nowIndicator={true}
            dayMaxEvents={true} // Shows "more" link when too many events
            aspectRatio={1}
            themeSystem="bootstrap5"
          />
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
