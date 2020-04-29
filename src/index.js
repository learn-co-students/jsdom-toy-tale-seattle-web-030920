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
  fetchAllToys()
  createToy()
  
});
  function fetchAllToys(){
    fetch('http://localhost:3030/toys')
    .then(res=> res.json())
    .then(object => buildAllToys(object))
  }

  function buildAllToys(toyobject){
    toyobject.forEach(toy=>{
    let container = document.getElementById("toy-collection")
    let div = document.createElement('div')
    div.className = "card"
    container.appendChild(div)
    let h2 = document.createElement('h2')
    h2.innerHTML = `${toy.name}`
    div.appendChild(h2)
    fetchOneToy(toy.id, h2)
    })
  }

  function fetchOneToy(id, element){
    fetch(`http://localhost:3030/toys/${id}`)
    .then(res => res.json())
    .then(object => buildEachToy(object, element))
  }

  function buildEachToy(object, element){
    let img = document.createElement('img')
    img.src = `${object.image}`
    img.className = "toy-avatar"
    let p = document.createElement('p')
    p.innerHTML = `${object.likes} likes `
    let button = document.createElement('button')
    button.innerHTML = "Like <3"
    button.className = "like-btn"
    button.addEventListener('click', function(){
      let newLikes = ++object.likes
      fetch(`http://localhost:3030/toys/${object.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        },
        body:JSON.stringify({
          "likes" : `${newLikes} Likes`
        })
        })
        .then(res => res.json())
        .then(element => p.innerText = element.likes)
      })
    element.parentNode.insertBefore(img, element.nextSibling)
    img.parentNode.insertBefore(p, img.nextSibling)
    p.parentNode.insertBefore(button, p.nextSibling)
  }
  
  function createToy(){
  let form = document.querySelector("form");
  form.addEventListener('submit', function(e){
    e.preventDefault()
    fetch("http://localhost:3030/toys", {
      method: "POST",
      headers: {
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({
        "name": e.target.name.value,
        "image": e.target.image.value,
        "likes": 0
      })
    })
    .then(resp => resp.json())
    .then(toy =>{
      let container = document.getElementById("toy-collection")
      let div = document.createElement('div')
      div.className = "card"
      container.appendChild(div)
      let h2 = document.createElement('h2')
      h2.innerHTML = `${toy.name}`
      div.appendChild(h2)
      fetchOneToy(toy.id, h2)
    })
    .catch(console.log)      
    })
  }




  

  

