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
  })

// fetch all toys! 

  fetch("http://localhost:3000/toys")
  .then(resp=> resp.json())
  .then(resp => makeToys(resp))

//Creating New Toy
  const form= toyFormContainer.querySelector("form")
  console.log(form)
  form.addEventListener("submit", function(e){
  e.preventDefault()


  const data = { name: e.target.name.value, image: e.target.image.value, likes: 0};

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', makeCard(data));
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  e.target.reset()
  })
});

function makeToys(array) {
  array.forEach(toy => makeCard(toy))
}

function makeCard(toy){
  const div=document.getElementById("toy-collection")
  const toyDiv=document.createElement("div")
  toyDiv.className='card'
  toyDiv.innerHTML= `<h2>${toy.name}</h2> <img src=${toy.image} class='toy-avatar' /> <p>${toy.likes} Likes </p>`
  let button= document.createElement("button")
  button.innerText= "Like"
  button.className="like-btn"

//event stuff for like button

button.addEventListener('click', function(e){

  let newlikes=toy.likes+1

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
    },
    body: JSON.stringify({likes: newlikes}),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', updateLikes(data, e.target.parentNode));
  })
  .catch((error) => {
    console.error('Error:', error);
  });

})

  toyDiv.appendChild(button)
  div.appendChild(toyDiv)
}

function updateLikes(data, toydiv) {
let p= toydiv.querySelector("p")
p.innerText=`${data.likes} Likes`
}