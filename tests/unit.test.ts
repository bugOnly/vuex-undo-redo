import 'jest';
import { last } from 'lodash';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import VuexUndoRedo from '..';

Vue.use(Vuex);

const noTraceMutationTypes = [
  'SET_GENDER'
];
const needReplaceMutationTypes = [
  'SET_AGE'
];

const user = {
  namespaced: true,
  state: {
    name: 'Trump',
    gender: 'male',
    age: 66
  },
  mutations: {
    SET_NAME: (state: any, name: string) => {
      state.name = name;
    },
    SET_AGE: (state: any, age: number) => {
      state.age = age;
    },
    SET_GENDER: (state: any, gender: string) => {
      state.gender = gender;
    }
  }
};
const about = {
  namespaced: true,
  state: {
    content: ''
  },
  mutations: {
    SET_CONTENT: (state: any, content: string) => {
      state.content = content;
    }
  }
};

describe('配置验证', () => {
  it('历史记录最小容量为1', async () => {
    const undoRedo = new VuexUndoRedo({
      historyCapcity: 0
    });
    // @ts-ignore
    expect(undoRedo.history._capcity).toBe(2);
  });
});

describe('功能验证', () => {
  let store: Store<any>;
  let undoRedo:VuexUndoRedo;
  beforeAll(()=>{
    undoRedo = new VuexUndoRedo({
      module: 'user',
      noTraceMutationTypes,
      needReplaceMutationTypes,
      historyCapcity: 3
    });
    store = new Vuex.Store({
      modules: {
        user,
        about
      },
      state: {
        platform: ''
      },
      mutations: {
        SET_PLATFORM: (state: any, platform: string) => {
          state.platform = platform;
        }
      },
      plugins: [undoRedo.plugin]
    });
  });
  it('不订阅noTraceMutationTypes指定的mutation', async () => {
    store.commit(`user/${noTraceMutationTypes[0]}`,'male');
    expect(undoRedo.history.canUndo()).toBe(false);
  });
  it('不订阅但会覆盖记录needReplaceMutationTypes指定的mutation', async () => {
    store.commit(`user/${needReplaceMutationTypes[0]}`,88);
    expect(undoRedo.history.canUndo()).toBe(false);
    // @ts-ignore
    expect(last(undoRedo.history._history)).toEqual(expect.objectContaining({
      name: 'Trump',
      gender: 'male',
      age: 88
    }));
  });

  it('undo操作索引-1', async () => {
    store.commit('user/SET_NAME', 'Trump Junior');
    store.commit('user/SET_NAME', 'Trump Junior 2');
    expect(undoRedo.history.canUndo()).toBe(true);
    // @ts-ignore
    expect(undoRedo.history._currentIndex).toBe(undoRedo.history._history.length-1);

    undoRedo.history.undo();
    // @ts-ignore
    expect(undoRedo.history._currentIndex).toBe(undoRedo.history._history.length - 2);
    undoRedo.history.undo();
    // @ts-ignore
    expect(undoRedo.history._currentIndex).toBe(0);
    expect(undoRedo.history.canUndo()).toBe(false);
  });
  it('redo操作索引+1', async () => {
    store.commit('user/SET_NAME', 'Trump Junior');
    store.commit('user/SET_NAME', 'Trump Junior 2');
    expect(undoRedo.history.canRedo()).toBe(false);
    // @ts-ignore
    expect(undoRedo.history._currentIndex).toBe(undoRedo.history._history.length - 1);

    undoRedo.history.undo();
    expect(undoRedo.history.canRedo()).toBe(true);
    // @ts-ignore
    expect(undoRedo.history._currentIndex).toBe(undoRedo.history._history.length - 2);
  });

  it('超出历史记录容量的时移操作不支持', async () => {
    undoRedo.history.flush({
      name: 'Trump',
      gender: 'male',
      age: 88
    });
    store.commit('user/SET_NAME', 'Trump Junior');
    store.commit('user/SET_NAME', 'Trump Junior 2');
    store.commit('user/SET_NAME', 'Trump Junior 3');
    expect(undoRedo.history.canRedo()).toBe(false);
    expect(undoRedo.history.canUndo()).toBe(true);

    undoRedo.history.undo();
    expect(undoRedo.history.canRedo()).toBe(true);
    expect(undoRedo.history.canUndo()).toBe(true);

    undoRedo.history.undo();
    expect(undoRedo.history.canRedo()).toBe(true);
    expect(undoRedo.history.canUndo()).toBe(true);

    undoRedo.history.undo();
    expect(undoRedo.history.canRedo()).toBe(true);
    expect(undoRedo.history.canUndo()).toBe(false);

    undoRedo.history.redo();
    expect(undoRedo.history.canRedo()).toBe(true);
    expect(undoRedo.history.canUndo()).toBe(true);

    undoRedo.history.redo();
    expect(undoRedo.history.canRedo()).toBe(true);
    expect(undoRedo.history.canUndo()).toBe(true);

    undoRedo.history.redo();
    expect(undoRedo.history.canRedo()).toBe(false);
    expect(undoRedo.history.canUndo()).toBe(true);
  });
});

describe('子模块订阅', () => {
  let store: Store<any>;
  let undoRedo: VuexUndoRedo;
  beforeAll(() => {
    undoRedo = new VuexUndoRedo({
      module: 'user'
    });
    store = new Vuex.Store({
      modules: {
        user,
        about
      },
      state: {
        platform: ''
      },
      mutations: {
        SET_PLATFORM: (state: any, platform: string) => {
          state.platform = platform;
        }
      },
      plugins: [undoRedo.plugin]
    });
  });

  it('不订阅主模块 mutation', async () => {
    store.commit('SET_PLATFORM','ios');
    expect(undoRedo.history.canUndo()).toBe(false);
  });
  it('不订阅未监听的子模块 mutation', async () => {
    store.commit('about/SET_CONTENT', 'content');
    expect(undoRedo.history.canUndo()).toBe(false);
  });
  
});