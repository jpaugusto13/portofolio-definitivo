import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder as FolderIcon,
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFolders(formatted);

    const all = Object.values(grouped).flat();
    const random = [...all].sort(() => 0.5 - Math.random()).slice(0, 8);
    setHighlights(random);
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartX.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 80) setSelectedFolder(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-12 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-14">
          <div className="flex items-center gap-4">
            <img src={logo} className="h-10" alt="Logo" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Portfólio de Estampas
              </h1>
              <p className="text-zinc-400 text-sm">
                Explore todas as coleções disponíveis
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <FolderIcon size={16} />
              {folders.length}
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon size={16} />
              {folders.reduce((a, f) => a + f.images.length, 0)}
            </div>
          </div>
        </div>

        {/* CAROUSEL */}
        {!selectedFolder && highlights.length > 0 && (
          <HighlightsCarousel
            items={highlights}
            onSelect={(src, name) => {
              setSelectedImage(src);
              setSelectedName(name);
            }}
          />
        )}

        {/* PASTAS */}
        <AnimatePresence mode="wait">
          {!selectedFolder ? (
            <motion.div
              key="folders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            >
              {folders.map((folder) => (
                <motion.button
                  key={folder.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFolder(folder.name)}
                  className="rounded-3xl p-6 bg-zinc-900 border border-zinc-700 hover:border-white transition text-left"
                >
                  <div className="flex justify-between">
                    <FolderIcon size={18} />
                    <span className="text-xs text-zinc-500">
                      {folder.images.length}
                    </span>
                  </div>
                  <div className="mt-6 font-bold uppercase text-sm">
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
                  ?.images.map((img) => (
                    <LazyImageCard
                      key={img.name}
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
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative w-full max-w-5xl"
            >
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={selectedName ?? "Imagem"}
                  className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                />

                {/* MOCKUP */}
                <div className="absolute bottom-2 right-2 w-72 h-72 rounded overflow-hidden border border-white/20 shadow-lg">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      backgroundRepeat: "repeat",
                      backgroundSize: "120px",
                    }}
                  />
                  <img
                    src={mockup}
                    alt="Mockup"
                    className="relative w-full h-full object-contain"
                  />
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-white text-black rounded-full p-2 shadow-lg active:scale-90 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* BARRA DO CÓDIGO */}
              <div className="mt-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400">
                    Código da Estampa
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {selectedName}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- CAROUSEL ---------- */

type HighlightsCarouselProps = {
  items: ImageItem[];
  onSelect: (src: string, name: string) => void;
};

function HighlightsCarousel({ items, onSelect }: HighlightsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const index = Math.round(container.scrollLeft / width);
    setActive(index);
  };

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Destaques</h2>

        <div className="flex gap-2">
          {items.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i ? "w-6 bg-white" : "w-2 bg-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {items.map((img, i) => (
          <div
            key={i}
            className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] snap-center px-3"
          >
            <HighlightCard
              resolver={img.resolver}
              name={img.name}
              onClick={onSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type HighlightCardProps = {
  resolver: ImageResolver;
  name: string;
  onClick: (src: string, name: string) => void;
};

function HighlightCard({ resolver, name, onClick }: HighlightCardProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    resolver().then((mod) => {
      if (mounted) setSrc(mod.default);
    });
    return () => {
      mounted = false;
    };
  }, [resolver]);

  if (!src)
    return <div className="h-64 bg-zinc-800 animate-pulse rounded-3xl" />;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={() => onClick(src, name)}
      className="relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl group"
    >
      <img
        src={src}
        alt={name}
        className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="absolute bottom-4 left-4">
        <p className="text-xs uppercase tracking-widest text-zinc-300">
          Código
        </p>
        <p className="text-lg font-bold">{name}</p>
      </div>
    </motion.div>
  );
}

type LazyImageCardProps = {
  resolver: ImageResolver;
  name: string;
  onClick: (src: string) => void;
};

function LazyImageCard({ resolver, name, onClick }: LazyImageCardProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    resolver().then((mod) => setSrc(mod.default));
  }, [resolver]);

  if (!src)
    return <div className="h-52 bg-zinc-800 animate-pulse rounded-2xl" />;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(src)}
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      <img
        src={src}
        alt={name}
        className="h-52 w-full object-cover transition-transform duration-500 hover:scale-110"
      />
    </motion.button>
  );
}
