import { Config } from './config';
import { UndoRedoHistory } from './history';
import { pluginWrapper, PluginWrapper } from './plugin';
import { IUndoRedoConfig, UndoRedoPlugin } from './types';

export default class VuexUndoRedo {
  private readonly _config: Config;
  private readonly _pluginWrapper: PluginWrapper = pluginWrapper;
  private readonly _history: UndoRedoHistory;

  get plugin(): UndoRedoPlugin{
    return this._pluginWrapper.plugin;
  }
  get history(){
    return this._history;
  }
  constructor(opts: IUndoRedoConfig){
    // 初始化历史记录
    this._history = new UndoRedoHistory({
      capcity: opts?.historyCapcity
    });
    // 初始化配置
    this._config = new Config(opts);
    // 初始化插件
    this._pluginWrapper.init({
      config: this._config,
      history: this._history
    });
  }
}
