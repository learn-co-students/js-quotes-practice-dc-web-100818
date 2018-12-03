document.addEventListener('DOMContentLoaded', function () {
  findUl()
  getFetch()
  findForm()
  findForm().addEventListener('submit', function () {
    postFetch()
  })
})

function findUl() {
  return document.getElementById('quote-list')
}

function getFetch() {
  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(data => data.forEach(render))
}

function render(data) {
  let li = document.createElement('li')
  let blockquote = document.createElement('blockquote')
  let p = document.createElement('p')
  let footer = document.createElement('footer')
  let br = document.createElement('br')
  let likeButton = document.createElement('button')
  let deleteButton = document.createElement('button')

  li.className = 'quote-card'
  blockquote.className = "blockquote"
  p.className = "mb-0"
  footer.className = "blockquote-footer"
  likeButton.className = 'btn-success'
  deleteButton.className = 'btn-danger'

  li.dataset.id = data.id
  likeButton.dataset.id = `likeId-${data.id}`
  deleteButton.dataset.id = `deleteId-${data.id}`

  p.innerText = data.quote
  footer.innerText = data.author
  likeButton.innerText = `Likes: ${data.likes}`
  deleteButton.innerText = 'Delete'

  likeButton.addEventListener('click', function () {
    addLike()
  })

  deleteButton.addEventListener('click', function () {
    deleteQuote()
  })

  findUl().append(li)
  li.appendChild(blockquote)
  blockquote.append(p,footer,br,likeButton,deleteButton)
}

function findForm() {
  return document.getElementById('new-quote-form')
}

function postFetch() {
  event.preventDefault()
  let quoteInputValue = document.getElementById('new-quote').value
  let authorInputValue = document.getElementById('author').value

  let data = { quote:quoteInputValue,
    author: authorInputValue,
    likes: 0
  }

  fetch(`http://localhost:3000/quotes`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => (render(data)))
    findForm().reset()
  }

function addLike() {
  let likeNum = parseInt(event.currentTarget.innerText.split(' ')[1])
  event.currentTarget.innerText = `Likes: ${likeNum + 1}`

  let quoteId = event.currentTarget.dataset.id.split('-')[1]

  let data = {likes: likeNum + 1}
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
      },
      body: JSON.stringify(data)
    })
  }

function deleteQuote() {
  let quoteId = event.currentTarget.dataset.id.split('-')[1]
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "DELETE"
  })
  let quoteGone = document.querySelector(`li[data-id = "${quoteId}"]`)
  quoteGone.remove()
}
