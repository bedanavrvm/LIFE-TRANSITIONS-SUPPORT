import { z } from 'zod';

export const requestKinds = ['care', 'callback', 'referral', 'training-group', 'training-private'] as const;
export const requestSchema = z.object({
  kind: z.enum(requestKinds),
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  phone: z.string().trim().regex(/^[+()\d -]{7,25}$/, 'Please enter a contact phone number.'),
  email: z.union([z.email(), z.literal('')]).default(''),
  preferredContact: z.enum(['phone', 'whatsapp', 'email']),
  service: z.string().max(100).default(''),
  course: z.string().max(100).default(''),
  relationship: z.enum(['self', 'family', 'employer', 'professional']),
  ageGroup: z.enum(['adult', 'child', 'not-applicable']),
  area: z.string().trim().max(150).default(''),
  availability: z.string().trim().max(200).default(''),
  message: z.string().trim().max(1500).default(''),
  consent: z.literal(true, { error: 'Please acknowledge how we will use your request.' }),
}).strict().superRefine((data, ctx) => {
  if (data.preferredContact === 'email' && !data.email) ctx.addIssue({ code: 'custom', path: ['email'], message: 'Enter an email address for an email reply.' });
  if (data.kind === 'training-group' && !data.course) ctx.addIssue({ code: 'custom', path: ['course'], message: 'Choose a course.' });
});
export type SupportInput = z.infer<typeof requestSchema>;

export type Service = { id?: number; slug: string; title: string; summary: string; description: string; audience: string; free: boolean; number: string };
export type Course = { id?: number; slug: string; title: string; audience: string; summary: string; details: string; date?: string | null; location?: string | null; capacity?: number | null; price?: number | null; published?: boolean };
export type SiteSettings = { phone?: string; whatsapp?: string; email?: string; responseNote?: string; aboutText?: string };

export const serviceSeed: Service[] = [
  { slug: 'psychological-support', number: '01', title: 'Psychological support', summary: 'Someone to listen. Space to prepare, understand and cope.', description: 'Psychosocial preparation for childbirth and motherhood, counselling for individuals and families facing terminal illness, and guidance on sharing difficult news, including with children. A nurse reviews your request and discusses the right support and any specialist referral with you.', audience: 'Individuals, parents and families navigating change', free: false },
  { slug: 'caregiver-training', number: '02', title: 'Caregiver education & training', summary: 'Practical skills for the people who care for your family.', description: 'Training for domestic managers on childcare and basic resuscitation, nannies on safe baby care, and home caregivers supporting people who are bedridden. Explore group courses or request private training for your household or organisation.', audience: 'Domestic managers, nannies, families and home caregivers', free: false },
  { slug: 'spiritual-bereavement', number: '03', title: 'Spiritual & bereavement support', summary: 'Companionship and family support through loss.', description: 'Complimentary spiritual care includes home visitation following bereavement, support in communicating loss to children, and family therapy and counselling within this service. Share your preferences with the team so support can be approached respectfully. Availability and arrangements are agreed with you.', audience: 'Bereaved individuals, children and families', free: true },
  { slug: 'support-groups', number: '04', title: 'Connection to support groups', summary: 'Find people who understand what you are going through.', description: 'We help connect clients with appropriate peer support groups of people with similar lived experiences. The team discusses available groups, suitability, any costs and information sharing with you before a referral.', audience: 'People seeking connection and shared experience', free: false },
  { slug: 'professional-linkage', number: '05', title: 'Professional health referrals', summary: 'Help finding the right professional for your next step.', description: 'Referral and linkage to qualified health professionals for specialised clinical and therapeutic interventions. The team explains the referral and the receiving professional’s arrangements. A referral request does not guarantee an immediate specialist appointment.', audience: 'Clients, families and professional referrers', free: false },
  { slug: 'home-follow-up', number: '06', title: 'Home follow-up & recovery', summary: 'A little more support when care moves home.', description: 'Structured follow-up after hospital discharge for people living with long-term illness. Visits help assess how the family is coping, reinforce caregiver education and the agreed care plan, and discuss practical adjustments. Coverage, timing and fees are agreed after review.', audience: 'People recovering at home and their caregivers', free: false },
];

export const courseSeed: Course[] = [
  { slug: 'safe-baby-care', title: 'Safe baby care', audience: 'Nannies & families', summary: 'Build confidence in everyday care for a baby.', details: 'An introduction to safe, attentive baby care. Ask the team about the planned curriculum, practical assessment and session arrangements. This preview does not claim an accredited qualification.', published: true },
  { slug: 'childcare-foundations', title: 'Childcare foundations', audience: 'Domestic managers', summary: 'Everyday childcare skills and preparation for emergencies.', details: 'Childcare and basic resuscitation training for domestic managers. Practical delivery, instructor details, assessment and any certificate must be confirmed with the team before registration is finalised.', published: true },
  { slug: 'caring-at-home', title: 'Caring for someone at home', audience: 'Home caregivers', summary: 'Practical support for caring for a person who is bedridden.', details: 'Caregiver education for supporting someone at home in line with their professional care plan. Ask about the curriculum, suitability, practical assessment and session arrangements.', published: true },
];

export function safeCheckoutUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
