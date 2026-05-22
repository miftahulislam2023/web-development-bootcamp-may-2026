# ChitChat Server
Welcome to chitchat a realtime messaging server

## Quick Start
Setup environment variables with reference from [.env.example](https://github.com/shojib116/web-development-bootcamp-may-2026/blob/main/shojib116/server/.env.example). You will need to run database migration using goose. Install it using 
```
go install github.com/pressly/goose/v3/cmd/goose@latest
``` 
go to `server/sql/schema folder` and run 
```
goose postgres yourdbconnectionstring up
``` 
(choose db driver if you prefer something other than postgres)
```
go run .
```

## Usage
Start the frontend and start registering user, add friends and start messaging

## Offerings
Websocket messaging server, db persistance of data, Layered architecture.
