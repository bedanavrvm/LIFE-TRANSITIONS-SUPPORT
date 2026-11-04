import { z } from 'zod';

export const requestKinds = ['care', 'callback', 'referral', 'training-group', 'training-private'] as const;
export const requestSchema = z.object({
  kind: z.enum(requestKinds),
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  phone: z.union([z.string().trim().regex(/^[+()\d -]{7,25}$/, 'Please enter a contact phone number.'), z.literal('')]).default(''),
  email: z.union([z.email(), z.literal('')]).default(''),
  preferredContact: z.enum(['phone', 'whatsapp', 'email']),
  service: z.string().max(100).default(''),
  course: z.string().max(100).default(''),
  relationship: z.enum(['self', 'family', 'employer', 'professional']).optional(),
  ageGroup: z.enum(['adult', 'child', 'not-applicable']).optional(),
  area: z.string().trim().max(150).default(''),
  availability: z.string().trim().max(200).default(''),
  message: z.string().trim().max(1500).default(''),
  consent: z.literal(true, { error: 'Please acknowledge how we will use your request.' }),
}).strict().superRefine((data, ctx) => {
  if (data.preferredContact !== 'email' && !data.phone) ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Enter a phone number for a call or WhatsApp reply.' });
  if (data.preferredContact === 'email' && !data.email) ctx.addIssue({ code: 'custom', path: ['email'], message: 'Enter an email address for an email reply.' });
  if (data.kind === 'training-group' && !data.course) ctx.addIssue({ code: 'custom', path: ['course'], message: 'Choose a course.' });
});
export type SupportInput = z.infer<typeof requestSchema>;

export type MediaAsset = { id: number; title: string; alt?: string; url?: string; mimeType?: string; filesize?: number; width?: number; height?: number; sizes?: Record<string, { url?: string; width?: number; height?: number }> };
export type ContentMeta = { title?: string; description?: string; image?: MediaAsset | number | null };
export type ContentExtras = { body?: unknown; image?: MediaAsset | number | null; downloads?: (MediaAsset | number)[]; meta?: ContentMeta; _status?: "draft" | "published" };
export type Service = ContentExtras & { id?: number; slug: string; title: string; summary: string; description: string; audience: string; free: boolean; number: string; category?: 'service' | 'package' };
export type Course = ContentExtras & { id?: number; slug: string; title: string; audience: string; summary: string; details: string; date?: string | null; location?: string | null; capacity?: number | null; price?: number | null; published?: boolean };
export type SiteSettings = { meta?: ContentMeta; phone?: string; whatsapp?: string; email?: string; responseNote?: string; aboutText?: string };

