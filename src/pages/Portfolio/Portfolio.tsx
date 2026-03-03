import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Folder, ArrowLeft, X, Image as ImageIcon } from "lucide-react";
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
    const random = [...all].sort(() => 0.5 - Math.random()).slice(0, 10);
    setHighlights(random);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-150 h-150 bg-purple-600/20 blur-[180px] rounded-full -top-30 -left-40" />
      <div className="absolute w-150 h-150 bg-cyan-500/20 blur-[180px] rounded-full bottom-0 right-0" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* HERO */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-20">
          <div>
            <img src={logo} className="h-10 mb-6" />
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Portfólio <span className="text-cyan-400">Criativo</span>
            </h1>
            <p className="text-zinc-400 mt-4 max-w-md">
              Estampas modernas com identidade forte e visual marcante.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-zinc-400 mt-8 md:mt-0">
            <div className="flex items-center gap-2">
              <Folder size={16} />
              {folders.length} Coleções
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon size={16} />
              {folders.reduce((a, f) => a + f.images.length, 0)} Artes
            </div>
          </div>
        </div>

        {/* CAROUSEL */}
        {!selectedFolder && highlights.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Destaques</h2>

            <AliceCarousel
              mouseTracking
              infinite
              disableDotsControls
              responsive={{
                0: { items: 1 },
                768: { items: 2 },
                1024: { items: 3 },
              }}
              items={highlights.map((img, i) => (
                <HighlightCard
                  key={i}
                  resolver={img.resolver}
                  name={img.name}
                  onClick={(src, name) => {
                    setSelectedImage(src);
                    setSelectedName(name);
                  }}
                />
              ))}
            />
          </div>
        )}

        {/* FOLDERS */}
        {!selectedFolder ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className="group p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-400 transition"
              >
                <Folder className="mb-6 text-cyan-400" />
                <h3 className="font-bold text-lg">{folder.name}</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  {folder.images.length} artes
                </p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={() => setSelectedFolder(null)}
              className="mb-12 flex items-center gap-2 bg-cyan-500 text-black px-6 py-3 rounded-full font-semibold"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6">
          <div className="relative max-w-6xl w-full">
            <div className="relative">
              <img
                src={selectedImage}
                className="w-full max-h-[85vh] object-contain rounded-3xl"
              />

              <div className="absolute bottom-0 right-4 w-72 h-72 border border-white/10 rounded-xl overflow-hidden">
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
                  className="relative w-full h-full object-contain"
                />
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
              <p className="text-sm text-zinc-400">Código da Estampa</p>
              <h2 className="text-2xl font-bold">{selectedName}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HighlightCard({
  resolver,
  name,
  onClick,
}: {
  resolver: ImageResolver;
  name: string;
  onClick: (src: string, name: string) => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    resolver().then((mod) => setSrc(mod.default));
  }, [resolver]);

  if (!src)
    return <div className="h-72 bg-white/5 rounded-3xl animate-pulse" />;

  return (
    <div
      onClick={() => onClick(src, name)}
      className="cursor-pointer rounded-3xl overflow-hidden relative group"
    >
      <img
        src={src}
        className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <p className="text-sm text-zinc-300">Código</p>
        <p className="text-xl font-bold">{name}</p>
      </div>
    </div>
  );
}

function LazyImageCard({
  resolver,
  onClick,
}: {
  resolver: ImageResolver;
  name: string;
  onClick: (src: string) => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    resolver().then((mod) => setSrc(mod.default));
  }, [resolver]);

  if (!src)
    return <div className="h-52 bg-white/5 rounded-2xl animate-pulse" />;

  return (
    <button
      onClick={() => onClick(src)}
      className="rounded-2xl overflow-hidden group"
    >
      <img
        src={src}
        className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
      />
    </button>
  );
}
