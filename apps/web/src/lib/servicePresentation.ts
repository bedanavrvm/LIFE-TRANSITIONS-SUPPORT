import type { photography } from './photography';

export type CareIconName = 'conversation' | 'learning' | 'hands' | 'group' | 'connection' | 'home' | 'parenthood' | 'heart' | 'recovery' | 'family' | 'menu' | 'close' | 'arrow-right' | 'external' | 'previous' | 'next' | 'chevron' | 'check' | 'success';
type ServicePresentation = { icon: CareIconName; tone: 'cream' | 'champagne'; photo: keyof typeof photography };

const presentations = new Map<string, ServicePresentation>([
  ['psychological-support', { icon: 'conversation', tone: 'cream', photo: 'conversation' }],
  ['caregiver-training', { icon: 'learning', tone: 'champagne', photo: 'childcare' }],
  ['spiritual-bereavement', { icon: 'hands', tone: 'champagne', photo: 'companionship' }],
  ['support-groups', { icon: 'group', tone: 'cream', photo: 'community' }],
  ['professional-linkage', { icon: 'connection', tone: 'cream', photo: 'consultation' }],
  ['home-follow-up', { icon: 'home', tone: 'cream', photo: 'homeCare' }],
  ['community-support', { icon: 'family', tone: 'champagne', photo: 'community' }],
  ['sacred-therapy', { icon: 'hands', tone: 'champagne', photo: 'companionship' }],
  ['heart-to-heart-therapy', { icon: 'conversation', tone: 'cream', photo: 'conversation' }],
  ['letters-of-hope', { icon: 'heart', tone: 'champagne', photo: 'companionship' }],
]);
const fallback: ServicePresentation = { icon: 'hands', tone: 'cream', photo: 'companionship' };

export function getServicePresentation(slug: string): ServicePresentation {
  return presentations.get(slug) ?? fallback;
}
