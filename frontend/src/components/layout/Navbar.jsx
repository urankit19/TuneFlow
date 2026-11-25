export default function Navbar() {
  return (
    <header className="flex justify-between items-center p-5">
      <div className="flex gap-3">
        <button className="bg-black px-4 py-2 rounded-full">
          ←
        </button>
        <button className="bg-black px-4 py-2 rounded-full">
          →
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <button className="bg-white text-black px-5 py-2 rounded-full font-bold">
          Explore Premium
        </button>

        <button className="bg-gray-800 rounded-full w-10 h-10">
          A
        </button>
      </div>
    </header>
  );
}