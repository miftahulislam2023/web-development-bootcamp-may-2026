import PlaceholderBox from "@/components/PlaceholderBox";
import NavigationRail from "@/app/rooms/components/NavigationRail";
import Settings from "./components/Settings";

const SettingsPage = () => {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#d1d7db] text-[#111b21] relative">
      <NavigationRail />
      <aside
        id="left-panel"
        className="absolute z-10 flex h-full w-full flex-col border-r border-[#e9edef] bg-white transition-transform duration-300 md:relative md:w-87.5 lg:w-100"
      >
        <Settings />
      </aside>
      <PlaceholderBox />
    </main>
  );
};

export default SettingsPage;