export const serviceSeed: Service[] = [
  { slug: 'psychological-support', number: '01', title: 'Psychological support', summary: 'Someone to listen. Space to prepare, understand and cope.', description: 'Support for mental wellness, including children and teenagers, and preparation for weddings, childbirth and parenthood. We support families during pregnancy and after birth, through serious or terminal illness, and with sharing difficult news with children and vulnerable people. Families, schools and other institutions can enquire about suitable support. A nurse reviews your request and discusses the right support and any specialist referral with you.', audience: 'Individuals, children, teenagers, parents, families and institutions', free: false },
  { slug: 'caregiver-training', number: '02', title: 'Caregiver education & training', summary: 'Practical skills for the people who care for your family.', description: 'Training for domestic managers on childcare and basic resuscitation, nannies on safe baby care and emergency preparedness, and home education for family members and caregivers supporting someone who is bedridden. Explore group courses or request private training for your household or organisation. Curriculum, practical assessment and arrangements are discussed with the team; this page does not claim an accredited qualification.', audience: 'Domestic managers, nannies, families and home caregivers', free: false },
  { slug: 'spiritual-bereavement', number: '03', title: 'Spiritual & bereavement support', summary: 'Companionship, spiritual care and family support through loss.', description: 'Complimentary spiritual care includes home visitation following bereavement, support in communicating loss to children, and family therapy and counselling within this service. Free online Christian and Muslim prayer support is also offered for people in distress who would like spiritual support. Share your preferences with the team so support can be approached respectfully. Availability and arrangements are agreed with you.', audience: 'People seeking spiritual support, bereaved individuals, children and families', free: true },
  { slug: 'support-groups', number: '04', title: 'Connection to support groups', summary: 'Find people who understand what you are going through.', description: 'We help connect clients with appropriate peer support groups of people with similar lived experiences. The team discusses available groups, suitability, any costs and information sharing with you before a referral.', audience: 'People seeking connection and shared experience', free: false },
  { slug: 'professional-linkage', number: '05', title: 'Professional health referrals', summary: 'Help finding the right professional for your next step.', description: 'Help connecting with appropriate nurses, doctors and consultants for specialised clinical and therapeutic interventions. Depending on your needs and preferences, the team can also discuss connections to chaplains, imams, community groups and peers. These connections do not imply that the receiving professionals or groups are employees of Life Transitions Support Partners. The team explains the referral and the receiving professional’s arrangements. A referral request does not guarantee an immediate specialist appointment.', audience: 'Clients, families and professional referrers', free: false },
  { slug: 'home-follow-up', number: '06', title: 'Home follow-up & recovery', summary: 'A little more support when care moves home.', description: 'Structured follow-up after hospital discharge for people living with long-term illness. Visits help assess how the family is coping, reinforce caregiver education and the agreed care plan, and discuss practical adjustments. Coverage, timing and fees are agreed after review.', audience: 'People recovering at home and their caregivers', free: false },
  { slug: 'community-support', number: '07', title: 'Community support & home visits', summary: 'A supportive visit when your family is finding its feet.', description: 'Home visits for first-time mothers and families of children with disabilities. The team listens to your family’s circumstances and discusses suitable practical support, education and connections to further help. Coverage, availability, visit arrangements and any fees are agreed with you before you proceed. Post-hospital recovery visits are described separately under Home follow-up & recovery.', audience: 'First-time mothers and families of children with disabilities', free: false },
  { slug: 'sacred-therapy', number: '08', category: 'package', title: 'Sacred Therapy', summary: 'Space for family conversations and preserving meaningful memories.', description: 'Supportive family conversations and memory preservation around serious illness. You can ask the team about family visits and accompaniment during ICU visits or at home. Availability, family wishes, facility permissions and any fees are discussed before arrangements are agreed; an enquiry does not guarantee an immediate visit.', audience: 'People facing serious illness and their families', free: false },
  { slug: 'heart-to-heart-therapy', number: '09', category: 'package', title: 'Heart to Heart Therapy', summary: 'A telephone conversation to share what is on your mind.', description: 'Telephone support to talk through challenges, hear different perspectives and explore possible ways forward. Ask the team how conversations are arranged, who will support you, how your information is handled and whether this package suits your needs. Availability and any fees are agreed before you proceed.', audience: 'People seeking a supportive telephone conversation', free: false },
  { slug: 'letters-of-hope', number: '10', category: 'package', title: 'Letters of Hope', summary: 'Ask us about Letters of Hope and what this package includes.', description: 'Contact the team to learn what Letters of Hope includes and whether it is right for you. The team will explain the format, who provides the support, availability and any fees before you decide to proceed.', audience: 'Anyone wishing to learn more about this package', free: false },
];

export const courseSeed: Course[] = [
  { slug: 'safe-baby-care', title: 'Safe baby care', audience: 'Nannies & families', summary: 'Build confidence in everyday care for a baby.', details: 'An introduction to safe, attentive baby care and emergency preparedness for nannies and families. Ask the team about the planned curriculum, practical assessment and session arrangements. This preview does not claim an accredited qualification.', published: true },
  { slug: 'childcare-foundations', title: 'Childcare foundations', audience: 'Domestic managers', summary: 'Everyday childcare skills and preparation for emergencies.', details: 'Childcare and basic resuscitation training for domestic managers. Practical delivery, instructor details, assessment and any certificate must be confirmed with the team before registration is finalised.', published: true },
  { slug: 'caring-at-home', title: 'Caring for someone at home', audience: 'Home caregivers', summary: 'Practical support for caring for a person who is bedridden.', details: 'Caregiver education for supporting someone at home in line with their professional care plan. Ask about the curriculum, suitability, practical assessment and session arrangements.', published: true },
];

export function safeCheckoutUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
