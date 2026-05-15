package middlewares

import (
	"net/http"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

type Manager struct {
	global []Middleware
}

func NewManager(globals ...Middleware) *Manager {
	return &Manager{
		global: globals,
	}
}

// Wrap applies the global middlewares to the root handler (the Mux)
func (m *Manager) WrapMux(root http.Handler) http.Handler {
	return m.chain(func(w http.ResponseWriter, r *http.Request) {
		root.ServeHTTP(w, r)
	}, m.global...)
}

// With allows adding route-specific middlewares
func (m *Manager) With(handler http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
	return m.chain(handler, middlewares...)
}

// chain helper ensures the first middleware added is the FIRST one executed (outermost)
func (m *Manager) chain(next http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
	for i := len(middlewares) - 1; i >= 0; i-- {
		next = middlewares[i](next)
	}
	return next
}
