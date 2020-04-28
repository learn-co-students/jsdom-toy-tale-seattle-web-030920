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

  let mainDiv = document.querySelector('#toy-collection');
  let url = "http://localhost:3000/toys"
  let newToyForm = document.querySelector('.add-toy-form');
  
  newToyForm.addEventListener('submit', () => handleNewToy(event));

  //https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQwsO4vi1XfEydSFoh9vaQPtr9tlrxixphfaK7UYnx4i_Rn26di8sUyWHvOnY8CXxUrODHX1mQ&usqp=CAc

  function handleNewToy(e)
  {    
    e.preventDefault();

    let newToy = {name: e.target["name"].value, image: e.target["image"].value, likes: 0};    
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(resp => resp.json())
    .then(jsonResult => loadToyCard(jsonResult))

  }

  function fetchAll()
  {    
    fetch(url)
    .then(resp => resp.json())
    .then(jsonToys => handleAllToys(jsonToys));
  }

  function handleAllToys(jsonToys)
  {
    jsonToys.forEach(toy => {
      
      loadToyCard(toy);
    });
  }

  function loadToyCard(toy)
  {     
    let toyCard = document.createElement('div');
    let toyHeader = document.createElement('h2');
    let toyImage = document.createElement('img');
    let toyP = document.createElement('p');
    let toyButton = document.createElement('button');

    toyCard.setAttribute('class', 'card');
    toyHeader.innerText = toy.name;
    toyImage.src = toy.image;
    toyImage.setAttribute('class', 'toy-avatar');
    toyP.innerText = `Likes ${toy.likes}`;
    toy["parentContainer"] = toyCard;
    toyButton.addEventListener('click', () => handleLike(toy));

    toyCard.append(toyHeader, toyImage, toyP, toyButton);
    mainDiv.appendChild(toyCard);

  }

  function handleLike(toy)
  {
    let toyUrl = `${url}/${toy.id}`
    let likeCount = toy.likes + 1;
    let likeBody = {likes: likeCount};
    
    fetch(toyUrl,{
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(likeBody)
    })
    .then(resp => resp.json())
    .then(toyUpdateResult => patchToy(toyUpdateResult, toy));
  }

  function patchToy(toyUpdateResult, toy)
  {    
    if(toyUpdateResult.likes != toy.likes)
    {
      toy.likes = toyUpdateResult.likes;
      let likeP = toy.parentContainer.querySelector('p');
      likeP.innerText = `Likes ${toy.likes}`;
    }
  }

  fetchAll()
  
});
