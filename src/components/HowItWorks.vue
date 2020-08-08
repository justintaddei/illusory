<template>
  <div class="example">
    <div :disabled="playing" v-wave class="play" @click="play">
      <div class="triangle"></div>
    </div>
    <div ref="from" class="from">#start</div>
    <div ref="to" class="to">#end</div>
  </div>
</template>

<script>
import { illusory } from "illusory";
export default {
  props: ["options"],
  data() {
    return {
      playing: false
    };
  },
  methods: {
    async play() {
      this.playing = true;

      const wait = time => new Promise(r => setTimeout(r, time));

      await illusory(this.$refs.from, this.$refs.to, {
        duration: "2s",
        async beforeAnimate(from, to) {
          from.showNatural();
          to.showNatural();

          const originalTransform = to.clone.style.transform;
          to.setStyle("transform", "none");

          from.setStyle("transition", "transform 0.5s, opacity 0.5s");
          to.setStyle("transition", "transform 0.5s, opacity 0.5s");

          from.flushCSS();
          to.flushCSS();

          from.setStyle("transform", "translate(50px, -50px)");
          to.setStyle("transform", "translate(50px, -50px)");
          from.setStyle("opacity", "0.75");
          to.setStyle("opacity", "0.75");

          to.setStyle("border-radius", "50%");

          await to.waitFor("transform");

          await wait(700);

          to.setStyle(
            "transform",
            `translate(${-(to.rect.left - from.rect.left - 50)}px, -50px)`
          );

          await to.waitFor("transform");

          to.setStyle("transition", "all 0.5s");

          to.flushCSS();

          to.setStyle("border-radius", "0");

          await to.waitFor("any");

          to.natural.style.transition = "all 0.3s";
          from.natural.style.transition = "all 0.3s";

          to.natural.style.opacity = "0.25";
          from.natural.style.opacity = "0.25";

          await wait(500);

          from.setStyle("transform", "none");

          await from.waitFor("transform");

          to.setStyle("transform", originalTransform);
          from.setStyle("opacity", "1");
          to.setStyle("opacity", "0");

          await to.waitFor("opacity");

          return wait(500);
        },
        async beforeDetach(from, to) {
          await wait(500);

          to.natural.style.transition = "all 300ms";
          from.natural.style.transition = "all 300ms";

          to.natural.style.opacity = "1";
          from.natural.style.opacity = "1";

          return wait(300);
        }
      }).finished;

      this.playing = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.example {
  height: 150px;
  margin: 32px 0;
  > div {
    width: 150px;
    height: 150px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 1.563rem;

    &.play {
      background: #eee;
      border-radius: 50%;
      margin: 37.5px 32px 0 0;
      width: 75px;
      height: 75px;
      color: #000;
      &[disabled] {
        pointer-events: none;
      }

      .triangle {
        width: 0;
        height: 0;
        border: 17.5px solid transparent;
        border-left: 25px solid currentColor;
        transform: translate(12px, 0);
      }
      transition: box-shadow 0.2s ease;
      &:hover {
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        cursor: pointer;
      }
    }

    &.from {
      background: #40e0d0;
    }
    &.to {
      float: right;
      background: #ff7f50;
      color: #fff;
      border-radius: 50%;
    }
  }
}
</style>
