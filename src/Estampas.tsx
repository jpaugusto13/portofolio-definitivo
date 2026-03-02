import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import {
  Folder,
  Sparkles,
  ArrowLeft,
  X,
  Image as ImageIcon,
} from "lucide-react";
import logo from "/src/assets/logo.png";
import mockup from "/src/assets/mockup.png";

type ImageModule = { default: string };
type ImageResolver = () => Promise<ImageModule>;

type ImageItem = {
  resolver: ImageResolver;
  name: string;
};

type FolderType = {
  name: string;
  images: ImageItem[];
};

export default function Portfolio() {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<ImageItem[]>([]);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const modules = import.meta.glob<ImageModule>(
      "/src/assets/portfolio/**/*.jpg",
    );

    const grouped: Record<string, ImageItem[]> = {};

    Object.entries(modules).forEach(([path, resolver]) => {
      const parts = path.split("/");
      const folder = parts[parts.length - 2];
      const fileName = parts[parts.length - 1].replace(".jpg", "");

      if (!grouped[folder]) grouped[folder] = [];

      grouped[folder].push({
        resolver: resolver as ImageResolver,
        name: fileName,
      });
    });

    const formatted: FolderType[] = Object.keys(grouped).map((folder) => ({
      name: folder,
      images: grouped[folder],
    }));

    setFolders(formatted);

    const all = Object.values(grouped).flat();
    const random = [...all].sort(() => 0.5 - Math.random()).slice(0, 10);
    setHighlights(random);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 80) setSelectedFolder(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-12 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-14">
          <div className="flex items-center gap-4">
            <img src={logo} className="h-10" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Portfólio de Estampas
              </h1>
              <p className="text-zinc-400 text-sm">
                Navegue, visualize e aplique no mockup
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Folder size={16} />
              {folders.length}
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon size={16} />
              {folders.reduce((a, f) => a + f.images.length, 0)}
            </div>
          </div>
        </div>

        {/* PASTAS COM TRANSIÇÃO */}
        <AnimatePresence mode="wait">
          {!selectedFolder ? (
            <motion.div
              key="folders"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            >
              {folders.map((folder, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFolder(folder.name)}
                  className="group rounded-3xl p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 hover:border-white transition shadow-xl text-left"
                >
                  <div className="flex justify-between items-start">
                    <Folder size={20} />
                    <span className="text-xs text-zinc-500">
                      {folder.images.length}
                    </span>
                  </div>
                  <div className="mt-6 font-bold uppercase text-sm tracking-wider">
                    {folder.name}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={() => setSelectedFolder(null)}
                className="flex items-center gap-2 mb-8 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg active:scale-95 transition"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {folders
                  .find((f) => f.name === selectedFolder)
                  ?.images.map((img, i) => (
                    <LazyImageCard
                      key={i}
                      resolver={img.resolver}
                      name={img.name}
                      onClick={(src) => {
                        setSelectedImage(src);
                        setSelectedName(img.name);
                      }}
                    />
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <img
                src={selectedImage}
                className="max-h-[85vh] max-w-[95vw] rounded-3xl shadow-2xl"
              />

              {/* MOCKUP */}
              <div className="absolute bottom-4 right-4 w-64 h-64 rounded-xl overflow-hidden shadow-lg border border-white/20">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${selectedImage})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "290px",
                  }}
                />
                <img
                  src={mockup}
                  className="relative w-full h-full object-contain"
                />
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white text-black rounded-full p-2 shadow-lg active:scale-90 transition"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LazyImageCard({ resolver, name, onClick }: any) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    resolver().then((mod: any) => setSrc(mod.default));
  }, [resolver]);

  if (!src) {
    return <div className="h-52 bg-zinc-800 animate-pulse rounded-2xl" />;
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(src)}
      className="relative rounded-2xl overflow-hidden shadow-lg"
    >
      <img
        src={src}
        className="h-52 w-full object-cover transition-transform duration-500 hover:scale-110"
      />
    </motion.button>
  );
}
