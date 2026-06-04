const { createApp } = Vue

createApp({
  data() {
    return {
      correctLetters: ['', '', '', '', ''],
      contains: '',
      exclude: '',
      results: [],
      searching: false,
      hasSearched: false,
      error: '',
      wordCount: 0,
      wordList: []
    }
  },
  mounted() {
    this.loadWordList()
  },
  methods: {
    loadWordList() {
      try {
        if (typeof WORDS !== 'undefined') {
          this.wordList = WORDS.map((word) => word.toLowerCase())
          this.wordCount = this.wordList.length
        } else {
          this.error = 'Ordlistan kunde inte laddas. Försök uppdatera sidan.'
        }
      } catch (error) {
        this.error = 'Ett fel uppstod vid inläsning av ordlistan.'
        console.error('Error loading word list:', error)
      }
    },
    sanitizeLetters(value) {
      return value.toUpperCase().match(/[A-ZÅÄÖ]/g) || []
    },
    sanitizeLetterString(value) {
      return this.sanitizeLetters(value).join('')
    },
    uniqueLetters(letters) {
      return [...new Set(letters)]
    },
    getRequiredLetters() {
      return new Set([
        ...this.correctLetters.filter(Boolean),
        ...this.contains.split('')
      ])
    },
    removeRequiredLettersFromExclude() {
      const requiredLetters = this.getRequiredLetters()
      this.exclude = this.exclude
        .split('')
        .filter((letter) => !requiredLetters.has(letter))
        .join('')
    },
    handleLetterFieldInput(event, field) {
      const letters = this.uniqueLetters(
        this.sanitizeLetters(event.target.value)
      )

      if (field === 'contains') {
        this.contains = letters.join('')
        this.removeRequiredLettersFromExclude()
      } else if (field === 'exclude') {
        const requiredLetters = this.getRequiredLetters()
        this.exclude = letters
          .filter((letter) => !requiredLetters.has(letter))
          .join('')
      }

      event.target.value = this[field]
      this.search()
    },
    focusCorrectBox(index) {
      this.$nextTick(() => {
        document.getElementById(`correct-${index}`)?.focus()
      })
    },
    handleCorrectInput(event, index) {
      const letters = this.sanitizeLetters(event.target.value)

      if (letters.length === 0) {
        this.correctLetters[index] = ''
        event.target.value = ''
        this.search()
        return
      }

      this.correctLetters[index] = letters[0]
      event.target.value = letters[0]

      if (letters.length > 1) {
        this.fillCorrectLetters(letters.slice(1), index + 1)
      } else if (index < this.correctLetters.length - 1) {
        this.focusCorrectBox(index + 1)
      }

      this.removeRequiredLettersFromExclude()
      this.search()
    },
    handleCorrectPaste(event, index) {
      const pastedText = event.clipboardData?.getData('text') || ''
      const letters = this.sanitizeLetters(pastedText)
      this.fillCorrectLetters(letters, index)
      this.removeRequiredLettersFromExclude()
      this.search()
    },
    handleCorrectBackspace(event, index) {
      if (this.correctLetters[index] || index === 0) return

      event.preventDefault()
      this.correctLetters[index - 1] = ''
      this.focusCorrectBox(index - 1)
      this.search()
    },
    handleCorrectSpace(event, index) {
      event.preventDefault()

      if (index < this.correctLetters.length - 1) {
        this.focusCorrectBox(index + 1)
      }
    },
    fillCorrectLetters(letters, startIndex) {
      letters.forEach((letter, offset) => {
        const targetIndex = startIndex + offset
        if (targetIndex < this.correctLetters.length) {
          this.correctLetters[targetIndex] = letter
        }
      })

      const nextEmptyIndex = this.correctLetters.findIndex(
        (letter, index) => index >= startIndex && !letter
      )
      const focusIndex =
        nextEmptyIndex === -1
          ? Math.min(
              startIndex + letters.length,
              this.correctLetters.length - 1
            )
          : nextEmptyIndex

      this.focusCorrectBox(focusIndex)
    },
    getCorrectPattern() {
      if (this.correctLetters.every((letter) => !letter)) return ''

      return this.correctLetters
        .map((letter) => letter.toLowerCase() || '_')
        .join('')
    },
    getRequiredLetterCounts() {
      return [...this.correctLetters, ...this.contains.split('')]
        .filter(Boolean)
        .reduce((counts, letter) => {
          const lowerCaseLetter = letter.toLowerCase()
          counts[lowerCaseLetter] = (counts[lowerCaseLetter] || 0) + 1
          return counts
        }, {})
    },
    getWordLetterCounts(word) {
      return word.split('').reduce((counts, letter) => {
        counts[letter] = (counts[letter] || 0) + 1
        return counts
      }, {})
    },
    search() {
      this.error = ''
      this.hasSearched = true
      const correctPattern = this.getCorrectPattern()
      const requiredLetterCounts = this.getRequiredLetterCounts()

      if (!correctPattern && !this.contains && !this.exclude) {
        this.results = []
        this.hasSearched = false
        return
      }

      this.searching = true

      setTimeout(() => {
        try {
          this.results = this.wordList.filter((word) => {
            if (word.length !== 5) return false

            if (correctPattern) {
              for (let index = 0; index < 5; index++) {
                if (
                  correctPattern[index] !== '_' &&
                  correctPattern[index] !== word[index]
                ) {
                  return false
                }
              }
            }

            const wordLetterCounts = this.getWordLetterCounts(word)

            for (const letter in requiredLetterCounts) {
              if (
                (wordLetterCounts[letter] || 0) < requiredLetterCounts[letter]
              ) {
                return false
              }
            }

            if (this.exclude) {
              const excludeLetters = this.exclude.toLowerCase().split('')
              for (const letter of excludeLetters) {
                if (word.includes(letter)) return false
              }
            }

            return true
          })

          this.results.sort()
        } catch (error) {
          this.error = 'Ett fel uppstod vid sökningen.'
          console.error('Search error:', error)
        }

        this.searching = false
      }, 100)
    },
    clear() {
      this.correctLetters = ['', '', '', '', '']
      this.contains = ''
      this.exclude = ''
      this.results = []
      this.hasSearched = false
      this.error = ''
    },
    copyWord(word) {
      navigator.clipboard
        .writeText(word.toUpperCase())
        .then(() => {
          const originalCount = this.wordCount
          this.wordCount = -1
          setTimeout(() => {
            this.wordCount = originalCount
          }, 1500)
        })
        .catch((error) => {
          console.error('Failed to copy:', error)
        })
    }
  }
}).mount('#app')
