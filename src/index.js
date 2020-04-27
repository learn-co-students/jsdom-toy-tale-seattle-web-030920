const toyCollection = document.querySelector("#toy-collection")
const newToySubmit = document.querySelector(".submit")
const toyFormContainer = document.querySelector(".container");
let addToy = false;

//fetch requests

function fetchAllToys(){
  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(json => json.forEach(toy => populateToy(toy)))
}

function fetchPostToy(name, imageUrl, likes){
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": name,
      "image": imageUrl,
      "likes": likes
    })
  })
  .then(res => res.json())
  .then(json => populateToy(json))
  .catch(message => console.log(message.error))
}

function fetchPostLike(toyNode) {
  let toyID = toyNode.id.split("_")[1]
  let likes = toyNode.querySelector("p")

  fetch("http://localhost:3000/toys/" + toyID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: parseInt(likes.innerText) + 1
    })
  })
  .then(res => res.json())
  .then(json => {
    likes.innerText = json.likes + " likes"
  })
}

//fetch populators

function populateToy(object) {
  let div = document.createElement("div")
  let h2 = document.createElement("h2")
  let img = document.createElement("img")
  let p = document.createElement("p")
  let btn = document.createElement("button")

  div.id = "toy_" + object.id

  div.className = "card"
  btn.className = "like-btn"
  img.className = "toy-avatar"

  h2.innerText = object.name
  img.src = object.image
  p.innerText = object.likes + " likes" //refactor this for the case of one like
  btn.innerText = "Like"

  btn.addEventListener("click", likeHandler)

  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(btn)

  toyCollection.appendChild(div)
}

// handlers

function likeHandler(e) {
  toyNode = e.target.parentNode
  fetchPostLike(toyNode)
}

function newToySubmitHandler(e) {
  e.preventDefault()
  let nameInput = document.querySelector("#name_input")
  let imgInput = document.querySelector("#img_input")

  fetchPostToy(nameInput.value, imgInput.value, 0)

  toyFormContainer.style.display = "none"
  addToy = !addToy

  nameInput.value = ""
  imgInput.value = ""
  
}

//load javascript

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  newToySubmit.addEventListener("click", newToySubmitHandler)

  fetchAllToys()
});
