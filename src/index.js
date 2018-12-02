document.addEventListener('DOMContentLoaded', () => {
  fetchAllQuotes()
  quoteForm().addEventListener('submit', (e) => {
    e.preventDefault();
    let newQuoteInput = document.getElementById('new-quote');
    let authorInput = document.getElementById('author');

    let quoteValue = newQuoteInput.value 
    let authorValue = authorInput.value

    postQuote(quoteValue, authorValue)
  })
})

class Quote {
  constructor(author, id, likes, quote) {
    this.author = author,
    this.id = id,
    this.likes = likes,
    this.quote = quote
  }

  renderQuote() {
    // create li
    let li = document.createElement('li');
    li.classList.add('quote-card');
    li.dataset.num = this.id 
    // create blockquote
    let blockQuote = document.createElement('blockquote');
    blockQuote.classList.add('blockquote');
    // create p
    let pQuote = document.createElement('p');
    pQuote.classList.add('mb-0');
    pQuote.innerText = this.quote;
    // create footer
    let footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.innerText = this.author;
    // create br
    let br = document.createElement('br');
    // create button 1
    let button1 = document.createElement('button');
    button1.classList.add('btn-success')
    button1.innerHTML = `Likes: <span>${this.likes}</span>`
    button1.dataset.button = this.id
    console.log(button1)
    button1.addEventListener('click', () => {
      this.addLike()
    })
    // create button 2
    let button2 = document.createElement('button')
    button2.classList.add('btn-danger')
    button2.innerText = 'Delete'
    button2.addEventListener('click', () => {
      this.deleteQuote();
    })

    blockQuote.appendChild(pQuote);
    blockQuote.appendChild(footer);
    blockQuote.appendChild(br);
    blockQuote.appendChild(button1);
    blockQuote.appendChild(button2)

    li.appendChild(blockQuote)

    quoteDiv().appendChild(li);
  }

  deleteQuote() {
    fetch(`http://localhost:3000/quotes/${this.id}`, {
      method: "DELETE"
    }).then(response => response.json())
      .then(data => {
        let deleteQuote = document.querySelector(`[data-num="${this.id}"]`)
        deleteQuote.remove();
      })
  }

  addLike() {
    this.likes++
    let data = {
      likes: this.likes
    }
    fetch(`http://localhost:3000/quotes/${this.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => {
        let updatelikeBtn = document.querySelector(`[data-button="${data.id}"]`)
        updatelikeBtn.innerHTML = `Likes: <span>${this.likes}</span>`
      })
  }
}

function fetchAllQuotes() {
  fetch('http://localhost:3000/quotes')
    .then(response => response.json())
    .then(data => {
      data.forEach(quote => {
        let newQuote = new Quote(quote.author, quote.id, quote.likes, quote.quote)
        newQuote.renderQuote();
      })
    })
}

function postQuote(quoteValue, authorValue) {
  quoteForm().reset()

  let data ={
    quote: quoteValue,
    likes: 1,
    author: authorValue
  }

 fetch("http://localhost:3000/quotes", {
   method: "POST",
   headers: {
    "Content-Type": "application/json; charset=utf-8"
   },
   body: JSON.stringify(data)
 })
  .then(response => response.json())
  .then(data => {
    let newQuote = new Quote(data.author, data.id, data.likes, data.quote)
    newQuote.renderQuote();
  })
}

function quoteForm() {
  return document.getElementById('new-quote-form');
}

function quoteDiv() {
  return document.getElementById('quote-list');
}