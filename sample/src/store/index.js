import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import VuexUndoRedo from '../../..';
import content from './module-contnet';

Vue.use(Vuex);

const undoRedo = new VuexUndoRedo({
  module: 'content',
  historyCapcity: 5
});
export const store = new Store({
  modules: {
    content
  },
  plugins: [
    undoRedo.plugin
  ]
});

export const history = undoRedo.history;