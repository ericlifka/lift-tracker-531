import { helper } from '@ember/component/helper';

export function eq([ left, right ]) {
  return left === right;
}

export default helper(eq);
