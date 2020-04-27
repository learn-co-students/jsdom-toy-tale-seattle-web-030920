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
  // load toys
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(json => loadToys(json))

  // create new toy
  const createForm = document.querySelector('.add-toy-form')
  createForm.addEventListener('submit', function(e) {
    e.preventDefault()
    let name = createForm.children[1].value
    let image = createForm.children[3].value
    console.log(image)
    fetch('http://localhost:3000/toys', {
      method: 'POST', 
      headers: 
      {
        "Content-Type":"application/json",
        Accept: "application/json"
      },
      body : JSON.stringify({
        "name": `${name}`,
        "image": `${image}`,
        "likes": 0
      })
    })
    .then(res => res.json())
    .then(json => console.log(json))
  })
});


function loadToys(toys) {
  let toyCollection = document.getElementById('toy-collection')
  for (let toy of toys) {
    let card = document.createElement('div')
    card.class = "card"
    card.id = toy.id
    let title = document.createElement('h2')
    title.innerText = toy.name
    let img = document.createElement('img')
    img.src = toy.image
    img.class = "toy-avatar"
    let likes = document.createElement('p')
    likes.innerText = toy.likes
    let likeBtn = document.createElement('button')
    likeBtn.class = "like-btn"
    likeBtn.innerText = "Like <3"
    likeBtn.addEventListener('click', function(e){
      let toyId = likeBtn.parentElement.id
      let newLikes = likeBtn.parentElement.children[2].innerText++
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
          "likes": newLikes
        })
      })
      // grab likes innertext
      // split and increase
      // make patch
    })
    card.appendChild(title)
    card.appendChild(img)
    card.appendChild(likes)
    card.appendChild(likeBtn)
    toyCollection.appendChild(card)
  }
}

