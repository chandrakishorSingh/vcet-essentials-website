import {ORG_CODE, ORG_NAME, ORG_TYPE} from '../types/types';

export class OrgModel {
  constructor(public name: ORG_NAME, public code: ORG_CODE, public type: ORG_TYPE) {}
}
