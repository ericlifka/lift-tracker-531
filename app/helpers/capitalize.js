import { helper } from '@ember/component/helper';
import { capitalize as cap } from '@ember/string';

export function capitalize(params) {
  return cap(params[0]);
}

export default helper(capitalize);