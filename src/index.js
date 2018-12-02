// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('edit-quote-form').style.display = 'none'
  getQuotes()
  document.getElementById('submit').addEventListener('click', createQuote)
})

function createQuote(event) {
  event.preventDefault()
  let newQuote = document.getElementById('new-quote').value
  let newAuthor = document.getElementById('author').value

  let data = {
    quote: newQuote,
    author: newAuthor,
    likes: 0
  }
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => renderQuote(data))
}

function getQuotes () {
  fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(data => data.forEach(quote => renderQuote(quote)))
}
function renderQuote(quote) {
  let quoteUl = document.getElementById('quote-list')

  let quoteLi = document.createElement('li')
  quoteLi.className = 'quote-card'

  let quoteBlockquote = document.createElement('blockquote')
  quoteBlockquote.className = 'blockquote'

  let quoteP = document.createElement('p')
  quoteP.className = 'mb-0'
  quoteP.dataset.id = `quote-${quote.id}`
  quoteP.innerText = quote.quote

  let quoteFooter = document.createElement('footer')
  quoteFooter.className = 'blockquote-footer'
  quoteFooter.innerText = quote.author

  let quoteLikeButton = document.createElement('button')
  quoteLikeButton.className = 'btn-success'
  quoteLikeButton.dataset.id = quote.id
  quoteLikeButton.dataset.likes = quote.likes
  quoteLikeButton.innerHTML = `Likes: <span>${quote.likes}</span>`
  quoteLikeButton.addEventListener('click', addLike)

  let quoteDeleteButton = document.createElement('button')
  quoteDeleteButton.className = 'btn-danger'
  quoteDeleteButton.dataset.id = quote.id
  quoteDeleteButton.innerText = 'Delete'
  quoteDeleteButton.addEventListener('click', deleteQuote)

  let quoteEditButton = document.createElement('button')
  quoteEditButton.className = 'btn-info'
  quoteEditButton.dataset.id = quote.id
  quoteEditButton.innerText = 'Edit'
  quoteEditButton.addEventListener('click', editQuote)

  quoteBlockquote.append(quoteP, quoteFooter, quoteLikeButton, quoteDeleteButton, quoteEditButton)
  quoteLi.append(quoteBlockquote)
  quoteUl.append(quoteLi)
}

function editQuote(event) {
  event.preventDefault()
  document.getElementById('edit-quote').value = event.target.parentElement.querySelector('.mb-0').innerText
  document.getElementById('edit-author').value = event.target.parentElement.querySelector('.blockquote-footer').innerText
  document.getElementById('edit-submit').dataset.id = event.target.dataset.id
  document.getElementById('edit-submit').addEventListener('click', submitEdit)
  document.getElementById('edit-quote-form').style.display = 'block'
}

function submitEdit(event) {
  event.preventDefault()
  let quoteId = event.target.dataset.id
  let editedQuote = document.getElementById('edit-quote').value
  let editedAuthor = document.getElementById('edit-author').value

  let data = {
    quote: editedQuote,
    author: editedAuthor
  }

  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(() => document.getElementById('edit-quote-form').style.display = 'none')
    .then(() => document.getElementById('quote-list').innerHTML = '')
    .then(() => getQuotes())
}

function addLike(event) {
  event.preventDefault()
  let quoteId = event.target.dataset.id
  let quoteLikes = parseInt(event.target.dataset.likes)
  event.target.dataset.likes = quoteLikes + 1
  let data = {likes: quoteLikes + 1}

  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      event.target.innerHTML = `Likes: <span>${data.likes}</span>`
    })
}

function deleteQuote(event) {
  event.preventDefault()
  let quoteId = event.target.dataset.id
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'DELETE'
  })
    .then(() => document.getElementById('quote-list').innerHTML = '')
    .then(() => getQuotes())
}
