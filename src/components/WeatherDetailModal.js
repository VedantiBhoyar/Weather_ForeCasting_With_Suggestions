import React from "react";
import "./WeatherDetailModal.css";

function WeatherDetailModal({ day, onClose }) {
  if (!day) return null;
  let tempc = Math.round(day.temp - 273.15)

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 6l8 8M14 6l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="weather-header">
          <h3>Weather Details</h3>
          {day.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.weather_desc}
              className="weather-icon"
            />
          )}
        </div>

        <div className="weather-details-grid">
          <div>
            <span className="label">Date:</span>
            <span>{day.date}</span>
          </div>
          <div>
            <span className="label">Description:</span>
            <span>{day.weather_desc}</span>
          </div>
          <div>
            <span className="label">Temperature:</span>
            <span> {tempc}'C</span>
          </div>
          <div>
            <span className="label">Humidity:</span>
            <span>{day.humidity}%</span>
          </div>
          <div>
            <span className="label">Wind:</span>
            <span>{day.wind} m/s</span>
          </div>
          <div>
            <span className="label">Country:</span>
            <span>{day.country}</span>
          </div>
          <div>
            <span className="label">Coordinates:</span>
            <span>
              {day.coord && `${day.coord.lat}, ${day.coord.lon}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDetailModal;