import React, { useState, ChangeEvent, KeyboardEvent } from 'react'
import {
  Heading,
  Input,
  Center,
  Tag,
  TagLabel,
  Flex,
  Wrap,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  Text,
  Link,
  IconButton,
} from '@chakra-ui/react'
import { SearchIcon, ExternalLinkIcon } from '@chakra-ui/icons'

function App() {
  const [inputText, setInputText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const [words, setWords] = useState<string[] | undefined>(undefined)
  const [error, setError] = useState<string>()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputText(e.target.value)

  const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleGenerateButtonClick()
    }
  }

  const handleGenerateButtonClick = async () => {
    // Skip if there is no inputText
    if (!inputText) {
      return
    }
    setIsLoading(true)

    // Call api to generate words
    try {
      const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputText }),
      })

      const data = await response.json()

      if (data.words) {
        setError('')
        setWords(data.words)
      } else {
        setError(data.error)
        setWords(undefined)
      }
    } catch (error) {
      console.error('API request error:', error)
      setWords([])
    } finally {
      setIsLoading(false)
    }
  }

  const renderWords = () => {
    // Ignore if words not defined
    if (!words) return
    // Show info no words found if array is empty
    if (!words.length) {
      return (
        <Alert borderRadius={4} status="info">
          <AlertIcon />
          <AlertDescription>
            There are no words that can be formed from this input.
          </AlertDescription>
        </Alert>
      )
    } else {
      // Show all valid words
      return (
        <Alert borderRadius={4} status="success">
          <Flex flexDir="column">
            <Flex>
              <AlertIcon />
              <AlertTitle>{words.length} valid words</AlertTitle>
            </Flex>
            <Wrap mt={4}>
              {words.map((tag, index) => (
                <Tag
                  key={index}
                  size="lg"
                  variant="subtle"
                  colorScheme="blackAlpha"
                >
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              ))}
            </Wrap>
          </Flex>
        </Alert>
      )
    }
  }

  return (
    <Center h="100vh">
      <Container textAlign="center" mx={10}>
        <Heading as="h1" size="xl">
          Generate words from characters
        </Heading>
        <Text textColor="gray.500">
          Words generated exist in the{' '}
          <Link
            href="https://www.wordgamedictionary.com/enable/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ENABLE word list <ExternalLinkIcon />.
          </Link>
        </Text>

        <Flex alignItems="center" justifyContent="center" my={5}>
          {/* Flex container */}
          <Input
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            placeholder="Enter some characters..."
            size="lg"
            mr={2}
          />
          <IconButton
            aria-label="generate-words"
            onClick={handleGenerateButtonClick}
            colorScheme="blue"
            size="lg"
            isLoading={isLoading}
            icon={<SearchIcon />}
          />
        </Flex>
        <Flex mt={4}>
          {renderWords()}
          {error && (
            <Alert borderRadius={4} status="error">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Flex>
      </Container>
    </Center>
  )
}

export default App
