package middlewares

import (
	"bufio"
	"fmt"
	"net"
	"net/http"
	"time"
)

type responseWriter struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
}

func (rw *responseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	hijacker, ok := rw.ResponseWriter.(http.Hijacker)
	if !ok {
		return nil, nil, fmt.Errorf("underlying ResponseWriter does not support hijacking")
	}
	return hijacker.Hijack()
}

func (rw *responseWriter) WriteHeader(code int) {
	if rw.wroteHeader {
		return
	}
	rw.status = code
	rw.wroteHeader = true
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	if !rw.wroteHeader {
		rw.status = http.StatusOK
		rw.wroteHeader = true
	}
	return rw.ResponseWriter.Write(b)
}

func Logger(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		wrapped := &responseWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(wrapped, r)

		duration := time.Since(start)

		statusIcon := "✅"
		if wrapped.status >= 400 {
			statusIcon = "❌"
		}

		fmt.Printf(
			"[%s] %s %d | %13v | %s %s\n",
			start.Format("15:04:05"),
			statusIcon,
			wrapped.status,
			duration,
			r.Method,
			r.URL.Path,
		)
	})
}
