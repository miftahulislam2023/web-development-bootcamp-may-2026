import { ChatRoomPage } from "@/components/features/chat/pages/chat-room-page";

type PageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function ChatRoomRoutePage({ params }: PageProps) {
  const { roomId } = await params;
  return <ChatRoomPage roomId={roomId} />;
}
