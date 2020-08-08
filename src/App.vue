<template>
  <div id="app">
    <h1 id="title">illusory</h1>
    <br />
    <h3 id="description">Seamlessly morph any element into another.</h3>

    <h2>Installation</h2>
    <prism-editor readonly code="$ npm i illusory" language="shell" />
    <p>or</p>
    <prism-editor
      readonly
      code='<script src="https://unpkg.com/illusory"></script>'
      language="html"
    />

    <h2>Basic usage</h2>
    <prism-editor
      readonly
      code="import { illusory } from 'illusory' // If you use npm

const start = document.querySelector('#from')
const end = document.querySelector('#to')

illusory(start, end)"
      language="js"
    />

    <illusory-example
      :options="{
        duration: '.75s'
      }"
      class="example-1"
    ></illusory-example>

    <hr />

    <h2>How it works</h2>

    <p>
      When <code>illusory</code> is called, the <i>starting</i> and
      <i>ending</i> elements are each converted to an
      <code>IllusoryElement</code>.
    </p>
    <p>
      <code>IllusoryElement</code>s are clones of their source element.
      <br />We'll call these <i>source elements</i> the
      <code>natural</code> elements.
    </p>
    <p>
      First, the delta between the two <code>IllusoryElement</code>s is
      computed, then the two are animated together using the FLIP technique.
    </p>
    <how-it-works />
    <hr />

    <h2>Guide</h2>

    <h3>Chaining and canceling</h3>
    <p><code>illusory</code> returns a control object.</p>
    <prism-editor
      readonly
      language="js"
      code="{
  // A promise that resolves when the animation has completed.
  // It resolves to a boolean indicating if the animation was canceled.
  finished: Promise<wasCanceled>,
  // A method to cancel the animation.
  cancel: () => void
}"
    />
    <p>Here how that looks in practice:</p>
    <prism-editor
      readonly
      code="let {finished, cancel} = illusory(start, end)

button.onclick = cancel

const canceled = await finished

