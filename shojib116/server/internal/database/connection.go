package database

import (
	"fmt"

	"github.com/shojib116/chat-app-server/config"
)

func GetConnectionString(db *config.DBConfig) string {
	connString := fmt.Sprintf("%v://%v:%s@%v:%v/%v", db.Protocol, db.Username, db.Password, db.Host, db.Port, db.DBName)

	if !db.EnableSSLMode {
		connString += "?sslmode=disable"
	}

	return connString
}
