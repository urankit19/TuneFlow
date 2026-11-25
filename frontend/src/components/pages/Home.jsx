
import { Link } from "react-router-dom";
import { Music2, Search, Library } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8 text-white">
      <section className="rounded-2xl bg-gradient-to-r from-green-800 to-gray-900 p-8">
        <h1 className="text-4xl font-bold">
          Welcome to TuneFlow
        </h1>

        <p className="mt-3 text-gray-300">
          Discover music and enjoy your favourite tracks.
        </p>

        <Link
          to="/search"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-black"
        >
          <Search size={18} />
          Explore Music
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/search" className="rounded-xl bg-[#202020] p-6">
          <Music2 className="mb-3 text-green-400" />
          <h2 className="font-bold">Search Music</h2>
          <p className="text-sm text-gray-400">Find your favourite tracks.</p>
        </Link>

        <Link to="/library" className="rounded-xl bg-[#202020] p-6">
          <Library className="mb-3 text-green-400" />
          <h2 className="font-bold">Your Library</h2>
          <p className="text-sm text-gray-400">Manage your collection.</p>
        </Link>
      </div>
    </div>
  );
}
