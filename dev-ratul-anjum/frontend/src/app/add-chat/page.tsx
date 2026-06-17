import NavigationRail from "@/app/rooms/components/NavigationRail";
import NewChatForm from "./components/NewChatForm";
import PlaceholderBox from "@/components/PlaceholderBox";

export const metadata = {
  title: "Dialog | Add Conversation",
  description:
    "Start a new conversation in Dialog chat application. Use the form to send messages and connect instantly with members in real-time.",
  keywords: [
    "dialog chat application",
    "Ratul Anjum",
    "conversation",
    "real-time chat",
    "messaging form",
    "private messaging",
  ],
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/add-chat`,
    title: "Dialog | Add Conversation",
    description:
      "Start a new conversation in Dialog chat application. Use the form to send messages and connect instantly with members in real-time.",
    siteName: "Dialog",
  },
  twitter: {
    card: "summary",
    title: "Dialog | Add Conversation",
    description:
      "Start a new conversation in Dialog chat application. Use the form to send messages and connect instantly with members in real-time.",
    site: "@ratulanjum",
  },
};

const AddChat = () => {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#d1d7db] text-[#111b21] relative">
      <NavigationRail />
      <aside
        id="left-panel"
        className="absolute z-10 flex h-full w-full flex-col border-r border-[#e9edef] bg-white transition-transform duration-300 md:relative md:w-87.5 lg:w-100"
      >
        <NewChatForm />
      </aside>
      <PlaceholderBox />
    </main>
  );
};

export default AddChat;
