package config

import (
	"fmt"
	"os"
	"strconv"
	"sync"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	Protocol      string
	Username      string
	Password      string
	Host          string
	Port          int
	DBName        string
	EnableSSLMode bool
}

type Config struct {
	HttpPort       int
	FrontendDomain string
	DB             *DBConfig
}

var (
	config     *Config
	configOnce sync.Once
)

func loadConfig() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found, using system environment variables")
	}

	httpPortStr := envOrExit("HTTP_PORT")
	port, err := strconv.Atoi(httpPortStr)
	if err != nil {
		fmt.Println("HTTP_PORT must be a valid integer:", err)
		os.Exit(1)
	}

	if port < 1 || port > 65535 {
		fmt.Println("HTTP_PORT must be between 1 and 65535")
		os.Exit(1)
	}

	dbPortStr := envOrExit("DB_PORT")
	dbPort, err := strconv.Atoi(dbPortStr)
	if err != nil {
		fmt.Println("DB_PORT must be a valid integer:", err)
		os.Exit(1)
	}

	if dbPort < 1 || dbPort > 65535 {
		fmt.Println("DB_PORT must be between 1 and 65535")
		os.Exit(1)
	}
	dbSSLMode := envOrExit("DB_SSL_MODE")
	enableSSLMode, err := strconv.ParseBool(dbSSLMode)
	if err != nil {
		fmt.Println("Invalid enable ssl mode value", err)
		os.Exit(1)
	}

	dbConfig := &DBConfig{
		Protocol:      envOrExit("DB_PROTOCOL"),
		Username:      envOrExit("DB_USERNAME"),
		Password:      envOrExit("DB_PASSWORD"),
		Host:          envOrExit("DB_HOST"),
		Port:          dbPort,
		DBName:        envOrExit("DB_NAME"),
		EnableSSLMode: enableSSLMode,
	}

	config = &Config{
		HttpPort:       port,
		FrontendDomain: envOrExit("FRONTEND_DOMAIN"),
		DB:             dbConfig,
	}
}

func envOrExit(envKey string) string {
	envVar := os.Getenv(envKey)
	if envVar == "" {
		fmt.Println(envKey, "environment varaible is required")
		os.Exit(1)
	}

	return envVar
}

func GetConfig() *Config {
	configOnce.Do(loadConfig)
	return config
}
