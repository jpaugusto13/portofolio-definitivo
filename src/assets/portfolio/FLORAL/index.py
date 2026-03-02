import os
from PIL import Image

TAMANHO_MAXIMO_MB = 1
TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024

# Pasta atual (onde o script está)
PASTA_ATUAL = os.path.dirname(os.path.abspath(__file__))

def comprimir_imagem(caminho):
    try:
        with Image.open(caminho) as img:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            qualidade = 95

            # salva temporariamente para testar tamanho
            img.save(caminho, format="JPEG", quality=qualidade, optimize=True)

            while os.path.getsize(caminho) > TAMANHO_MAXIMO_BYTES and qualidade > 10:
                qualidade -= 5
                img.save(caminho, format="JPEG", quality=qualidade, optimize=True)

            tamanho_final = os.path.getsize(caminho) / (1024 * 1024)
            print(f"{os.path.basename(caminho)} -> {tamanho_final:.2f} MB")

    except Exception as e:
        print(f"Erro em {caminho}: {e}")

def processar_pasta():
    for arquivo in os.listdir(PASTA_ATUAL):
        if arquivo.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            caminho_completo = os.path.join(PASTA_ATUAL, arquivo)
            comprimir_imagem(caminho_completo)

if __name__ == "__main__":
    processar_pasta()