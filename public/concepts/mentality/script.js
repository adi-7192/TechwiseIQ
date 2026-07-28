const toggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('#mobile-menu')
const searchForm = document.querySelector('.search-pill')

const setMenu = (open, returnFocus = false) => {
  if (!toggle || !menu) return

  toggle.setAttribute('aria-expanded', String(open))
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  menu.hidden = !open
  document.body.classList.toggle('menu-open', open)

  if (open) {
    menu.querySelector('a')?.focus()
  } else if (returnFocus) {
    toggle.focus()
  }
}

toggle?.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true')
})

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false, true)
  }
})

searchForm?.addEventListener('submit', (event) => {
  event.preventDefault()
})
