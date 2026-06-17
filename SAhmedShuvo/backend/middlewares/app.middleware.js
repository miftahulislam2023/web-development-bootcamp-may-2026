const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

module.exports = (app) => {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(helmet());

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://expense-tracker-frontend-ruby-nine.vercel.app" 
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // allow tools like Postman or server-to-server requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
};
