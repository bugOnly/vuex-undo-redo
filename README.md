## Vuex-Undo-Redo

时移操作(撤回/恢复)插件，支持 Vuex v3。

[![license](https://img.shields.io/github/license/bugOnly/vuex-undo-redo.svg?style=plastic)](https://github.com/bugOnly/vuex-undo-redo/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/@bugonly/vuex-undo-redo.svg?style=plastic)](https://www.npmjs.com/package/@bugonly/vuex-undo-redo)

### 安装
```bash
# npm
npm install @bugonly/vuex-undo-redo
# yarn
yarn add @bugonly/vuex-undo-redo
```

### 使用
```js
import Vue from 'vue';
import Vuex from 'vuex';
import VuexUndoRedo from '@bugonly/vuex-undo-redo';

Vue.use(Vuex);

const undoRedo = new VuexUndoRedo({
  module: 'user',
  historyCapcity: 10
});

const store = new Vuex.Store({
  modules: {
    user
  },
  // 引入插件
  plugins: [undoRedo.plugin]
});

// 撤回操作
undoRedo.history.undo();
// 恢复操作
undoRedo.history.redo();
```

### 配置
```ts
interface VuexUndoRedo{
  new(opts:IUndoRedoConfig):VuexUndoRedo;
}
```
`VuexUndoRedo`类的入参配置`opts`结构如下：
```ts
interface IUndoRedoConfig {
  /**
   * 模块名称
   * 如果指定模块则过滤此模块之外的所有 mutation
   */
  module?: string;
  /**
   * 不跟踪的 mutation-type 清单
   */
  noTraceMutationTypes?: string[];
  /**
   * 此列表中的 mutation-type 行为不跟踪，但是会覆盖当前历史记录
   */
  needReplaceMutationTypes?: string[];
  /**
   * 过滤器，返回 false 时不执行后续逻辑
   * 使用 filter 可以编写更复杂的过滤逻辑
   * @param mutation
   * @param state
   */
  filter?: (mutation: MutationPayload, state:Record<string, any>) => boolean;
  /**
   * 历史记录容量，最小值1
   */
  historyCapcity?: number;
}
```

### API
`VuexUndoRedo`的实例暴露两个属性：
- `plugin`：插件函数，用于 Vuex 创建 Store 时使用；
- `history`：时移操作的对象。

#### `history.canUndo()`

判断是否可以撤回操作，返回 boolean 值。

#### `history.canRedo()`

判断是否可以恢复操作，返回 boolean 值。

#### `history.undo()`

执行撤回操作，回退到上一步。

#### `history.redo()`

恢复操作，前进到下一步。

#### `history.flush(snapshoot?:any)`

清空历史记录，如果入参 `snapshoot` 不为空，则清空历史记录后将此快照对象塞入记录。
> 此方案常用于记录 state 初始值。