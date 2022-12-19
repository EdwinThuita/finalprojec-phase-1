const list = document.getElementById("list");
const carName = document.getElementById("name");
const descriptionLabel = document.getElementById("description");
const priceLabel = document.getElementById("price");
const available = document.getElementById("available");
const img = document.getElementById("img");
const purchaseBtn = document.getElementById("purchase");
const searchInput = document.getElementById("searchInput");
const form = document.getElementById("form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorLable = document.getElementById("loginError");
const loginBtn = document.getElementById("login");

let cars = [];
let selectedCarId = null;
let loggedInUser = null;
let searchText = null;

window.addEventListener("load", () => {
  login();
  fetchData();
});

searchInput.addEventListener("input", () => {
  searchText = searchInput.value.toLowerCase();
  fetchData();
});

purchaseBtn.addEventListener("click", () => {
  const car = cars.find((c) => c.id == selectedCarId);
  fetch(`https://my-json-server.typicode.com/EdwinThuita/carsapi/cars/${car.id}`, {
    method: "PUT",
    headers: new Headers({ "content-type": "application/json" }),
    body: JSON.stringify({
      ...car,
      stock: car.stock - 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username == "" || password == "") {
    alert("Fill in all fields")
  } else {
    form.style.visibility = "hidden";
  }

});

function fetchData() {
  removeChilds(list);
  fetch("https://my-json-server.typicode.com/EdwinThuita/carsapi/cars/", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      cars = data.filter((car) => car.stock > 0);
      if (searchText) {
        cars = cars.filter(
          (car) =>
            car.name.toLowerCase().includes(searchText) ||
            car.description.toLowerCase().includes(searchText)
        );
      }
      populateMenu(cars);
    })
    .catch((error) => {
      console.log(error);
    });
}

function populateMenu(cars) {
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const listItem = document.createElement("li");
    const numLabel = document.createElement("label");
    const nameLabel = document.createElement("label");

    numLabel.textContent = `${i + 1}:`;
    nameLabel.textContent = car.name;

    listItem.append(numLabel);
    listItem.append(nameLabel);

    listItem.setAttribute("class", "listItem");
    listItem.setAttribute("id", i + 1);
    listItem.addEventListener("click", () => {
      selectedCarId = car.id;
      setCarDetails();
    });

    list.append(listItem);
  }
}

function setCarDetails() {
  const car = cars.find((c) => c.id == selectedCarId);
  carName.textContent = car.name;
  priceLabel.textContent = car.price;
  available.textContent = car.stock;
  descriptionLabel.textContent = car.description;
  img.setAttribute("src", car.image);
}

function login() {
  if (!loggedInUser) {
    form.style.visibility = "visible";
  }
}
const removeChilds = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};