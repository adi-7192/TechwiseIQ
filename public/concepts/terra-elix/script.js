const menuToggle = document.querySelector('.menu-toggle')
const mobileMenu = document.querySelector('#mobile-menu')
const menuLinks = mobileMenu.querySelectorAll('a')
const cards = [...document.querySelectorAll('[data-formula-card]')]
const dots = [...document.querySelectorAll('[data-formula-dot]')]
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let activeCard = 0
let carouselTimer

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  mobileMenu.hidden = !open
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    mobileMenu.querySelector('a').focus()
  } else if (mobileMenu.contains(document.activeElement)) {
    menuToggle.focus()
  }
}

function showCard(index) {
  activeCard = index
  cards.forEach((card, cardIndex) => {
    const active = cardIndex === activeCard
    card.classList.toggle('active', active)
    card.setAttribute('aria-hidden', String(!active))
    dots[cardIndex].dataset.active = String(active)
  })
}

function syncCarousel() {
  window.clearInterval(carouselTimer)
  showCard(0)

  if (!reduceMotion.matches) {
    carouselTimer = window.setInterval(
      () => showCard((activeCard + 1) % cards.length),
      3500,
    )
  }
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true')
})

menuLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false)
})

reduceMotion.addEventListener('change', syncCarousel)
syncCarousel()
