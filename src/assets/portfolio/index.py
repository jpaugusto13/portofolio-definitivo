import os
from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # remove limite de segurança

max_size = 1600

for filename in os.listdir():
    if filename.lower().endswith(".jpg"):
        with Image.open(filename) as img:
            img.thumbnail((max_size, max_size), Image.LANCZOS)
            img.save(filename, quality=80, optimize=True)

        print(f"Reduzido: {filename}")

print("Finalizado.")