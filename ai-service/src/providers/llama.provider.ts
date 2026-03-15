import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { AIProvider } from './provider.interface'

@Injectable()
export class LlamaProvider implements AIProvider {

  private readonly logger = new Logger(LlamaProvider.name)

  async generate(systemPrompt: string, payload: any): Promise<string> {

    const prompt = `
SYSTEM INSTRUCTION:
${systemPrompt}

STRUCTURED INPUT:
${JSON.stringify(payload, null, 2)}
`

    try {

      const response = await axios.post(

        process.env.LLAMA_URL || 'http://localhost:11434/api/generate',

        {
          model: process.env.LLAMA_MODEL || 'llama3',
          prompt,
          stream: false
        }

      )

      return response.data.response

    } catch (error) {

      this.logger.error('Llama Error', error)
      throw error

    }

  }
}
