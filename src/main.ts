import Vue from "vue";
import App from "./App.vue";
import VWave from "v-wave";
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// @ts-ignore
import VuePrismEditor from "vue-prism-editor";
import "vue-prism-editor/dist/VuePrismEditor.css"; // import the styles

import IllusoryExample from "./components/IllusoryExample.vue";

Vue.component("prism-editor", VuePrismEditor);
Vue.component("illusory-example", IllusoryExample);

Vue.config.productionTip = false;

Vue.use(VWave);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
