let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyForm.addEventListener('submit', (e) => {
    addToyToDiv(e)
  });

  let mainDiv = document.querySelector("#toy-collection");

  //https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQwsO4vi1XfEydSFoh9vaQPtr9tlrxixphfaK7UYnx4i_Rn26di8sUyWHvOnY8CXxUrODHX1mQ&usqp=CAc

  function addToyToDiv(e)
  {
    e.preventDefault();
    let newToyBody = {name: e.target["name"].value ,image: e.target["image"].value, likes: 0};
    let url = "http://localhost:3000/toys";
    
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      },
      body: JSON.stringify(newToyBody)
    })
    .then(resp => resp.json())
    .then((newToy) => {      
      loadToyCard(newToy);
    });
  }

  function fetchAll()
  {
    return fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(allToys => parseAll(allToys))
  }


  function parseAll(allToys)
  {
    debugger
    while(mainDiv.firstChild)
    {
      mainDiv.removeChild(mainDiv.firstChild);
    }
    allToys.forEach(toy => {
      loadToyCard(toy);
    })
  }

  function loadToyCard(toy)
  {
    debugger
    let likedParentCheck = toy.likedParent ? true : false
    let toyCard = document.createElement('div');    
    let toyTitle = document.createElement('h2');
    let toyImage = document.createElement('img');    
    let toyP = document.createElement('p');
    let toyLikeButton = document.createElement('button');

    toyCard.setAttribute('class', 'card');
    toyTitle.innerText = toy.name;
    toyImage.src = toy.image;
    toyImage.setAttribute('class', 'toy-avatar');
    toyP.innerText = `Likes ${toy.likes}`;
    toy["likeParent"] = toyCard;
    toyLikeButton.addEventListener('click', () => liked(toy));

    toyCard.append(toyTitle, toyImage, toyP, toyLikeButton);    
    if(!likedParentCheck)
    {
      mainDiv.appendChild(toyCard);
    }

  }

  function liked(toy)
  {            
    let moreLikey = toy.likes + 1;
    let likeBody = {"likes": moreLikey};   
    let url = `http://localhost:3000/toys/${toy.id}`;
   
    //debugger
    fetch(url,
      {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(likeBody)
      }
    )
    .then(resp => resp.json())
    .then(data => cardUpdate(data, toy))
  }

  function cardUpdate(toyResult, toy)
  {
    console.log(toyResult);
    likedOuput = toy.likeParent.querySelector('p');    
    likedOuput.innerText = `Likes ${toyResult.likes}`;
    toy.likes = toyResult.likes;
  }

  fetchAll();
  

});





