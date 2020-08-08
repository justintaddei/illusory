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

      await illusory(this.$refs.from, this.$refs.to, this.options).finished;

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
