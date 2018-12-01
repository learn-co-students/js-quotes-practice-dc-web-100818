document.addEventListener('DOMContentLoaded', function() {
  fetchAllQuotes()
  document.querySelector('form').addEventListener('submit', addQuote)
})

function fetchAllQuotes() {
  fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(data => data.forEach(renderQuote))
}

function addQuote(e) {
  e.preventDefault()
  let q = {
    quote: document.querySelector('#new-quote').value,
    likes: 0,
    author: document.querySelector('#author').value
  }

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(q)
  })
    .then(res => res.json())
    .then(data => renderQuote(data))
}

function addLike(e) {
  e.preventDefault()
  let id = e.currentTarget.id.split('-')[1]
  let likes = document.querySelector(`#likes-${id}`).innerText.split(' ')[1]
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
      body: JSON.stringify({likes: (parseInt(likes) + 1)})
  })
    .then(res => res.json())
    .then(data => {
      document.querySelector(`#likes-${data.id}`).innerText = `Likes: ${data.likes}`
    })
}

function deleteQ(e) {
  e.preventDefault()
  let id = e.currentTarget.id.split('-')[1]
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then( data => {
      document.querySelector(`#card-${id}`).remove()
    })
}

function renderQuote(q) {
  let li = document.createElement('li')
  li.classList.add('card')
  li.id = `card-${q.id}`
  let bq = document.createElement('blockquote')
  let p = document.createElement('p')
  p.innerText = q.quote
  let p1 = document.createElement('p')
  p1.innerText = q.author
  let p2 = document.createElement('p')
  p2.id = `likes-${q.id}`
  p2.innerText = `Likes: ${q.likes}`
  let b1 = document.createElement('button')
  b1.innerText = 'Like'
  b1.id = `btn-${q.id}`
  b1.addEventListener('click', addLike)
  let b2 = document.createElement('button')
  b2.innerText = 'Delete'
  b2.id = `del-${q.id}`
  b2.addEventListener('click', deleteQ)

  document.querySelector('ul').appendChild(li)
  li.appendChild(bq)
  bq.append(p, p1, p2, b1, b2)
}
