export type POST_TYPE = 'event' | 'notice' | 'blog';
export type BRANCH_CODE = 'comp' | 'civil' | 'extc' | 'mech' | 'inst' | 'inft' | 'ash';
export type BRANCH_NAME = 'computer' |
  'civil' |
  'electronics & telecommunications' |
  'mechanical' |
  'instrumentation' |
  'information technology' |
  'applied science & humanities';
export type YEAR = 'FE' | 'SE' | 'TE' | 'BE';
export type DAY = 1 | 2 | 3 | 4 | 5;
export type SEMESTER_CODE = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ORG_TYPE = 'department' | 'committee';
export type ORG_CODE = BRANCH_CODE | 'udaan' | 'council' | 'magazine' | 'csi' | 'ecell' | 'sports' | 'exam' | 'office';
export type ORG_NAME = BRANCH_NAME |
  'udaan' |
  'student council' |
  'magazine' |
  'computer society of india' |
  'e cell' |
  'sports' |
  'exam section' |
  'office';
export type EVENT_CATEGORY = 'current' | 'upcoming';
export type SOCIAL_MEDIA_PLATFORM = 'ig' | 'fb' | 'yt' | 'in' | 'tw';
export type BATCH_CODE = 'A' | 'B' | 'C' | 'D';
export interface EventFilterState {
  orgCode: ORG_CODE;
  eventCategory: EVENT_CATEGORY;
}
