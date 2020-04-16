import {SOCIAL_MEDIA_PLATFORM} from '../types/types';

export class SocialMediaModel {
  constructor(public url: string, public platform: SOCIAL_MEDIA_PLATFORM) {}
}
