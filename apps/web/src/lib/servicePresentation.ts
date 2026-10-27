import type { photography } from './photography';

export type CareIconName = 'conversation' | 'learning' | 'hands' | 'group' | 'connection' | 'home' | 'parenthood' | 'heart' | 'recovery' | 'family' | 'menu' | 'close' | 'arrow-right' | 'external' | 'previous' | 'next' | 'chevron' | 'check' | 'success';
type ServicePresentation = { icon: CareIconName; tone: 'sage' | 'sand'; photo: keyof typeof photography };

const presentations = new Map<string, ServicePresentation>([
  ['psychological-support', { icon: 'conversation', tone: 'sage', photo: 'conversation' }],
  ['caregiver-training', { icon: 'learning', tone: 'sand', photo: 'childcare' }],
  ['spiritual-bereavement', { icon: 'hands', tone: 'sand', photo: 'companionship' }],
  ['support-groups', { icon: 'group', tone: 'sage', photo: 'community' }],
  ['professional-linkage', { icon: 'connection', tone: 'sage', photo: 'consultation' }],
  ['home-follow-up', { icon: 'home', tone: 'sage', photo: 'homeCare' }],
]);
const fallback: ServicePresentation = { icon: 'hands', tone: 'sage', photo: 'companionship' };

export function getServicePresentation(slug: string): ServicePresentation {
  return presentations.get(slug) ?? fallback;
}
