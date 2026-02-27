const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite suas iniciais (ex: WP): ", (iniciais) => {
  iniciais = iniciais.toUpperCase();

  const pasta = process.cwd();

  const extensoesValidas = [
    ".png",
    ".jpg",
    ".jpeg",
    ".pdf",
    ".tiff",
    ".bmp",
    ".jfif",
    ".tif",
  ];

  let arquivos = fs
    .readdirSync(pasta)
    .filter((file) =>
      extensoesValidas.includes(path.extname(file).toLowerCase()),
    )
    .sort();

  if (arquivos.length === 0) {
    console.log("Nenhuma estampa encontrada.");
    rl.close();
    return;
  }

  console.log(`\nForam encontrados ${arquivos.length} arquivos.`);

  rl.question("Deseja continuar? (S/N): ", (confirmar) => {
    if (confirmar.toUpperCase() !== "S") {
      console.log("Operação cancelada.");
      rl.close();
      return;
    }

    arquivos.forEach((arquivo, index) => {
      const extensao = path.extname(arquivo);
      const numero = String(index + 1).padStart(3, "0");
      const novoNome = `${iniciais}${numero}${extensao}`;

      fs.renameSync(path.join(pasta, arquivo), path.join(pasta, novoNome));

      console.log(`Renomeado: ${arquivo} -> ${novoNome}`);
    });

    console.log("\n✅ Finalizado com sucesso!");
    rl.close();
  });
});