if (!canceled) {
  // Reverse the direction
  cancel = illusory(end, start)

  button.onclick = cancel
}"
      language="js"
    />

    <chaining-example />

    <h3>Options</h3>
    <h4>duration: <code>string</code></h4>
    <small>default: <code>"300ms"</code></small>
    <p>
      Controls the speed of the animations.
      <br />This can be any CSS <code>&lt;time&gt;</code>.
    </p>
    <prism-editor
      language="js"
      readonly
      code="illusory(start, end, {
  duration: '10s'
})"
    />

    <illusory-example
      :options="{
        duration: '10s'
      }"
    />

    <h4>easing: <code>string</code></h4>
    <small>default: <code>"ease"</code></small>
    <p>
      Controls the speed of the animations.
      <br />This can be any CSS <code>&lt;timing-function&gt;</code>.
    </p>
    <prism-editor
      language="js"
      readonly
      code="illusory(start, end, {
    easing: 'cubic-bezier(.54,-0.5,.36,2)'
})"
    />

    <illusory-example
      :options="{
        duration: '1s',
        easing: 'cubic-bezier(.54,-0.5,.36,2)'
      }"
    />

    <h4>compositeOnly: <code>boolean</code></h4>
    <small>default: <code>false</code></small>
    <p>
      Used to limit the animation to <code>transform</code> and
      <code>opacity</code>. <br />Notice that the the
      <code>border-radius</code> is not animated.
    </p>
    <prism-editor
      language="js"
      readonly
      code="illusory(start, end, {
    compositeOnly: true
})"
    />

    <illusory-example
      :options="{
        duration: '1s',
        compositeOnly: true
      }"
    />

    <h4>zIndex: <code>number</code></h4>
    <small>default: <code>1</code></small>
    <p>Used to set the <code>z-index</code> of the cloned elements.</p>

    <hr />
    <h3>Options.element</h3>
    <p>Options related to the individual <code>IllusoryElement</code>s</p>

    <h4>includeChildren: <code>boolean</code></h4>
    <small>default: <code>true</code></small>
    <p>
      By default, a deep clone is performed so that all the
      <code>ChildNode</code>s are included in the animation.
      <br />
      Set this to <code>false</code> to exclude the <code>ChildNode</code>s
    </p>
    <prism-editor
      language="js"
      readonly
      code="illusory(start, end, {
  element: {
    includeChildren: false
  }
})"
    />
    <illusory-example
      :options="{
        duration: '1s',
        element: {
          includeChildren: false
        }
      }"
    />

    <h4>ignoreTransparency: <code>boolean | string[]</code></h4>
    <small>default: <code>["img"]</code></small>
    <p>
      This one takes little more to explain. So first, lets talk about the
      problem it solves.
      <br />
      <br />
      If we don't account for <code>rgba</code> colors, and the element we're
      ending at has a transparent background, then the element we came from will
      appear to pop out of existence because we can see it underneath. Like
      this:
    </p>
    <illusory-example
      class="ignoreTransparency"
      :options="{
        duration: '1s',
        element: {
          ignoreTransparency: true
        }
      }"
    />
    <p>
      This is why, by default, <i>illusory</i> checks of the ending element has
      a non-opaque background-color.
      <br />
      If it does, illusory will fade the starting element out during the
      animation. Like this:
    </p>
    <illusory-example
      class="ignoreTransparency"
      :options="{
        duration: '1s',
        element: {
          ignoreTransparency: false
        }
      }"
    />
    <p>
      So, why not do this every time? Why check the alpha-channel?
      <br />
      Well, if the ending element doesn't have a transparent background, the
      elements will appear to "dip" in the middle of the animation since
      <code>0.5 * 0.5 = 0.75</code> opacity. That looks like this (black is
      being used to make the issue easier to see):
    </p>
    <illusory-example
      class="ignoreTransparency dip"
      :options="{
        duration: '1s',
        element: {
          ignoreTransparency: false
        }
      }"
    />
    <p>Compare that with this:</p>
    <illusory-example
      class="black"
      :options="{
        duration: '1s'
      }"
    />
    <p>
      You may be wondering, "if it chooses the right one automatically, why
      would I want to ignore transparency?"
      <br />
      The answer is, for elements such as <code>&lt;img></code> or those with
      only a <code>background-image</code>, their
      <code>background-color</code> will be transparent.
      <br />
      <code>ignoreTransparency</code> will accept and boolean or an array of
      element tag-names.
      <br />
      By default, only the transparency of <code>&lt;img></code> tags are
      ignored.
    </p>
    <prism-editor
      language="js"
      readonly
      code="illusory(start, end, {
  element: {
    ignoreTransparency: ['img']
  }
})"
    />

    <h4>
      preserveDataAttributes: <code>boolean | (value: string) => boolean</code>
    </h4>
    <small>default: <code>false</code></small>
    <p>
      By default, all <code>data-*</code> attributes are removed. You can set
      this to <code>true</code> if you want them to be preserved.
      <br />
      Alternatively, you can provide a function that returns
      <code>true</code> if the given attribute should be preserved. This works
      the same as <code>Array.prototype.filter</code>.
      <br />
      <br />
      Note that all <code>data-illusory-*</code> attributes are always
      preserved. So you can store data in these and not have to worry about a
      filter-function.
    </p>

    <h4>attachImmediately: <code>boolean</code></h4>
    <small>default: <code>false</code></small>
    <p>
      By default, if you create an independent <code>IllusoryElement</code>, it
      will not be inserted to the DOM until it is passed to
      <code>illusory</code>. Setting this to true will immediately inserted the
      clone into DOM (this option only has effect on independent
      <code>IllusoryElement</code>s).
    </p>

    <h3>Options.element hooks</h3>

    <h4>
      processClone: <code>(node: Node, depth: number) => Node | void</code>
    </h4>
    <small>default: <code>false</code></small>
    <p>
      This can be used to filter or replace nodes within the clone:
    </p>
    <prism-editor
      language="js"
      readonly
      code="illusory(start, end, {
  element: {
    processClone(node, depth) {
      if (depth > 0) { // Make sure this isn't the root node (e.i. the clone of `el`)
        if (node.tagName === 'VIDEO') // Remove any <video> elements from the clone
          return null
        if (node.dataset.illusoryShouldHide) { // Hide elements with a `data-illusory-should-hide` attribute
          node.style.opacity = '0'
          return node
        }
      }
    }
  }
})"
    />
    <p>Or it can be used to limit the depth of the cloning process:</p>
    <prism-editor
      language="js"
      readonly
      code="illusory(start, end, {
  element: {
    processClone: (node, depth) => depth < 5 ? node : null
  }
})"
    />
    <p>
      This hook is called while creating the clone, and then for every ChildNode
      of the clone (if <code>includeChildren: true</code>). This happens before
      the <code>beforeAttach</code> hook is called.
    </p>

    <h4>
      beforeAnimate: <code>(start: IllusoryElement, end: IllusoryElement)</code>
    </h4>
    <p>
      Called after the clone is appended to the DOM and the natural element has
      been hidden, but before the animation begins.
      <br />
      <br />
      If you return a promise, illusory will wait for the promise to resolve.
    </p>

    <h4>
      beforeDetach: <code>(start: IllusoryElement, end: IllusoryElement)</code>
    </h4>
    <p>
      Called after the animation is completed, but before the clone is removed
      from the DOM.
      <br />
      <br />
      If you return a promise, illusory will wait for the promise to resolve.
    </p>

    <prism-editor
      language="js"
      readonly
      code="illusory(from, to, {
    includeChildren: false,
    async beforeAnimate(from, to) {
        // Show the natural element and hide the clone
        // because by default the clone has already
        // been replaced the natural element
        from.showNatural()
        from.hide()

        // Set the clone to animate opacity
        from.setStyle('transition', 'opacity 0.5s')
        // Force the style changes to be rendered
        from.flushCSS()

        // Show the clone and wait for it fade in
        from.show()
        await from.waitFor('opacity')

        from.hideNatural()
    },
    beforeDetach(from, to) {
        from.hide()

        to.showNatural()

        to.setStyle('transition', 'opacity 0.5s')
        to.hide()

        return to.waitFor('opacity')
    }
})"
    />

    <hr />

    <h3>Independent IllusoryElements</h3>

    <p>
      There are some instances when you'll find it useful to create one half of
      the animation before the other.
      <br />
      For example, when the starting element will be removed from the DOM before
      the ending element is inserted. (Thing Vue/React type routers).
      <br />
      You can create an independent <code>IllusoryElement</code> like this:
    </p>
    <prism-editor
      readonly
      language="js"
      code="import { illusory, IllusoryElement } from 'illusory' // If you use npm

