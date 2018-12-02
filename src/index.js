const quoteList = () => document.querySelector("#quote-list")
const quoteForm = () => document.querySelector("#new-quote-form")

document.addEventListener("DOMContentLoaded", ()=>{
  getFetch()

  quoteForm().addEventListener("submit", submitForm)
})

function getFetch() {
  fetch("http://localhost:3000/quotes")
    .then(resp => resp.json())
    .then(data => data.forEach(renderQuoteList))
}

function postFetch(object) {
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(object)
  }).then(resp => resp.json())
    .then(data => renderQuoteList(data))
}

function patchFetch(event) {
  const btnGrandParentElement = event.target.parentElement.parentElement
  const quoteID = btnGrandParentElement.dataset.id
  let supporterCount = parseInt(event.target.dataset.supporterCount)

  const supportParagraph = document.querySelector(`#quote-${quoteID}`)
  supportParagraph.innerText = `Supporters: ${++supporterCount}`

  fetch(`http://localhost:3000/quotes/${quoteID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      supporters: supporterCount
    })
  })
}

function deleteFetch(event) {
  const btnGrandParentElement = event.target.parentElement.parentElement
  const quoteID = btnGrandParentElement.dataset.id

  deleteGrandParentElement.remove()

  fetch(`http://localhost:3000/quotes/${quoteID}`, {
    method: "DELETE"
  })
}

function submitForm(event) {
  event.preventDefault()

  const quote = document.querySelector("#new-quote").value
  const author = document.querySelector("#author").value

  formObject = {
    quote: quote,
    supporters: 0,
    author: author
  }
  postFetch(formObject)
}


function renderQuoteList(data) {
  const liElement = document.createElement("li")
  liElement.setAttribute("class", "quote-card")
  liElement.dataset.id = data.id

  const blockQuoteElement = document.createElement("blockquote")
  blockQuoteElement.setAttribute("class", "blockquote")

  const pElement = document.createElement("p")
  pElement.setAttribute("class", "mb-0")
  pElement.innerText = data.quote

  const footerElement = document.createElement("footer")
  footerElement.setAttribute("class","blockquote-footer")
  footerElement.innerHTML = `<br>`
  footerElement.innerText = data.author

  const supportersElement = document.createElement("p")
  supportersElement.innerText = `Supporters: ${data.supporters}`
  supportersElement.id = `quote-${data.id}`

  const likeBtn = document.createElement("button")
  likeBtn.setAttribute("class", "btn-success")
  likeBtn.innerText = "Support"
  likeBtn.dataset.supporterCount = data.supporters
  likeBtn.addEventListener("click", patchFetch)

  const deleteBtn = document.createElement("button")
  deleteBtn.setAttribute("class", "btn-danger")
  deleteBtn.innerText = "Delete"
  deleteBtn.addEventListener("click", deleteFetch)

  blockQuoteElement.append(pElement, footerElement, supportersElement, likeBtn, deleteBtn)
  liElement.append(blockQuoteElement)
  quoteList().append(liElement)
}
