const shell = document.querySelector('.cinematic-shell')
const videos = [...document.querySelectorAll('[data-video-index]')]
const sceneButtons = [...document.querySelectorAll('[data-scene-button]')]
const menuToggle = document.querySelector('.menu-toggle')
const mobileMenu = document.querySelector('#mobile-menu')
const accessForm = document.querySelector('.access-form')

let activeVideo = 0
let isTransitioning = false

const activateScene = (nextVideo) => {
  if (
    isTransitioning ||
    nextVideo === activeVideo ||
    nextVideo < 0 ||
    nextVideo >= videos.length
  ) {
    return
  }

  isTransitioning = true
  activeVideo = nextVideo

  videos.forEach((video, index) => {
    video.classList.toggle('active', index === activeVideo)
  })

  sceneButtons.forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === activeVideo))
  })

  shell?.classList.toggle('dark-scene', activeVideo === 2)

  window.setTimeout(() => {
    isTransitioning = false
  }, 1000)
}

sceneButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activateScene(Number(button.dataset.sceneButton))
  })
})

const setMenu = (open, returnFocus = false) => {
  if (!menuToggle || !mobileMenu) return

  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  mobileMenu.hidden = !open
  document.body.classList.toggle('menu-open', open)

  if (open) {
    window.requestAnimationFrame(() => {
      mobileMenu.classList.add('is-open')
      mobileMenu.querySelector('a')?.focus()
    })
  } else {
    mobileMenu.classList.remove('is-open')
    if (returnFocus) menuToggle.focus()
  }
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true')
})

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    menuToggle?.getAttribute('aria-expanded') === 'true'
  ) {
    setMenu(false, true)
  }
})

accessForm?.addEventListener('submit', (event) => {
  event.preventDefault()
})
