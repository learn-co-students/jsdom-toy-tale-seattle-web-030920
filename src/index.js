let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', event => {
        event.preventDefault()
        postToy(event.target)
      });
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const parentDiv = document.getElementById("toy-collection")


function like(e) {
  e.preventDefault()
  let updootValue = parseInt(e.target.previousElementSibling.innerText) + 1

  fetch(`http://localhost:3000/toys/${e.target.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"

      },
      body: JSON.stringify({
        "likes": updootValue
      })
    })
    .then(res => res.json())
    .then((like_obj => {
      e.target.previousElementSibling.innerText = `${updootValue} likes`;
    }))
}

function buildToyCard(toy) {
  let h2Toy = document.createElement('h2')
  h2Toy.innerText = toy.name

  let img = document.createElement('img')
  img.src = toy.image
  img.className = "toy-avatar"
  
  let pToy = document.createElement('p')
  pToy.innerText = `${toy.likes} likes`

  let btnToy = document.createElement('button')
  btnToy.id = toy.id
  btnToy.className = "like-btn"
  btnToy.addEventListener('click', like)

  let div = document.createElement('div')
  div.className = "card"
  
  
  
  div.append(h2Toy, img, pToy, btnToy)
  parentDiv.append(div)
}


function fetchAllToys() {
  return fetch('http://localhost:3000/toys')
    .then(res => res.json())
}

function postToy(data) {
  fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": data.name.value,
        "image": data.image.value,
        "likes": 0
      })
    })
    .then(res => res.json())
    .then((toy_obj) => {
      let newToy = buildToyCard(toy_obj)
      parentDiv.append(newToy)
    })
}


fetchAllToys().then(toys => {
    toys.forEach(toy => buildToyCard(toy))
})