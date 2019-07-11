import { helper } from '@ember/component/helper';

export function join([str = "", list = []]) {
  return list.join(str);
}

export default helper(join);