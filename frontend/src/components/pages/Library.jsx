import { Music, Heart, ListMusic } from "lucide-react";

const items = [
  {
    title: "Liked Songs",
    description: "Your favourite tracks",
    icon: Heart
  },
  {
    title: "Your Playlists",
    description: "Your personal collections",
    icon: ListMusic
  },
  {
    title: "Recently Played",
    description: "Listen again",
    icon: Music
  }
];

export default function Library() {
  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">Your Library</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {items.map(item => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-[#282828] hover:bg-[#383838] rounded-lg p-6 cursor-pointer"
            >
              <Icon size={32} className="mb-5 text-green-500" />

              <h2 className="font-bold text-xl">
                {item.title}
              </h2>

              <p className="text-gray-400 mt-2">
                {item.description}
              </p>
            </div>
          );
        })}

      </div>

    </div>
  );
}