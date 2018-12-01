// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', function () {
  fetchQuotes()
  getForm().addEventListener('submit', addNewQuote)
})

function fetchQuotes() {
  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(data => data.forEach(renderQuote))
}

function renderQuote(card) {
  let quoteCard = document.createElement('li')
  quoteCard.className = 'quote-Card'
  quoteCard.id = `card-${card.id}`

  let blockquote = document.createElement('blockquote')
  blockquote.className = 'blockquote'

  let quote = document.createElement('p')
  quote.innerText = card.quote
  quote.className = 'mb-0'

  let author = document.createElement('footer')
  author.className = "blockquote-footer"
  author.innerText = card.author

  let likeBtn = document.createElement('button')
  likeBtn.className = 'btn-success'
  likeBtn.innerText = "Likes: "
  likeBtn.dataset.id = card.id
  likeBtn.addEventListener('click', updateLikes)

  let likes = document.createElement('span')
  likes.innerText = card.likes
  likes.dataset.likes = card.likes

  let deleteBtn = document.createElement('button')
  deleteBtn.className = 'btn-danger'
  deleteBtn.innerText = 'Delete'
  deleteBtn.dataset.id = card.id
  deleteBtn.addEventListener('click', deleteQuote)

  blockquote.appendChild(quote)
  blockquote.appendChild(author)
  blockquote.appendChild(likeBtn)
  likeBtn.appendChild(likes)
  blockquote.appendChild(deleteBtn)
  quoteCard.appendChild(blockquote)
  getQuoteList().appendChild(quoteCard)
}

function addNewQuote(event) {
  event.preventDefault()
  let quote = document.querySelector('#new-quote').value
  let author = document.querySelector('#author').value
  let data = {
    quote: quote,
    author: author,
    likes: 0
  }
  renderQuote(data)
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

function updateLikes(event) {
  let id = event.currentTarget.dataset.id
  let span = event.currentTarget.children[0]
  let currentLikes = parseInt(event.currentTarget.children[0].dataset.likes)

  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: currentLikes + 1})
  }).then(response => response.json())
  .then(() => {
    span.innerText = parseInt(span.innerText) + 1
  })
}

function deleteQuote(event){
  let id = event.currentTarget.dataset.id
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE"
  })
  .then(response => response.json())
  .then(() => {
    document.querySelector(`#card-${id}`).remove()
  })
}

function getQuoteList() {
  return document.querySelector('#quote-list')
}

function getForm() {
  return document.querySelector('#new-quote-form')
}
