import os
from PIL import Image
import fitz
from concurrent.futures import ProcessPoolExecutor
import multiprocessing

EXTENSOES = (".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp", ".gif", ".pdf")


# ==========================
# CONVERTER IMAGEM
# ==========================

def converter_imagem(caminho):
    try:
        novo = os.path.splitext(caminho)[0] + ".jpg"
        temp = novo + ".temp.jpg"

        with Image.open(caminho) as img:

            # Corrige transparência
            if img.mode in ("RGBA", "LA", "P"):
                fundo = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode != "P":
                    fundo.paste(img, mask=img.split()[-1])
                else:
                    fundo.paste(img)
                img = fundo
            else:
                img = img.convert("RGB")

            img.save(
                temp,
                "JPEG",
                quality=100,
                subsampling=0,
                optimize=True
            )

        # Substituição segura
        if os.path.exists(novo):
            os.remove(novo)

        os.rename(temp, novo)

        # Remove original se não for JPG
        if not caminho.lower().endswith((".jpg", ".jpeg")):
            os.remove(caminho)

        print("✔", caminho)

    except Exception as e:
        print("Erro:", caminho, e)


# ==========================
# CONVERTER PDF
# ==========================

def converter_pdf(caminho):
    try:
        doc = fitz.open(caminho)
        page = doc.load_page(0)

        pix = page.get_pixmap(dpi=300, alpha=False)

        novo = os.path.splitext(caminho)[0] + ".jpg"
        temp = novo + ".temp.jpg"

        pix.save(temp)
        doc.close()

        if os.path.exists(novo):
            os.remove(novo)

        os.rename(temp, novo)
        os.remove(caminho)

        print("✔", caminho)

    except Exception as e:
        print("Erro:", caminho, e)


# ==========================
# PROCESSAR ARQUIVO
# ==========================

def processar(caminho):
    ext = os.path.splitext(caminho)[1].lower()

    if ext == ".pdf":
        converter_pdf(caminho)
    else:
        converter_imagem(caminho)


# ==========================
# LISTAR ARQUIVOS
# ==========================

def listar_arquivos(pasta):
    lista = []
    for root, dirs, files in os.walk(pasta):
        for file in files:
            if file.lower().endswith(EXTENSOES):
                lista.append(os.path.join(root, file))
    return lista


# ==========================
# EXECUÇÃO PRINCIPAL
# ==========================

if __name__ == "__main__":
    print("🔎 Lendo arquivos...")
    pasta = os.getcwd()

    arquivos = listar_arquivos(pasta)

    print(f"📦 {len(arquivos)} arquivos encontrados")
    print("🚀 Convertendo usando todos os núcleos do PC...\n")

    with ProcessPoolExecutor(max_workers=multiprocessing.cpu_count()) as executor:
        executor.map(processar, arquivos)

    print("\n✅ Finalizado!")
    input("Pressione Enter para fechar...")