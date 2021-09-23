import { isArray, isNumber, isString } from 'lodash';

/**
 * 格式化字符串数组，过滤非字符串元素
 * @param source 
 * @returns 
 */
export function formatStrArr(source:any):string[]{
  if(!isArray(source)){
    return [];
  }
  return source.filter(item => isString(item));
}
/**
 * 格式化历史记录容量
 * @param capcity 
 * @returns 
 */
export function formatHistoryCapcity(capcity:number):number{
  return isNumber(capcity) ? Math.max(1, capcity) : Infinity;
}
