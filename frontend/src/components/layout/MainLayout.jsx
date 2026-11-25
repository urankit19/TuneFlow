import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MusicPlayer from "../player/MusicPlayer";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Sidebar />

      <main className="ml-64 pb-28">
        <Navbar />
        <Outlet />
      </main>

      <MusicPlayer />
    </div>
  );
}

export default MainLayout;