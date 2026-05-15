export async function GET() {
  return Response.json({
    ok: true,
    service: "chat-app",
    timestamp: new Date().toISOString(),
  });
}
