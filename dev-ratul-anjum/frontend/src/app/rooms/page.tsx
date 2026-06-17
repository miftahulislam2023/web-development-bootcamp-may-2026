import PlaceholderBox from "@/components/PlaceholderBox";

export const metadata = {
  title: "Dialog | Explore Chat Rooms",
  description:
    "Discover public rooms or communities that match your interests. Join and chat in real-time with Dialog.",
  keywords: [
    "dialog chat application",
    "Ratul Anjum",
    "chat rooms",
    "community chat",
    "online chat",
    "group messaging",
  ],
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/rooms`,
    title: "Dialog Chat Application | Explore Rooms",
    description:
      "Discover public rooms and communities on Dialog chat application. Join conversations, meet new people, and chat in real-time effortlessly.",
    siteName: "Dialog",
  },
  twitter: {
    card: "summary",
    title: "Dialog Chat Application | Explore Rooms",
    description:
      "Discover public rooms and communities on Dialog chat application. Join conversations, meet new people, and chat in real-time effortlessly.",
    site: "@yourtwitterhandle",
  },
};

const RoomsPage = () => {
  return <PlaceholderBox />;
};

export default RoomsPage;
