# Changelog

#### 2.0.1 (September 8th, 2020)

**Bug fixes**  
- Fixed a bug caused by Safari returning malformed `cssText` from an element's computed style (see [#18](https://github.com/justintaddei/illusory/issues/18))

## 2.0.0 (August 8th, 2020)

**Breaking changes**
- Options related to IllusoryElements specified when calling `illusory` are now specified in options.element instead of as top-level options.
- `illusory` now resolves to a "controls object" instead of a boolean. (See [#13](https://github.com/justintaddei/illusory/issues/13))
- `autoAttach` is now named `attachImmediately`
- `beforeAttach` hook has been removed in favor of `beforeAnimate` since they were essentially the same thing.
- `deltaHandlers` API has been removed. It complicated the code and I didn't see any practical use for it.
- (Typescript users only) renamed `IOptions` export to `IIllusoryOptions`.

**Features**
- illusory now supports transitioning between elements with preexisting CSS transforms applied to them (must have the same `transform-origin` set) (See [#14](https://github.com/justintaddei/illusory/issues/14)).
- Added `relativeTo` option to account for scroll-offsets. (See [#8](https://github.com/justintaddei/illusory/issues/8))
- It is now possible to cancel an illusory animation using the new "Controls API" (See [#13](https://github.com/justintaddei/illusory/issues/13)).

#### 1.4.2 (June 14th, 2020)

**Bug fixes**
- Fixed *Creating independent IllusoryElements brakes compositeOnly* (See [#11](https://github.com/justintaddei/illusory/issues/11))

#### 1.4.1 (June 5th, 2020)

**Bug fixes**
- Fixed bug caused by improper usage of `Array.prototype.indexOf` resulting in the first item of the `ignoreTransparency` array being skipped.

### 1.4.0 (June 4th, 2020)

**Features**
- Added `IllusoryElement.prototype.attach` in response to [#4](https://github.com/justintaddei/illusory/issues/4)
- Added new option `autoAttach` in response to [#4](https://github.com/justintaddei/illusory/issues/4)

---

### 1.3.0 (June 3rd, 2020)

**Features**
- Add `ignoreTransparency` option to address [#2](https://github.com/justintaddei/illusory/issues/2) (this feature also replaces the fix from [v1.2.2](#122-june-2nd-2020)).

**Other**
- Corrected some formatting issues in the README.

---

#### 1.2.3 (June 2nd, 2020)

**Bug fixes**
- Fixed issue introduced in v1.2.2 which made morphing between text-only elements look odd in some cases.

#### 1.2.2 (June 2nd, 2020)
**Bug fixes**
- Fixed an issue that caused a "flash" to appear when morphing between images.  
  
**Other**
- Started keeping a changelog.
