let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection')

  addBtn.addEventListener("click", () => {
    toggleForm()
  });
  
  toyFormContainer.addEventListener('submit', handleSubmitToy)

  function fetchToys(){
    return fetch('http://localhost:3000/toys').then(res=> res.json())
    .then(json => buildToys(json))
  }
  
  function postToy(toy){

    return fetch('http://localhost:3000/toys', {method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(toy)
    })
    .then(res => res.json())
    .then(json => buildToy(json))
  }

  function patchLikes(toy_id, toy){
    return fetch(`http://localhost:3000/toys/${toy_id}`, {method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(toy)})
  }

  // function deleteToy(toy_id){
  //   fetch(`http://localhost:3000/toys/${toy_id}`, {method: 'DELETE',
  //   headers: {'Content-Type': 'application/json'}})
  // }

  function buildToys(toyList){
    toyList.forEach(toy => buildToy(toy))
  }

  function buildToy(toy){
    const div = document.createElement('div')
    const likes = document.createElement('button')

    div.id = toy.id
    div.className = "card"
    div.innerHTML = `<h2>${toy.name}</h2><img src=${toy.image} class='toy-avatar'/><p>${toy.likes} Likes </p>`
    
    likes.className = 'like-btn'
    likes.innerText = `Like <3`

    div.appendChild(likes)

    likes.addEventListener('click', handleLikes)

    toyCollection.appendChild(div)
  }

  function toggleForm(){
    addToy = !addToy;

    if (addToy) {
      clearForm()
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  }

  function clearForm(){
    const form = document.getElementsByClassName("add-toy-form")[0]
    form.reset()
  }




  function handleSubmitToy(newToy){
    newToy.preventDefault()

    let name = newToy.target.name.value
    let img = newToy.target.image.value
    let toy = {name: name, image: img, likes: 0}

    postToy(toy)
    .then(toggleForm())
  }

  function handleLikes(e){
    const likesParagraph = e.target.parentElement.querySelector("p")
    const updatedLikes = parseInt(likesParagraph.innerText.split(" ")[0]) + 1
    const toy_id = e.target.parentElement.id

    const toy = {likes: updatedLikes}

    likesParagraph.innerText = `${updatedLikes} likes`
    patchLikes(toy_id, toy)

  }



  fetchToys()


});
