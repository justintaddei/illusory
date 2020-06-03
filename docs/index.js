// Demo 1
;(() => {
  const el = index => document.querySelector(`.first-demo--${index}`)
  let currEl = 0
  const totalEls = 4

  const animate = async lastEl => {
    currEl = ++currEl % totalEls

    const to = el(currEl)

    to.classList.remove('hidden')

    await illusory(el(lastEl), to, {
      beforeAnimate(from) {
        from.natural.classList.add('hidden')
      },
      ignoreTransparency: false
    })

    setTimeout(() => animate(currEl), 1000)
  }

  setTimeout(() => animate(currEl), 1000)
})()
// Demos with play buttons
const exampleCode = {
  'example-1': (from, to, opts) => illusory(from, to, opts),
  'example-2': async (from, to, opts) => {
    await illusory(from, to, opts)
    return illusory(to, from, opts)
  },
  'example-3': (from, to, opts) => illusory(from, to, opts),
  'example-4': (from, to, opts) =>
    illusory(from, to, {
      ...opts,
      deltaHandlers: {
        transform: false,
        borderTopLeftRadius: false,
        backgroundColor(delta, deltaStyle, thisStyle) {
          return 'red'
        }
      }
    }),
  'example-5': async (from, to, opts) =>
    illusory(from, to, {
      ...opts,
      async beforeAnimate(from, to) {
        from.showNatural()
        from.hide()

        from.setStyle('transition', 'opacity 0.5s')
        from.flushCSS()

        from.show()
        await from.waitFor('opacity')

        from.hideNatural()
      },
      beforeDetach(from, to) {
        to.showNatural()

        to.setStyle('transition', 'opacity 0.5s')
        to.hide()

        return to.waitFor('opacity')
      }
    })
}

;(() => {
  document.addEventListener('click', async e => {
    if (!e.target.classList.contains('play')) return
    e.target.style.pointerEvents = 'none'
    e.target.style.opacity = '0.5'
    const exampleContainer = e.target.parentNode

    const from = exampleContainer.querySelector('.from')
    const to = exampleContainer.querySelector('.to')

    await exampleCode[exampleContainer.className](from, to, exampleContainer.dataset)

    e.target.style.opacity = '1'
    e.target.style.pointerEvents = 'all'
  })
})()
