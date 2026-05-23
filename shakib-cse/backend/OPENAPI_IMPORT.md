OpenAPI & Bruno instructions

This project includes an OpenAPI spec at `backend/openapi.yaml` that you can import into Bruno, Postman or Insomnia.

Quick steps:

1. Start the backend locally (default server URL used in the spec: `http://localhost:3030/api/v1`).

```bash
# from backend/
bun install
# set DATABASE_URL in .env, then:
bun run setup
bun run dev
```

2. Import `backend/openapi.yaml` into Bruno or your API tool:

- Bruno UI: Use "Import" and choose the OpenAPI file.
- Bruno CLI: check Bruno docs for OpenAPI import command; most tools accept OpenAPI.

3. Run the sample requests against the running server.

If you want a Postman collection or a set of example requests, tell me and I will generate them.
