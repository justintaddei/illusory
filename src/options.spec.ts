import { DEFAULT_OPTIONS } from './options'

// To make sure they aren't accidentally changed
it('Has the documented default options', () => {
  expect(DEFAULT_OPTIONS).toEqual({
    element: {
      includeChildren: true,
      ignoreTransparency: ['img']
    },
    zIndex: 1,
    compositeOnly: false,
    duration: '300ms',
    easing: 'ease',
    relativeTo: [document]
  })
})
