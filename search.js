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

let fuse, filteredSuggestions

function filterSuggestions() {
  if (searchBox.value.length >= fuseOptions.minMatchCharLength) {
    filteredSuggestions = fuse.search(searchBox.value)
  } else {
    filteredSuggestions = resources
  }
}

fetch('https://plz-halp.netlify.com/resources.json')
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
