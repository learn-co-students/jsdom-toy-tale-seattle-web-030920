let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  loadToys()
  submitToy()
});

function loadToys() {
  fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(toys => toys.forEach(toy => addToyCard(toy)))
}

function addToyCard(toy) {
  const toyCollection = document.getElementById("toy-collection")
  
  let toyDiv = document.createElement("div")
  toyDiv.className = "card"

  let h2 = document.createElement("h2")
  h2.textContent = toy.name

  let img = document.createElement("img")
  img.src = toy.image
  img.className = "toy-avatar"

  let p = document.createElement("p")
  p.textContent = `${toy.likes} Likes`

  let btn = document.createElement("button")
  btn.textContent = "Like <3"
  btn.className = "like-btn"

  btn.addEventListener("click", (e) => {
    let newLikes = ++toy.likes
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": `${newLikes} Likes`
      })
    }).then(resp => resp.json())
    .then(toy => p.textContent = toy.likes)
    .catch(console.log)
  })

  toyDiv.appendChild(h2)
  toyDiv.appendChild(img)
  toyDiv.appendChild(p)
  toyDiv.appendChild(btn)
  toyCollection.appendChild(toyDiv)
}

function submitToy() {
  const addForm = document.querySelector("form")
  addForm.addEventListener("submit", function(e) {
    e.preventDefault()
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": e.target.name.value,
        "image": e.target.image.value,
        "likes": 0
      })
    }).then(resp => resp.json())
    .then(toy => addToyCard(toy))
    .catch(console.log)
  })
}
