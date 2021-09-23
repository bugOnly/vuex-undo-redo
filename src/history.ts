import { cloneDeep, isEmpty } from 'lodash';
import { Store } from 'vuex';
import { formatHistoryCapcity } from './utils';

export class UndoRedoHistory {
  /**
   * vuex store实例
   */
  private _store: Store<any>;
  /**
   * 历史记录条数容量
   */
  private readonly _capcity: number;
  private readonly _module: string;
  /**
   * 历史记录数组
   */
  private _history: Record<string, any>[] = [];
  /**
   * 当前索引
   */
  private _currentIndex = -1;

  constructor(opts?: {
    module?: string;
    capcity: number;
  }) {
    // 此处加1的原因是在 init 的同时 push 一条初始记录的 history，同样占用容量
    this._capcity = formatHistoryCapcity(opts?.capcity) + 1;
    this._module = opts?.module;
  }
  /**
   * 初始化 store
   * @param store 
   */
  public init(store: Store<any>) {
    this._store = store;
  }
  /**
   * 清空历史
   * @param state 入参不为空则清空后push此条记录
   */
  public flush(state?: Record<string, any>) {
    this._history = [];
    state && this._history.push(state);
    this._currentIndex = 0;
  }
  /**
   * 增加一条历史记录
   * @param state 
   */
  public add(state: Record<string, any>) {
    let currLen = this._history.length;
    if (currLen >= this._capcity) {
      this._history.splice(0, 1);
      currLen = this._capcity - 1;
      this._currentIndex = Math.max(this._currentIndex - 1, 0);
    }
    // 如果当前索引不是最新记录，则抛弃当前索引之后的所有记录
    if (this._currentIndex + 1 < currLen) {
      this._history.splice(this._currentIndex + 1);
    }
    this._history.push(state);
    // 添加记录后将索引指向最新记录
    this._currentIndex++;
  }
  /**
   * 替换当前历史记录，无副作用
   * @param state 
   */
  public replaceCurrState(state: Record<string, any>) {
    this._history[this._currentIndex] = state;
  }
  /**
   * 撤销操作
   */
  public undo() {
    const prevState = this._history[this._currentIndex - 1];
    if (isEmpty(prevState)) {
      return;
    }
    const snapshoot = cloneDeep(!!this._module ? {
      ...this._store.state,
      [this._module]: prevState
    } : {
      ...this._store.state,
      ...prevState
    });
    // 替换 report state的历史记录
    this._store.replaceState(snapshoot);
    // 索引回退一格
    this._currentIndex--;
  }
  /**
   * 恢复操作
   */
  public redo() {
    const nextState = this._history[this._currentIndex + 1];
    if (isEmpty(nextState)) {
      return;
    }
    const snapshoot = cloneDeep(!!this._module ? {
      ...this._store.state,
      [this._module]: nextState
    } : {
      ...this._store.state,
      ...nextState
    });
    this._store.replaceState(snapshoot);
    this._currentIndex++;
  }
  /**
   * 返回是否可撤销
   * @returns 
   */
  public canUndo(): boolean {
    return !isEmpty(this._history[this._currentIndex - 1]);
  }
  /**
   * 返回是否可恢复
   * @returns 
   */
  public canRedo(): boolean {
    return !isEmpty(this._history[this._currentIndex + 1]);
  }
}
