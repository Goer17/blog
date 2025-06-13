import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const postName = args[0]?.replace(/[^a-zA-Z0-9-_]/g, '')

if (!postName) {
  console.error('Please provide a post name as the first argument, e.g. npm run new -- post_new')
  process.exit(1)
}

const postsDir = path.resolve('public/posts')
const postsJsonPath = path.resolve('public/posts.json')
const mdFilePath = path.join(postsDir, `${postName}.md`)

// 1. Create posts directory if it does not exist
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true })
}

// 2. Create markdown file
if (fs.existsSync(mdFilePath)) {
  console.error(`File ${mdFilePath} already exists.`)
  process.exit(1)
}
const now = new Date()
const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
const mdContent = `---
title: ${postName}
time: ${dateStr}
category:
---
`
fs.writeFileSync(mdFilePath, mdContent, 'utf-8')

// 3. Update posts.json
let posts: string[] = []
if (fs.existsSync(postsJsonPath)) {
  const raw = fs.readFileSync(postsJsonPath, 'utf-8')
  try {
    const parsed = JSON.parse(raw)
    posts = Array.isArray(parsed) ? parsed : []
  } catch {
    posts = []
  }
}
if (!posts.includes(postName)) {
  posts.unshift(postName)
  fs.writeFileSync(postsJsonPath, JSON.stringify(posts, null, 2), 'utf-8')
}


console.log(`Created ${mdFilePath} and updated posts.json`)