const time = document.querySelectorAll(".time");
const victoryPage = document.querySelector(".victory");
const container = document.querySelector(".container");
const game = document.querySelector(".game");
const solution = document.querySelector(".solution");
const maps = document.querySelector(".maps");
const redirect = document.querySelector(".redirect");
const navBar = document.querySelector(".nav-bar");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
const numberImages = 11;
const pixel = 22;
let timeElapsed = 0;
let canvasHeight = 0;
var image = "";

let player = {
  x: 1,
  y: 1,
};

let colors = {
  wall: "rgb(24, 24, 24)",
  player: "#05C7F2",
  exit: "#049DD9",
};

// Adicionar os Labirintos(Imagens) no HTML
for (var i = 0; i <= numberImages; i++) {
  const img = document.createElement("img");
  img.src = `./Game-Images/Maps/map-${i}.png`;
  img.classList.add("map");

  maps.appendChild(img);
}

// Desenha a imagem de fundo, jogador e saída no canvas
function draw() {
  ctx.drawImage(image, 0, 0, image.width, image.height);
  ctx.fillStyle = colors.player;
  ctx.fillRect(player.x * pixel, player.y * pixel, pixel, pixel);
  ctx.fillStyle = colors.exit;
  ctx.fillRect(image.width - pixel * 2, image.height - pixel * 2, pixel, pixel);
}

// Carregar a imagem e renderizar o jogo
function init() {
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    draw();
  };
  image.src = image.src; // Forçar o carregamento da imagem, se necessário
}

// Função do Temporizador do Jogo
function timer() {
  setInterval(() => {
    timeElapsed += 1;
    time[1].innerText = `Tempo: ${timeElapsed}s`;
  }, 1000);
}

// Fução a execultar se o jogador vencer
function victory() {
  victoryPage.style.display = "flex";
  navBar.style.display = "none";
  time[0].innerText = `Tempo de Jogo: ${timeElapsed}s`;

  // Contador para redirecionar Usuário
  let timer = 10;
  setInterval(() => {
    redirect.innerText = `Aguarde, você será redirecionado para a home em ${timer} segundos.`;
    timer--;
  }, 1000);

  // Redireciona o Usuário para a Home
  setTimeout(() => {
    window.location.href = "";
  }, 10000);
}

// Obtem os dados do pixel na posição (x, y)
function colorPixel(x, y) {
  let pixelData = ctx.getImageData(x, y, 1, 1).data;

  // Converte os dados do pixel para formato RGB
  var color =
    "rgb(" + pixelData[0] + ", " + pixelData[1] + ", " + pixelData[2] + ")";
  return color;
}

// Função que verifica Colisões e renderiza o Jogador
function renderPlayer(position) {
  function isColorAtPosition(x, y, color) {
    console.log(colorPixel(x * pixel, y * pixel));
    return colorPixel(x * pixel, y * pixel) !== color;
  }

  // Definindo um objeto que mapeia as direções de movimento aos deslocamentos corespondentes
  const directionOffsets = {
    Right: { dx: 1, dy: 0 },
    Left: { dx: -1, dy: 0 },
    Up: { dx: 0, dy: -1 },
    Down: { dx: 0, dy: 1 },
  };
  const offset = directionOffsets[position];

  // Verifica se o deslocamento para a direção atual é válido, e verifica a colisão com a Parede (wall)
  if (
    offset &&
    isColorAtPosition(
      player.x + 0.5 + offset.dx,
      player.y + 0.5 + offset.dy,
      colors.wall
    )
  ) {
    player.x += offset.dx;
    player.y += offset.dy;
  }

  if (
    player.x * pixel == image.width - pixel * 2 &&
    player.y * pixel == image.height - pixel * 2
  ) {
    victory();
  }

  draw();
}

// Capturar Click do Jogador
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      renderPlayer("Right");
      break;
    case "ArrowLeft":
      renderPlayer("Left");
      break;
    case "ArrowUp":
      renderPlayer("Up");
      break;
    case "ArrowDown":
      renderPlayer("Down");
      break;
    default:
      break;
  }
});

// Iniciar o jogo com o Labirinto(Imagem) selecionado
const images = document.querySelectorAll(".map");
images.forEach((img) => {
  img.addEventListener("click", (event) => {
    container.style.display = "none";
    game.style.display = "flex";
    navBar.style.display = "flex";

    let indice;
    for (let i = 0; i < images.length; i++) {
      if (img === images[i]) {
        indice = i;
        break;
      }
    }

    // Link para a solução do Labirinto no GitHub
    solution.href = `https://github.com/CarlosEduts/Labirinto-Jogo/blob/main/Game-Images/Solved-Maps/map-${indice}.png`;
    image = images[indice];
    init();
    timer();
  });
});
