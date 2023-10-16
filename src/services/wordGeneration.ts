import { ValidationError } from '../utils/errors'
import VALID_ENGLISH_WORDS from '../utils/words'

// Limit the input length generation is expensive
const MAX_INPUT_LENGTH = 10

const generateWordSubsets = (word: string): string[] => {
  // Sort the word to help with duplicate handling later
  const wordAsCharArray = word.split('').sort()

  // Generate all subsets with the input
  const subsets: string[] = []
  const subsetHelper = (currentSub: string[], index: number) => {
    // 1. Base case: when index is length of wordAsCharArray, reached end
    if (index === wordAsCharArray.length) {
      subsets.push(currentSub.join(''))
      return
    }

    // 2. Recurse by picking the item at index, or not picking
    // 2a. Pick
    subsetHelper(currentSub.concat([wordAsCharArray[index]]), index + 1)

    // 2b. Don't Pick
    while (wordAsCharArray[index] === wordAsCharArray[index + 1]) {
      index++ // keep incrementing index until index + 1 is different from index
    }
    subsetHelper(currentSub.slice(), index + 1)
  }

  subsetHelper([], 0)

  return subsets
}

const generateSubsetPermutations = (wordSubsets: string[]): string[] => {
  // Use a set to prevent duplicate results
  const subsetPermutations: Set<string> = new Set()

  // Define a helper function to recursively form permutations of the word
  const generatePermutations = (currResult: string[], leftovers: string[]) => {
    // If no more leftovers, permutation is complete
    if (leftovers.length === 0) {
      subsetPermutations.add(currResult.join(''))
      return
    }

    // Build the permutation by iterating over the leftovers, and picking the current index and passing everything else as leftovers
    for (let i = 0; i < leftovers.length; i++) {
      const pickedChar = leftovers[i]
      const newCurrResult = [...currResult, pickedChar]
      const newLeftovers = [...leftovers.slice(0, i), ...leftovers.slice(i + 1)]
      generatePermutations(newCurrResult, newLeftovers)
    }
  }

  // Generate permutations for each word
  wordSubsets.forEach((wordSubset) =>
    generatePermutations([], wordSubset.split(''))
  )

  return Array.from(subsetPermutations) // return as list
}

/**
 * Generate valid english words from a string of alphabets
 *
 * @param {string} input - A string containing alphabets only
 * @returns {string[]} - An array of valid english words generated from the input string
 */
const generateValidWords = (input: string) => {
  console.log('Received input', input)

  try {
    // 0. Validation
    const isInputAlphanumeric = /^[a-zA-Z]+$/.test(input)
    if (!isInputAlphanumeric) {
      throw new ValidationError('Input is invalid. Only alphabets are allowed.')
    }
    const isInputWithinLimit = input.length <= MAX_INPUT_LENGTH
    if (!isInputWithinLimit) {
      throw new ValidationError('Input is too long. Max input length is 10.')
    }

    // 1. Convert input to lowercase
    const lowercasedInput = input.toLowerCase()

    // 2. Generate all word subsets from input
    const wordSubsets = generateWordSubsets(lowercasedInput)

    // 3. Generate all permutations of each subset of the input word
    const wordSubsetPermutations = generateSubsetPermutations(wordSubsets)

    // 3. Only keep if the combination is valid
    let validWordsFromInput = wordSubsetPermutations.filter((word) =>
      VALID_ENGLISH_WORDS.includes(word)
    )

    // 4. Sort the input for output consistency
    validWordsFromInput.sort()

    return validWordsFromInput
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('Validation error')
      throw error
    } else {
      console.log(error)
      throw Error('Internal server error while generating words')
    }
  }
}

export { generateValidWords }
