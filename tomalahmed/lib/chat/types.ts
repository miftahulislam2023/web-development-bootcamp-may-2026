export type ChatMessageRow = {
  id: string;
  room_id: string;
  content: string;
  display_name: string;
  created_at: string;
};

export type ChatRoomRow = {
  id: string;
  slug: string | null;
  title: string;
  created_at: string;
};
