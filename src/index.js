// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', function(){
  getQuotes()
  getForm().addEventListener('submit', makeQuote)
})

function getQuotes(){
  fetch('http://localhost:3000/quotes')
    .then(resp => resp.json())
    .then(json => {
      json.forEach(renderQuote)
    })
}

function renderQuote(quote){
  let card = document.createElement('li')
  card.classList.add('quote-card')
  card.id = `card-${quote.id}`

  let container = document.createElement('blockquote')
  container.classList.add('blockquote')

  let content = document.createElement('p')
  content.classList.add('mb-0')
  content.innerText = quote.quote

  let footer = document.createElement('footer')
  footer.classList.add('blockquote-footer')
  footer.innerText = quote.author

  let br = document.createElement('br')

  let likeBtn = document.createElement('button')
  likeBtn.classList.add('btn-success')
  likeBtn.id = `like-${quote.id}`
  likeBtn.innerText = "Likes:"

  let likes = document.createElement('span')
  likes.innerText = quote.likes
  likes.id = `span-${quote.id}`
  likeBtn.addEventListener('click', addLike)
  likeBtn.appendChild(likes)

  let deleteBtn = document.createElement('button')
  deleteBtn.classList.add('btn-danger')
  deleteBtn.id = `delete-${quote.id}`
  deleteBtn.innerText = "Delete"
  deleteBtn.addEventListener('click', deleteQuote)
  
  container.append(content, footer, br, likeBtn, deleteBtn)
  card.appendChild(container)
  getList().appendChild(card)
}

function makeQuote(e){
  e.preventDefault()
  let quote = document.querySelector('#new-quote').value
  let author = document.querySelector('#author').value
  postQuote(quote, author)
}

function postQuote(quote, author){
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({quote: quote, author: author, likes: 0})
  })
    .then(resp => resp.json())
    .then(json => renderQuote(json))
}

function addLike(e){
  let id = event.target.id.split('-')[1]

  let span = document.querySelector(`#span-${id}`)
  span.innerText = (parseInt(span.innerText) + 1)
  let likes = span.innerText

  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({likes: likes})
  })
}

function deleteQuote(e){
  let id = event.target.id.split('-')[1]

  let card = document.querySelector(`#card-${id}`)
  card.remove()

  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE"
  })
}

function getList(){
  return document.querySelector('#quote-list')
}

function getForm(){
  return document.querySelector('#new-quote-form')
}
