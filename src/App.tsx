import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import logo from "/src/assets/logo.png";

type ImageModule = {
  default: string;
};

type ImageResolver = () => Promise<ImageModule>;

type ImageItem = {
  resolver: ImageResolver;
  name: string;
};

type Folder = {
  name: string;
  images: ImageItem[];
};

export default function WiiprintPortfolio() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<ImageItem[]>([]);

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

    const formatted: Folder[] = Object.keys(grouped).map((folder) => ({
      name: folder,
      images: grouped[folder],
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFolders(formatted);

    const all = Object.values(grouped).flat();
    const random = [...all].sort(() => 0.5 - Math.random()).slice(0, 10);

    setHighlights(random);
  }, []);

  return (
    <div className="min-h-screen text-white bg-linear-to-br from-black via-[#111111] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <img src={logo} className="h-10 md:h-12" alt="Logo" />
        </div>

        {!selectedFolder && highlights.length > 0 && (
          <div className="mb-10">
            <AliceCarousel
              mouseTracking
              autoPlay
              infinite
              autoPlayInterval={2000}
              animationDuration={700}
              disableButtonsControls
              disableDotsControls
              responsive={{
                0: { items: 1 },
                640: { items: 2 },
                1024: { items: 3 },
              }}
              items={highlights.map((img, i) => (
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
            />
          </div>
        )}

        {!selectedFolder && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {folders.map((folder, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                onClick={() => setSelectedFolder(folder.name)}
                className="cursor-pointer bg-[#141414] hover:bg-[#1f1f1f] rounded-2xl p-6 shadow-lg border border-zinc-800 transition"
              >
                <div className="h-24 flex items-center justify-center text-center font-semibold tracking-wide">
                  {folder.name}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedFolder && (
          <FolderGallery
            folder={folders.find((f) => f.name === selectedFolder)}
            onBack={() => setSelectedFolder(null)}
            onSelect={(src, name) => {
              setSelectedImage(src);
              setSelectedName(name);
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="max-h-[80vh] max-w-[95vw] rounded-3xl shadow-2xl"
              alt={selectedName ?? "Imagem"}
            />

            <div className="mt-6 text-center">
              <p className="text-zinc-400 text-sm uppercase tracking-widest">
                Código da Estampa
              </p>
              <p className="text-xl font-semibold mt-1">{selectedName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FolderGalleryProps = {
  folder?: Folder;
  onBack: () => void;
  onSelect: (src: string, name: string) => void;
};

function FolderGallery({ folder, onBack, onSelect }: FolderGalleryProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-sm text-zinc-400 hover:text-white transition"
      >
        ← Voltar
      </button>

      <h2 className="text-xl md:text-3xl mb-6 font-semibold">{folder?.name}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {folder?.images.map((img, index) => (
          <LazyImageCard
            key={index}
            resolver={img.resolver}
            name={img.name}
            onClick={(src) => onSelect(src, img.name)}
          />
        ))}
      </div>
    </div>
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
    let mounted = true;

    resolver().then((mod) => {
      if (mounted) setSrc(mod.default);
    });

    return () => {
      mounted = false;
    };
  }, [resolver]);

  if (!src) {
    return <div className="h-44 bg-[#1a1a1a] animate-pulse rounded-2xl" />;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-[#141414] rounded-2xl overflow-hidden shadow-lg border border-zinc-800 hover:border-zinc-600 transition cursor-pointer"
      onClick={() => onClick(src)}
    >
      <img
        src={src}
        loading="lazy"
        className="object-cover h-44 sm:h-52 w-full"
        alt={name}
      />
      <div className="p-3 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          Código
        </p>
        <p className="text-sm font-semibold truncate">{name}</p>
      </div>
    </motion.div>
  );
}
