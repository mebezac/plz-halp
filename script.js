const resources = []
const questions = []
const typingMs = 45
const fuseOptions = {
  shouldSort: true,
  findAllMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [{
    name: 'title',
    weight: 0.6
  }, {
    name: 'description',
    weight: 0.6
  }, {
    name: 'tags',
    weight: 0.9
  }, {
    name: 'questions',
    weight: 0.2
  }]
}
const suggestionsUl = document.querySelector('#suggestions')
const searchBox = document.querySelector('#search')
let fuse, filteredSuggestions

function insertSuggestions() {
  suggestionsUl.innerHTML = filteredSuggestions.map(s => displaySuggestion(s)).join('')
}

function displaySuggestion(suggestion) {
  return `
    <a href="${suggestion.url}">
      <li>
        ${suggestion.title}
        <small class="description">${suggestion.description}</small>
      </li>
    </a>
  `
}

function filterSuggestions() {
  if (searchBox.value.length >= fuseOptions.minMatchCharLength) {
    filteredSuggestions = fuse.search(searchBox.value)
  } else {
    filteredSuggestions = resources
  }
  insertSuggestions()
}

function randomQuestion(lastQuestion) {
  let newQuestion = questions[Math.floor(Math.random()*questions.length)]
  while (newQuestion === lastQuestion) {
    newQuestion = questions[Math.floor(Math.random()*questions.length)]
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

fetch('/resources.json')
  .then(data => data.json())
  .then(data => {
    resources.push(...data.resources)
    let flattenedQuestions = [].concat.apply([], resources.map(r => r.questions))
    questions.push(...flattenedQuestions)
    filteredSuggestions = resources
    insertSuggestions()
    fuse = new Fuse(resources, fuseOptions)
    let maxTypingTime = Math.max(...questions.map(x => x.length)) * typingMs * 2 + 1000
    setInterval(() => {
      switchOutExampleQuestion()
    }, maxTypingTime)
  })

searchBox.addEventListener('keyup', filterSuggestions)
