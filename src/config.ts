import { isEmpty, isFunction, isString } from 'lodash';
import { IUndoRedoConfig, KeyOf } from './types';
import { formatStrArr } from './utils';

/**
 * 默认过滤器，无任何过滤效果
 * @returns 
 */
const defaultFilter: KeyOf<IUndoRedoConfig, 'filter'> = function(){
  return true;
};

export class Config{
  /**
   * vuex 模块名称
   */
  private _module: string;
  /**
   * 模块过滤正则
   */
  private _moduleFilterReg: RegExp;
  /**
   * 不跟踪的 mutation-types
   */
  private _noTraceMutationTypes: string[]=[];
  /**
   * 覆盖当前记录的 mutation-types
   */
  private _needReplaceMutationTypes: string[] = [];
  /**
   * 过滤函数
   */
  private _filter: KeyOf<IUndoRedoConfig, 'filter'> = defaultFilter;

  get module(){
    return this._module;
  }

  get moduleFilterReg(){
    return this._moduleFilterReg;
  }

  get needReplaceMutationTypes(){
    return this._needReplaceMutationTypes;
  }

  get noTraceMutationTypes(){
    return this._noTraceMutationTypes;
  }

  get filter(){
    return this._filter;
  }

  /**
   * 初始化
   * 
   * 配置初始化后无法更新
   * @param conf 
   */
  constructor(conf: Omit<IUndoRedoConfig, 'historyCapcity'>){
    const { 
      module, 
      noTraceMutationTypes,
      needReplaceMutationTypes,
      filter
    } = conf;

    if(isString(module)&&!isEmpty(module)){
      this._module = module;
      this._moduleFilterReg = new RegExp(`^${module}\/([a-zA-Z0-9\_]+)$`);
    }else{
      this._module = undefined;
      this._moduleFilterReg = null;
    }

    this._noTraceMutationTypes = formatStrArr(noTraceMutationTypes);
    this._needReplaceMutationTypes = formatStrArr(needReplaceMutationTypes);
    this._filter = isFunction(filter) ? filter : defaultFilter;
  }
}