const startEl = document.querySelector('#from')

// Store for later
const start = new IllusoryElement(startEl)

startEl.remove() // No longer in the DOM

const endEl = document.querySelector('#to')

// This still works
illusory(start, endEl)"
    />

    <p>
      You can pass any options that you can normally pass to
      <code>options.element</code> as the second argument.
    </p>
    <prism-editor
      language="js"
      code="new IllusoryElement(startEl, {
  ignoreTransparency: true,
  processClone: (node, depth) => depth < 3 ? node : null
})"
    />
    <hr />
    <h2>IllusoryElement API</h2>

    <h3>Properties</h3>
    <h4>natural: <code>Node</code></h4>
    <p>
      The original element.
    </p>
    <h4>clone: <code>Node</code></h4>
    <p>
      The clone of the natural element.
    </p>
    <h4>rect: <code>DOMRect</code></h4>
    <p>
      The bounding box of the natural element at the time it was cloned.
    </p>
    <h4>isAttached: <code>boolean</code></h4>
    <p>Whether or not the clone is present in the DOM</p>
    <h3>Methods</h3>
    <h4>getStyle(property: string): <code>string</code></h4>
    <p>
      Returns the original style value for the given property.
    </p>
    <blockquote>
      Note: CSS shorthand properties are not supported (background,
      border-radius, etc.). Instead use background-color, background-image,
      border-bottom-right-radius, etc.
    </blockquote>

    <h4>setStyle(property: string, value: string)</h4>
    <p>
      Sets the given css style on the cloned element.
    </p>
    <blockquote>
      Changes made using this method will not be reflected by
      <code>getStyle</code>.
    </blockquote>
    <prism-editor
      language="js"
      code="illusoryElement.clone.style.backgroundColor // #fff

