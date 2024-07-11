import { OpenAI } from 'openai'

export default defineEventHandler(async event => {
  try {
    const openai = new OpenAI({
      apiKey: useRuntimeConfig().openai.token
    })
    const { malleables, prompt } = await readBody(event)
    const data = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k-0613',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant in charge of manipulating a web application to suit a user\'s needs. You only speak JSON.'
        },
        {
          role: 'system',
          content: 'The current state of the app is:\n\n' + JSON.stringify(malleables, null, 2)
        },
        {
          role: 'user',
          content: prompt
        },
        {
          role: 'system',
          content: 'Here is the new current state of the app, in JSON:\n\n'
        },
      ]
    })
    return JSON.parse(data.choices[0].message.content!)
  } catch (e) {
    console.log(e)
    return {}
  }
})
