import { MutationPayload, Store } from 'vuex';
import { Config } from './config';
import { UndoRedoHistory } from './history';

export type KeyOf<T extends Record<string, any>, K extends keyof T> = T[K];
/**
 * 配置对象
 */
export interface IUndoRedoConfig {
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
   * @param mutation vuex mutation
   * @param state  vuex state
   */
  filter?: (mutation: MutationPayload, state:Record<string, any>) => boolean;
  /**
   * 历史记录容量，最小值1
   */
  historyCapcity?: number;
}

export type UndoRedoPlugin = (store: Store<any>)=>void;
export interface IUndoRedoPluginInitOption {
  config: Config;
  history: UndoRedoHistory;
}
