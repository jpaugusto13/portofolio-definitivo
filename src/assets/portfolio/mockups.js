// ================================
// SCRIPT SOLO PARA GERAR MOCKUPS
// ================================

const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// ========= CONFIGURAÇÕES =========

// Caminho do mockup (fora da pasta)
const CAMINHO_MOCKUP = "C:/mockup/mockup.png";

// Caminho da logo (fora da pasta)
const CAMINHO_LOGO = "C:/mockup/logo.png";

// 🔥 TAMANHO DO BACKGROUND (pattern)
const TAMANHO_REPEAT = 120; // altere aqui

// ==================================

const pastaAtual = __dirname;
const pastaSaida = path.join(pastaAtual, "mockups");

if (!fs.existsSync(pastaSaida)) {
  fs.mkdirSync(pastaSaida);
}

const arquivos = fs
  .readdirSync(pastaAtual)
  .filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

async function gerarMockups() {
  const mockup = await loadImage(CAMINHO_MOCKUP);
  const logo = await loadImage(CAMINHO_LOGO);

  for (let arquivo of arquivos) {
    const arte = await loadImage(path.join(pastaAtual, arquivo));

    const canvas = createCanvas(mockup.width, mockup.height);
    const ctx = canvas.getContext("2d");

    // Criar pattern repeat
    const patternCanvas = createCanvas(TAMANHO_REPEAT, TAMANHO_REPEAT);
    const pctx = patternCanvas.getContext("2d");
    pctx.drawImage(arte, 0, 0, TAMANHO_REPEAT, TAMANHO_REPEAT);

    const pattern = ctx.createPattern(patternCanvas, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar mockup por cima
    ctx.drawImage(mockup, 0, 0);

    // Aplicar logo
    const logoWidth = 150;
    const logoHeight = (logo.height / logo.width) * logoWidth;

    ctx.drawImage(
      logo,
      canvas.width - logoWidth - 20,
      canvas.height - logoHeight - 20,
      logoWidth,
      logoHeight,
    );

    const buffer = canvas.toBuffer("image/jpeg");

    fs.writeFileSync(path.join(pastaSaida, `mockup_${arquivo}.jpg`), buffer);

    console.log(`✔ Gerado: ${arquivo}`);
  }

  console.log("\n🔥 Finalizado!");
}

gerarMockups();
