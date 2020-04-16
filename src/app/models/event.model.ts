import {OrgModel} from './org.model';
import {SocialMediaModel} from './social-media.model';


export class EventModel {
  constructor(public description: string,
              public startDate: string,
              public endDate: string,
              public startTime: string,
              public endTime: string,
              public posterURL: string,
              public org: OrgModel,
              public title: string,
              public venue: string,
              public createdAt: string,
              public id: string,
              public socialMedia?: SocialMediaModel[],
              public pdfURL?: string) {}
}
