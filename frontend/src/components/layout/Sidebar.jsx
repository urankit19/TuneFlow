import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Library,
  Plus
} from "lucide-react";

export default function Sidebar() {

  const linkClass = ({ isActive }) =>
    `flex gap-3 items-center transition ${
      isActive
        ? "text-white"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <aside className="w-64 shrink-0 bg-black p-5 rounded-lg hidden sm:block">

      <h1 className="text-2xl font-bold text-green-500 mb-10">
        TuneFlow
      </h1>

      <nav className="space-y-6">

        <NavLink to="/" className={linkClass}>
          <Home size={22} />
          Home
        </NavLink>

        <NavLink to="/search" className={linkClass}>
          <Search size={22} />
          Search
        </NavLink>

        <NavLink to="/library" className={linkClass}>
          <Library size={22} />
          Your Library
        </NavLink>

        <button className="flex gap-3 items-center text-gray-400 hover:text-white">
          <Plus size={22} />
          Create Playlist
        </button>

      </nav>

    </aside>
  );
}