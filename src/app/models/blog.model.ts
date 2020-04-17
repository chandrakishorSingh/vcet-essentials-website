import {SocialMediaModel} from './social-media.model';
import {OrgModel} from './org.model';

export class BlogModel {
  constructor(public title: string,
              public blogURL: string,
              public posterURL: string,
              public description: string,
              public featurePoints: string[],
              public org: OrgModel,
              public createdAt: string,
              public id: string,
              public socialMedia?: SocialMediaModel[]) {}
}
