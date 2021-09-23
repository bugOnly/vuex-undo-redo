import { cloneDeep, isFunction, isString } from 'lodash';
import { Store } from 'vuex';
import { PKG_NAME } from './common';
import { UndoRedoHistory } from './history';
import { IUndoRedoPluginInitOption, UndoRedoPlugin } from './types';

export class PluginWrapper {
  private _plugin:UndoRedoPlugin;
  private _history: UndoRedoHistory;

  get plugin(){
    return this._plugin;
  }

  public init(opts: IUndoRedoPluginInitOption){
    this._history = opts.history;
    this._plugin = (store: Store<any>) => {
      const {
        module: moduleName,
        moduleFilterReg,
        noTraceMutationTypes,
        needReplaceMutationTypes,
        filter
      } = opts.config;
      // 当前 store 中不包含指定模块，插件无效
      if (isString(moduleName) && !store.hasModule(moduleName)) {
        console.warn(`[${PKG_NAME}][插件无效]：当前 Store 中不包含模块 ${moduleName}`);
        return;
      }

      this._history.init(store);

      const initialState = cloneDeep(moduleName ? store.state[moduleName] : store.state);
      // 记录初始状态
      this._history.flush(initialState);

      store.subscribe((mutation, state: Record<string, any>) => {
        let mutationType = mutation.type;

        if (moduleFilterReg){
          const match = moduleFilterReg.exec(mutation.type);
          // 过滤非指定模块的mutation
          if (!match) {
            return;
          }
          mutationType = match[1];
        }
        // 执行过滤器
        if(isFunction(filter)&&!filter(mutation, state)){
          return;
        }

        // 过滤不跟踪的行为
        if (noTraceMutationTypes.includes(mutationType)) {
          return;
        }
        const snapshoot = cloneDeep(moduleName ? state[moduleName] : state);
        // 不跟踪并且需要记录的行为覆盖当前状态快照
        if (needReplaceMutationTypes.includes(mutationType)) {
          this._history.replaceCurrState(snapshoot);
          return;
        }
        // 仅记录 report 相关state
        this._history.add(snapshoot);
      });
    };
  }
}

export const pluginWrapper = new PluginWrapper();
