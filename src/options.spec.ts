import { DEFAULT_OPTIONS } from './options'

// To make sure they aren't accidentally changed
it('Has the documented default options', () => {
  expect(DEFAULT_OPTIONS).toEqual({
    includeChildren: true,
    ignoreTransparency: ['img'],
    duration: '300ms',
    easing: 'ease',
    zIndex: 1,
    compositeOnly: false,
    relativeTo: [window]
  })
})