illusoryElement.setStyle('backgroundColor', '#000')

illusoryElement.clone.style.backgroundColor // #000

illusoryElement.getStyle('backgroundColor') // #fff"
    />
    <p>
      That is to say, if the <code>background-color</code> is
      <code>#fff</code> and you call
      <code>setStyle('backgroundColor', '#000')</code>. Then
      <code>getStyle('backgroundColor')</code> will still return
      <code>#fff</code> even though the element's background is actually black.
    </p>

    <h4>waitFor(property: string): <code>Promise&lt;void></code></h4>
    <p>
      Returns a promises that resolves when the cloned element emits a
      <code>"transitionend"</code> event for the given property. If
      <code>"any"</code> is passed, the promise will resolve on the first
      <code>"transitionend"</code> regardless of the property.
    </p>

    <h4>hide()</h4>
    <p>
      Hides the cloned element
    </p>

    <h4>show()</h4>
    <p>
      Hides the cloned element
    </p>

    <h4>hideNatural()</h4>
    <p>
      Hides the natural element
    </p>

    <h4>showNatural()</h4>
    <p>
      Shows the natural element
    </p>

    <h4>flushCSS()</h4>
    <p>
      Forces the browser to apply any style changes that might be queued. Use
      with caution.
    </p>

    <h4>attach()</h4>
    <p>
      Appends the clone as a child of <code>document.body</code>
      and hides the "natural" element.
    </p>

    <h4>detach()</h4>
    <p>
      Removes the clone and cleans up styles applied to the natural element.
    </p>
  </div>
</template>

<script>
import Vue from "vue";
import HowItWorks from "./components/HowItWorks";
import ChainingExample from "./components/ChainingExample";

import { illusory } from "illusory";

export default Vue.extend({
  name: "App",
  components: { HowItWorks, ChainingExample },
  data() {
    return {
      stopLoop: false
    };
  },
  mounted() {
    let start = document.querySelector("#title");
    let end = document.querySelector("#description");

    const loop = async () => {
      await illusory(start, end, {
        beforeDetach() {
          return new Promise(r => setTimeout(r, 1500));
        }
      }).finished;

      [start, end] = [end, start];

      if (!this.stopLoop) loop();
    };

    setTimeout(() => {
      loop();
    }, 1000);
  },
  beforeDestroy() {
    this.stopLoop = true;
  }
});
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #212121;
  padding: 128px 16.5%;
}

html,
body {
  font-size: 16px;
}

* {
  font-size: 1em;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}

h1 {
  font-size: 3.815rem;
  font-weight: 700;
}

h2 {
  font-size: 2.441rem;
  font-weight: 700;
}

code {
  background: #eee;
  border-radius: 4px;
  font-style: italic;
  padding: 2px 5px;
}

h3 {
  font-size: 1.563rem;
  font-weight: 700;
}

h4 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-top: 64px;
}

small {
  font-size: 0.9em;
  color: #333;
}

p {
  line-height: 1.8em;
}

.prism-editor-wrapper,
.prism-editor-wrapper * {
  font-family: "Fira Code", monospace;
  font-weight: 400;
}

.prism-editor-wrapper {
  margin: 16px 0;
}

.example-1 {
  padding: 64px 0;
  .from {
    margin-left: 32px;
    transform: rotate(-45deg);
  }
  .to {
    border-radius: 50%;
  }
}

.ignoreTransparency {
  .to {
    background-color: rgba(255, 127, 80, 0.5) !important;
  }
  &.dip {
    .to,
    .from {
      background-color: rgba(0, 0, 0, 0.99) !important;
      color: #fff;
    }
  }
}

.black {
  .from,
  .to {
    background: #000 !important;
    color: #fff !important;
  }
}

#title,
#description {
  width: auto;
  display: inline-block;
}
</style>
