// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", function () {
  getFetch()
  getForm().addEventListener('submit', function(e) {
    renderNew(e)
  })
})

/////////////Render Quotes/Get ///////////////////

function getParentUl() {
  return document.querySelector('#quote-list');
}

function getFetch() {
  fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(data => {data.forEach(quote => renderQuotes(quote))})
}

function renderQuotes (quote) {
  let blockquote = document.createElement('blockquote');
  blockquote.className = `blockquote-${quote.id}`;

  let p = document.createElement('p');
  p.className = `quote-${quote.id}`;
  p.innerText = `${quote.quote}`

  let footer = document.createElement('footer');
  footer.className = "blockquote-footer";
  footer.innerText = `${quote.author}`

  let successBtn = document.createElement('button');
  successBtn.className = `btn-success-${quote.id}`
  successBtn.innerText = 'Likes:'
  let span = document.createElement('span')
  span.innerText = ` ${quote.likes}`
  successBtn.appendChild(span)

  successBtn.addEventListener('click', function(e) {
    updateLikes(e)
  })

  let deleteBtn = document.createElement('button');
  deleteBtn.className = `btn-danger-${quote.id}`;
  deleteBtn.innerText = 'Delete'

  deleteBtn.addEventListener('click', function(e) {
    deleteQuote(e)
  })

  getParentUl().appendChild(blockquote);
  blockquote.append(p, footer, successBtn, deleteBtn);

}
//////////////////////Create///////////////////
function getForm() {
  return document.querySelector('#new-quote-form');
}

function renderNew(e) {
  e.preventDefault();
  let quote = document.querySelector('#new-quote').value;
  let author = document.querySelector('#author').value;

  let data = {
    quote: quote,
    likes: 0,
    author: author
  }

  renderQuotes(data)
  postFetch(quote, author, data)
  getForm().reset();
}

function postFetch(quote, author, data) {
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
}

//////////////////Update Likes /////////////////

function updateLikes(e) {
  let quoteId = e.currentTarget.classList[0].split('-')[2]
  let likeCount = parseInt(e.currentTarget.querySelector('span').innerText)

  let data = {
    likes: (likeCount + 1)
  }

  e.currentTarget.querySelector('span').innerText = `${data.likes}`

  patchFetch(quoteId, data)
}

function patchFetch(quoteId, data) {

  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
}

//////////////// Delete /////////////////

function deleteQuote(e) {
  let quoteId = e.currentTarget.classList[0].split('-')[2]
  let quoteDiv = document.querySelector(`.blockquote-${quoteId}`)
  quoteDiv.remove()
  deleteFetch(quoteId)
}

function deleteFetch(quoteId) {
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "DELETE"
  })
}
