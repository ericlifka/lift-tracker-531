import { helper } from '@ember/component/helper';
import { capitalize as cap } from '@ember/string';

export function capitalize([str = ""]) {
  return cap(str);
}

export default helper(capitalize);