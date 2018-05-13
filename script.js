const suggestionsUl = document.querySelector('#suggestions')
const searchBox = document.querySelector('#search')

function insertSuggestions() {
  suggestionsUl.innerHTML = filteredSuggestions.map(s => displaySuggestion(s)).join('')
}

function displaySuggestion(suggestion) {
  return `
    <a href="${suggestion.url}" target="_blank">
      <li>
        ${suggestion.title}
        <small class="description">${suggestion.description}</small>
      </li>
    </a>
  `
}


function randomQuestion(lastQuestion) {
  let newQuestion = questions[Math.floor(Math.random() * questions.length)]
  while (newQuestion === lastQuestion) {
    newQuestion = questions[Math.floor(Math.random() * questions.length)]
  }
  return newQuestion
}

function switchOutExampleQuestion() {
  let oldPlaceholder = searchBox.placeholder.split('')
  let newPlaceholder = randomQuestion(oldPlaceholder.join('')).split('')
  let oldPlaceholderDelay = oldPlaceholder.length * typingMs;

  [...Array(oldPlaceholder.length)].forEach((_, i) => {
    setTimeout(() => {
      oldPlaceholder.pop()
      searchBox.placeholder = oldPlaceholder.join('')
    }, i * typingMs)
  })

  setTimeout(() => {
    [...Array(newPlaceholder.length)].forEach((_, i) => {
      setTimeout(() => {
        searchBox.placeholder = `${searchBox.placeholder}${newPlaceholder.shift()}`
      }, i * typingMs)
    })
  }, oldPlaceholderDelay)
}



searchBox.addEventListener('keyup', () => {
  filterSuggestions()
  insertSuggestions()
} )
