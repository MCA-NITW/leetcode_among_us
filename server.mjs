import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.disable('x-powered-by')

let corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))

app.use(
  helmet({
    contentSecurityPolicy: false
  })
)

app.use(express.json())

const leetcodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1000
})

app.post('/leetcode', leetcodeLimiter, async (req, res) => {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(req.body)
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    res.send(data)
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred')
  }
})

app.use(express.static(path.join(__dirname, 'client', 'build')))

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
