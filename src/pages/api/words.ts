import type { NextApiRequest, NextApiResponse } from 'next'
import { generateValidWords } from '../../services/wordGeneration'
import { ValidationError } from '../../utils/errors'

interface SuccessResponse {
  words: string[]
}
interface ErrorResponse {
  error: string
}

type ApiResponse = SuccessResponse | ErrorResponse

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const input = req.body.input

  try {
    const validWords = generateValidWords(input)
    res.status(200).json({ words: validWords })
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
