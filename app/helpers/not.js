import { helper } from '@ember/component/helper';

export function not([ bool ]) {
  return !bool;
}

export default helper(not);
