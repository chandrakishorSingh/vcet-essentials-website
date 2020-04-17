import {OrgModel} from './org.model';

export class NoticeModel {
  constructor(public title: string,
              public startDate: string,
              public endDate: string,
              public createdAt: string,
              public org: OrgModel,
              public pdfURL: string,
              public id: string) {}
}
