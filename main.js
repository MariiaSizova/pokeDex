const btnClick = document.querySelectorAll(".btn_generation_search");
const searchBar = document.querySelector("#search");
const buttonFilter = document.querySelectorAll(".btn_type_search");
const backButton = document.querySelector("#backToTop");

let generation = [0, 151];
let pokeData;
let searchNameResult = "";
let searchNamePicture = "";

const pokeGeneration = [
  [0, 151],
  [152, 251],
  [252, 386],
  [387, 493],
  [494, 649],
  [650, 721],
  [722, 809],
  [810, 905],
  [906, 1015],
];

const pokemonType = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#e0306a",
  fire: "#f0932b",
  flying: "#8lecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afco",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
};

const searchPoke = () => {
  fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${generation[1]}&offset=${generation[0]}`
  )
    .then((responce) => responce.json())
    .then((json) => {
      const fetches = json.results.map((item) => {
        return fetch(item.url).then((res) => res.json());
      });
      Promise.all(fetches).then((data) => {
        pokeData = data;
        creatingCards(data);
      });
    });
  return pokeData;
};

const imageNull = (searchNamePicture) => {
  if (searchNamePicture == undefined || searchNamePicture == null) {
    searchNamePicture = `images/notFound.png`;
  }
  return searchNamePicture;
};

const creatingCards = (arrayPoke) => {
  document.querySelector(".pokeCards").innerHTML = arrayPoke
    .map((item) => {
      const color = pokemonType[item.types[0].type.name];
      const style = `background:radial-gradient(circle at 50% 0%, ${color} 40%, #fff 36%);`;
      searchNamePicture = item.sprites.other.dream_world.front_default;
      searchNameResult = item.name;
      searchPokeId = ("000" + item.id).slice(-4);
      searchNamePicture = imageNull(searchNamePicture);
      typeElement = addingTypePoke(item);
      return `
      <div class="pokeCard" style="${style}">
        <div class='idPoke'>
          <p>#${searchPokeId}</p>
        </div>
        <div class="pokeIMG">
          <img class="pokeIMG" src='${searchNamePicture}'</img>
        </div> 
        <p class="pokeName">${searchNameResult}</p>
        <div class='typeIcons'>${typeElement}</div>
      </div>
    `;
    })
    .join("");
};

const searchPokeByName = () => {
  let searchName = searchBar.value.toLowerCase();
  if (searchBar.value === "") {
    location.reload();
  } else {
    let flag = 0;
    let arrayPoke = [];
    pokeData.filter((obj) => {
      if (obj.name.startsWith(searchName)) {
        arrayPoke.push(obj);
        flag = 1;
        creatingCards(arrayPoke);
      }
    });
    if (flag === 0) {
      document.querySelector(
        ".pokeCards"
      ).innerHTML = `<h2 class="searchError">No such Pokemon in our DataBase. Try again!</h2>`;
    }
  }
};

const searchByType = (indexFilter) => {
  let chosenFilter = Object.keys(pokemonType)[indexFilter];
  let arrayPoke = [];
  let flag = 0;
  searchBar.value = "";

  pokeData.filter((obj) => {
    if (obj.types.length == 2) {
      if (
        obj.types[0].type.name === chosenFilter ||
        obj.types[1].type.name === chosenFilter
      ) {
        flag = 1;
        arrayPoke.push(obj);
        creatingCards(arrayPoke);
      }
    } else {
      if (obj.types[0].type.name === chosenFilter) {
        flag = 1;
        arrayPoke.push(obj);
        creatingCards(arrayPoke);
      }
    }
    if (flag === 0) {
      document.querySelector(
        ".pokeCards"
      ).innerHTML = `<h2 class="searchError">No such Pokemon in our DataBase. Try again!</h2>`;
    }
  });
};

const clickButton = (i) => {
  for (let i = 0; i < pokeGeneration.length; i++) {
    btnClick[i].classList.remove("chosenButton");
  }
  btnClick[i].classList.add("chosenButton");
  generation = pokeGeneration[i];
  searchPoke();
};

const addingTypePoke = (item) => {
  let typeInfo = "";
  let typeElement = "";
  for (let i = 0; i < item.types.length; i++) {
    typeInfo += item.types[i].type.name;
    typeInfo += " ";
  }
  let arrayType = typeInfo.trim().split(" ");
  for (let i = 0; i < arrayType.length; i++) {
    typeElement += `<img src='images/pokemon-types/${arrayType[i]}.ico'></img>`;
  }
  return typeElement;
};

window.onscroll = function () {
  scrollFunction();
};

const scrollFunction = () => {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    backButton.style.display = "flex";
  } else {
    backButton.style.display = "none";
  }
};

const getToTop = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

searchPoke();

btnClick.forEach((button, i) =>
  button.addEventListener("click", () => setTimeout(clickButton(i), 3000))
);
searchBar.addEventListener("keyup", searchPokeByName);
buttonFilter.forEach((button, i) =>
  button.addEventListener("click", () => searchByType(i))
);
backButton.addEventListener("click", getToTop);
