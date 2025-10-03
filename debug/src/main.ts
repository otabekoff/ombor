/**
 * Ombor API Test Suite
 * Comprehensive tests for all Ombor features
 */

import './style.css'
import { Ombor } from 'ombor'
import { basicOperationsPage } from './pages/basic'
import { crudPage } from './pages/crud'
import { filteringPage } from './pages/filtering'
import { advancedPage } from './pages/advanced'
import { collectionsPage } from './pages/collections'
import { errorsPage } from './pages/errors'
import { performancePage } from './pages/performance'

export const db = new Ombor('testDatabase')

// Page registry
const pages: Record<string, any> = {
  basic: basicOperationsPage,
  crud: crudPage,
  filtering: filteringPage,
  advanced: advancedPage,
  collections: collectionsPage,
  errors: errorsPage,
  performance: performancePage
}

// Helper function to get console output element (since it may not exist yet)
function getOutput() {
  return document.getElementById('console-output')!
}

export function log(msg: string, data?: any) {
  const output = getOutput()
  const div = document.createElement('div')
  div.className = 'log'
  div.innerHTML = `<span class="time">${new Date().toLocaleTimeString()}</span> ${msg}${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''}`
  output.appendChild(div)
  output.scrollTop = output.scrollHeight
}

export function error(msg: string, err?: any) {
  const output = getOutput()
  const div = document.createElement('div')
  div.className = 'error'
  div.innerHTML = `<span class="time">${new Date().toLocaleTimeString()}</span> ❌ ${msg}${err ? `<pre>${err instanceof Error ? err.message : JSON.stringify(err, null, 2)}</pre>` : ''}`
  output.appendChild(div)
  output.scrollTop = output.scrollHeight
}

export function success(msg: string, data?: any) {
  const output = getOutput()
  const div = document.createElement('div')
  div.className = 'success'
  div.innerHTML = `<span class="time">${new Date().toLocaleTimeString()}</span> ✅ ${msg}${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''}`
  output.appendChild(div)
  output.scrollTop = output.scrollHeight
}

// Don't setup the default UI anymore - pages will handle their own content
// Just bind the sidebar buttons

// Bind console clear buttons
const clearConsoleBtn = document.getElementById('clearConsole')
if (clearConsoleBtn) {
  clearConsoleBtn.onclick = () => { getOutput().innerHTML = '' }
}

// Bind the clearDb button from sidebar
const clearDbBtn = document.getElementById('clearDb')
if (clearDbBtn) {
  clearDbBtn.onclick = async () => {
    if (confirm('Clear entire database?')) {
      try {
        log('Clearing database...')
        await db.delete()
        success('Database cleared!')
      } catch (err) {
        error('Clear failed', err)
      }
    }
  }
}

// Setup sidebar navigation
const navLinks = document.querySelectorAll('.nav-link')
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()

    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('active'))

    // Add active class to clicked link
    link.classList.add('active')

    // Load the page
    const pageName = link.getAttribute('data-page')
    if (pageName && pages[pageName]) {
      loadPage(pageName)
    }
  })
})

// Function to load a page
function loadPage(pageName: string) {
  const pageContent = document.querySelector<HTMLDivElement>('#page-content')!
  const page = pages[pageName]

  if (page) {
    log(`📄 Loading page: ${pageName}`)
    pageContent.innerHTML = page.render()
    page.init()
  } else {
    error(`Page not found: ${pageName}`)
  }
}

// Load the default page (basic)
loadPage('basic')

log('Ombor test suite loaded ✅')
