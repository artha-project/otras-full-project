import { Injectable, Logger } from '@nestjs/common'
import OpenAI from 'openai'
import { AIProvider } from './provider.interface'

@Injectable()
export class OpenAIProvider implements AIProvider {

  private readonly logger = new Logger(OpenAIProvider.name)
  private readonly client: OpenAI

  constructor() {

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

  }

  async generate(systemPrompt: string, payload: any): Promise<string> {

    const structuredPrompt = `
SYSTEM INSTRUCTION:
${systemPrompt}

STRUCTURED INPUT:
${JSON.stringify(payload, null, 2)}

IMPORTANT:
- Use only provided structured data
- Do not calculate scores
- Maintain professional tone
`

    try {

      const response = await this.client.chat.completions.create({

        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',

        messages: [
          { role: 'system', content: 'You are an institutional AI advisor.' },
          { role: 'user', content: structuredPrompt }
        ],

        temperature: 0.4,
        max_tokens: 3000

      })

      return response.choices[0]?.message?.content || ''

    } catch (error) {

      this.logger.error('OpenAI Error', error)
      throw error

    }

  }
}
