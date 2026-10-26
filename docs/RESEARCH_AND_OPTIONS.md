# Research and options

First recorded: 2026-10-26. Last updated: 2026-10-26.

This document consolidates the substantive brainstorming in the founder's supplied conversation and the subsequent research discussion. It is a structured record, not a verbatim transcript or a final implementation specification.

Current update: the user has selected Astro with Payload, nurse review before care confirmation, and both group/private training. A runnable local MVP was subsequently authorised. Earlier comparisons below are retained as history; use [the decision register](DECISIONS.md) and [MVP plan](MVP_PLAN.md) for current choices and behaviour.

Use [the decision register](DECISIONS.md) to determine what has been selected. Use [the business brief](BUSINESS_BRIEF.md) for the original service wording. An option described here is not automatically a requirement.

## Research method and limits

- The earlier pasted conversation has no known original date. Source checks in this workspace were performed on 2026-10-26.
- Current technical findings below rely on primary documentation. Website observations rely on the organisations' published pages. Proposed adaptations, visual fit, and architecture preferences are the assistant's judgments.
- These are reference candidates, not a ranking established through a rendered visual audit. Page extraction can reveal content, links, labels, and form structure; it cannot establish actual visual quality, responsive behaviour, contrast, keyboard usability, or performance.
- A browser screenshot attempt was blocked by the environment's approval policy. No screenshot, device, screen-reader, or completed reference-site form/payment testing is claimed.
- The source websites' descriptions of their services are their own claims. They are used to understand presentation patterns, not to endorse providers or establish their suitability for a Kenyan client.
- Prices, provider onboarding, supported payment methods, product maintenance, and legal obligations need fresh verification before implementation or purchase.
- Some primary pages were unavailable to the research tool. Such cases are distinguished from sources whose content was retrieved or search-indexed.
- At the original research stage, no application prototype or benchmark had been performed. The later local MVP adds application validation, recorded in the README; it does not establish production deployment, organisation-specific legal compliance or clinical-content review.

## Discussion progression

| Stage | What was discussed | How to interpret it now |
| --- | --- | --- |
| Founder brief | A nurse-led Nairobi initiative supporting major life transitions through six service areas. | Authoritative founder-supplied business wording; capabilities and outcomes are not independently verified. |
| Initial request | Research at least seven relevant websites and brainstorm methods, stacks, themes, and UI without coding. | Sets the discovery scope. The eight references below address the research request within the stated evidence limits. |
| Design systems | Atlassian, Carbon, Material 3 Expressive, NHS/GOV.UK patterns, and Radix/shadcn were compared. A small custom system was recommended. | Comparative judgments and options, not adopted dependencies. |
| Initial stack comparison | Wagtail, Astro with a headless CMS, Next.js with Payload, WordPress, Webflow, and Framer were compared. Wagtail was initially preferred. | Historical alternatives remain relevant; the preferred public frontend later became Astro. |
| Early phasing | Brochure/contact first; training/resources next; payments, translations, and a referral portal later. | Payment deferral and a blanket brochure-only launch were superseded by the user's launch clarification. Other future ideas remain unapproved possibilities. |
| Frontend preference | The supplied conversation ends with "ASTRO IS GOOD". | Astro preference is confirmed; the rest of the stack is not. |
| Launch clarification | The user chose "all of the above" for browsing/contact, callback/training enquiries, detailed intake, appointment booking, and payments. | Preserve these launch capabilities; their operating rules remain open. |
| Editing clarification | The user selected a simple editor for the nurses. | A content-editing interface is required; developer-managed files alone are insufficient. |
| Audience delegation | The user asked the assistant to choose the homepage audience, with the option to request a change. | Families lead as a delegated default, with training and professional referral routes. |
| Stack and workflow selection | The user selected Astro/Payload, nurse review before care confirmation and both group/private training formats. | These are confirmed choices, replacing the earlier open shortlist and booking proposal. |
| Runnable MVP clarification | The user asked to implement the initial MVP plan and clarified that this means building the application. | Local implementation is authorised, with operating details and production integrations still to resolve. |
| Documentation instruction | The user requested complete documentation and a researched AGENTS.md before continuing, then approved implementation of that documentation plan. | This five-file foundation records the discussion. It does not authorise building the application yet. |

## Website reference research

Access date for the reference pages and linked observations in this section: 2026-10-26.

### Eight reference websites

| Website | Relevant published content or structure | Proposed adaptation | Caution when adapting |
| --- | --- | --- | --- |
| [Marie Curie](https://www.mariecurie.org.uk/) | Separate entry points for people living with terminal illness, carers, healthcare professionals, and supporters; an information library and services information. | Use recognisable situations and audience routes. Make practical answers easy to reach. | Its fundraising prominence and large information architecture are not automatically appropriate for a new care service. |
| [Sue Ryder](https://www.sueryder.org/) | Distinct grief-support and end-of-life-care routes, service explanations, nursing imagery, and personal stories. | Give bereavement a clear identity within the broader service and explain support gently. | Campaigns, shops, fundraising, and community features reflect its scale; they are not launch requirements here. |
| [Dougy Center](https://www.dougy.org/) | Resources for children, teenagers, young adults, parents/caregivers, and supporters, alongside training and support-group information. | Organise guidance about loss around the person being supported and their age or role. | A smaller initial menu would better suit this project's scope. Imported content would need permission and local professional review. |
| [Home Instead](https://www.homeinstead.com/) | An enquiry flow asks who needs care, what help is needed, timing, location, and contact information. | Use understandable questions and explain the contact process. Offer a direct contact route alongside forms. | The multi-step commercial flow is not automatically the right intake model for grief, spiritual support, or a small Nairobi team. |
| [St Christopher's](https://www.stchristophers.org.uk/) | Patient, carer, and professional routes; home support, bereavement resources, education, and a referral link. | Separate receiving support, learning, and referring while keeping them under one identity. | Its extensive menu, fundraising, and institutional services should not be copied wholesale. |
| [Changent](https://changent.org/) | A unified organisation presents Child First and Nurse-Family Partnership, family routes, impact material, stories, and partners. | Explain how different services serve one family-centred purpose. | Its national advocacy and fundraising priorities differ from a new local service. |
| [Jacaranda Maternity](https://www.jacarandamaternity.co.ke/) | Nairobi maternal/family-care context, appointment links, service categories, hours, and locations; its [contact page](https://www.jacarandamaternity.co.ke/contact) includes phone and WhatsApp routes. | Make service location, availability, contact, and the next step concrete. | It is a maternity hospital. Its clinical scope, emergency capability, availability, pricing, and outcome claims must not be transferred to this initiative. |
| [Nairobi Hospice](https://nairobihospice.or.ke/) | Home care, education, clinical care, spiritual/bereavement support, and outreach appear in its service structure. Its [bereavement page](https://nairobihospice.or.ke/department/bereavement-support/) describes caregiver and family support. | Study this as the closest local service overlap, particularly the relationship between care, training, and family support. | Local relevance does not establish a visual or technical standard; the service boundaries still belong to each organisation. |

Nairobi Hospice also publishes [training for non-healthcare providers](https://nairobihospice.or.ke/palliative-care-training/), a useful local reference for explaining the intended training audience. Its claimed recognition or standards do not establish accreditation for this project's courses.

The assistant's suggested starting references for visual exploration were Changent, Sue Ryder, and Home Instead. For service structure, the suggested starting references were St Christopher's, Dougy Center, and Nairobi Hospice. These are recommendations to explore, not a completed aesthetic comparison.

For additional brand context, [Mission Minded's Changent case study](https://mission-minded.com/work/changent/) describes the organisation's unified identity and website work. It is an agency-authored account, not independent evidence of conversion or usability results.

### Additional candidates and access limits

- [Cruse Bereavement Support](https://www.cruse.org.uk/get-support/) was considered for grief content and support pathways. Search-indexed content was available, but direct retrieval returned 403. It is supplementary rather than one of the eight fully extracted reference pages.
- [CaringBridge](https://www.caringbridge.org/) returned no usable extracted page content. No current layout or workflow finding is attributed to it.
- [Kenya Hospices and Palliative Care Association](https://kehpca.org/) could not be retrieved successfully. No current website-design finding is attributed to it.

Future reference work should inspect desktop and mobile layouts directly, then compare first-contact clarity, typography, navigation, imagery, loading behaviour, keyboard use, and forms. That work remains outstanding.

## Proposed positioning and navigation

Status: proposal, except that families leading the homepage is the delegated default in D01.

### Positioning

The connecting idea is helping a family through an unfamiliar or difficult transition. Individual services should make that purpose concrete instead of appearing as an unrelated catalogue.

"Hospitality-inspired" was discussed as a feeling of welcome, attention, comfort, and dignity. It should support clear service information, credentials, availability, and next steps.

The supplied formal business description is suitable as source material. Public copy can be shorter and more familiar while retaining the service boundaries and commitments.

### Proposed homepage introduction

> Support for your family through life's major changes.
>
> Nurse-led care, guidance and practical support in Nairobi through parenthood, illness, caregiving, recovery and loss.
>
> Find support | Explore caregiver training

This is draft website copy. It does not replace the original tagline:

> No one should navigate life's transitions alone.

### Situation-led entry points

| Visitor situation | Relevant source services |
| --- | --- |
| Preparing for a baby or adjusting to parenthood | Psychological support, health education, nanny/domestic-manager training, and professional linkage when appropriate. |
| Caring for someone at home | Caregiver education, home follow-up, peer support linkage, and professional referrals. |
| Recovering after hospital discharge | Continuity of care, caregiver guidance, education, and appropriate referrals. |
| Living with serious illness | Psychological and family support, home follow-up, spiritual support if wanted, and specialist linkage. |
| Coping with loss or supporting a grieving child | Bereavement support, sensitive communication guidance, complimentary spiritual-care activities, and appropriate group/professional linkage. |

These routes may overlap. They are navigation proposals, not new services or a clinical triage algorithm.

### Page and navigation ideas

- Main navigation: Get support, Caregiver training, Resources, About us, and Contact.
- A visible professional route: Refer someone or Refer a family.
- Service detail pages: intended audience, support offered, provider qualifications, delivery format, availability/coverage, free or paid status, and what happens next.
- Training detail pages: target learner, outcomes, duration, prerequisites, practical assessment, dates, price, and accurately described certification.
- Supporting information: team, FAQs, privacy, accessibility information, and contact/response expectations.
- Resource and event pages were suggested; the scale of any library, search, filters, or events platform remains open.

A proposed homepage sequence is a short introduction, situation entry points, an explanation of the support process, nurse/team credibility, clearly scoped training/free services, and contact/FAQ information. There is no approved wireframe or fixed route inventory.

### Trust and tone

- Explain who provides each service and which services require referral.
- Use genuine credentials and consented stories or photographs; do not fill gaps with invented testimonials or partner logos.
- Keep grief and serious-illness content gentle, without forced cheerfulness or pressure to purchase.
- Present spiritual support respectfully, accommodating the person's preferences; the founder has not specified a single faith identity.
- Prefer supportive language over language that could sound punitive. For example, helping caregivers put the care plan into practice was suggested as public-facing wording for the formal compliance language.
- Explain practical financial guidance accurately and resolve the meaning of "provider illness" before rewriting it.

## Visual directions

The warm direction was adopted for the local visual refresh in C12/C13. The other directions below remain alternatives; this table preserves the original comparison. Production identity and final logo still need review.

| Direction | Proposed visual ingredients | Benefit | Design risk to check |
| --- | --- | --- | --- |
| Warm and grounded | Cream surfaces, deep green, restrained terracotta, real Kenyan family/home photography, soft serif headings, clear sans-serif body text. | The assistant's preferred direction for welcome and professional reassurance. | Pale or muted colours can fail contrast; decorative typography can make forms harder to read. |
| Calm professional care | Off-white, deep blue, sage accents, orderly layouts, clear typography, prominent credentials and process explanations. | A direct, reassuring clinical association. | Can feel institutional without warm imagery and writing. |
| Community and hope | Plum, warm sand, restrained apricot, community stories, and a consistent illustration style where appropriate. | Can express breadth, connection, and approachability. | Illustration and cheerful colour need careful treatment around illness and grief. |

The original image recommendation was authentic Kenyan people and homes with informed permission and respectful framing. C13 subsequently selects licensed stock now, with organisation photography as a later replacement. Avoid treating stock images as evidence of the actual team, clients or location.

The original typography recommendation was highly legible body and form text, restrained heading personality, readable line lengths, and clear hierarchy. Lora and DM Sans were subsequently selected and their licences checked for the refresh below.

The original motion recommendation was restrained feedback and transitions respecting reduced-motion preferences. C14/C15 subsequently select gentle desktop homepage snapping/parallax and a direction-aware sticky header. Autoplay video and an animation library remain outside scope.

Single light theme, dark mode, and a high-contrast option were discussed. Their necessity is open; an accessible default experience should be designed and tested regardless of optional themes.

### Adopted local visual refresh

Selected after the user described the initial build as lacking photos, hard to read, and too rigid; the user then authorised implementation of the proposed refresh. These are implementation choices for the local public website, not a production launch or a change to clinical services.

- Warm cream/deep green/terracotta colours, Lora headings and DM Sans body text. Body text scales from 18px to 20px; navigation/buttons/form labels are at least 16px; secondary copy is at least 14px. These are design defaults, not a claim that font size alone establishes accessibility.
- A family photograph replaces the illustrated hero. Asymmetric framing, a small overlapping caption, lighter situation links, a caregiving photo alongside the support process, and photo-led training previews provide variety. Decorative shapes contain no information. Meaningful text stays on solid backgrounds.
- Shared typography applies throughout the public pages, including support, training, service, contact and payment pages. That initial refresh preserved intake behaviour; C16 later simplifies the first enquiry as recorded below. Payment workflows and staff access remain unchanged.
- The initial refresh used restrained CSS hover transitions. The later scrolling/layout pass extends those behaviours as recorded below, preserving the reduced-motion override. No animation library, autoplay media, CMS image-upload feature or client-side gallery is introduced.
- Photography is imported locally and served through Astro's responsive WebP image handling with explicit dimensions, eager hero loading and lazy supporting images. Fonts are self-hosted WOFF2 with swap behaviour; visitors do not fetch these assets from Pexels or Google.
- The original family illustration is retained as an unused asset, preserving the earlier direction without presenting it as the current hero.

#### Scrolling, depth and page structure

The user selected gentle snapping plus parallax on desktop, with ordinary touch scrolling on phones, then authorised the accompanying layout plan. C14/C15 extend the initial photo/typography refresh rather than replacing its content or fonts.

- At widths above 1100px and with no reduced-motion preference, the homepage uses native vertical proximity snapping at six major sections and the footer. Sections keep their content-led heights; long content remains reachable. There is no wheel/touch interception, mandatory snapping or nested full-screen scroller. Content pages and forms do not snap.
- Native CSS view timelines add depth to the hero and care-process photo frames, ranging from +12px to -12px, and move decorative layers by up to 24px. Unsupported browsers retain static compositions. These effects are disabled on smaller screens and under reduced motion.
- The full-width sage header is sticky. Beyond its own height, accumulated downward travel of 24px hides it; upward travel of 12px reveals it. Small reversals do not immediately toggle it. Keyboard focus inside the header, an open mobile menu, proximity to the top, and reduced-motion preference keep it visible. Without JavaScript it remains visibly sticky. A small native controller schedules scroll updates with animation frames, measures header height for anchor offsets, and resets on restored-page entry.
- Homepage bands alternate cream, near-white, sage, warm sand, green and near-white. The footer uses deep green with warm light text and its own legal divider. Original botanical and embracing/home/heart line art decorates available desktop gutters; it is non-interactive, contains no content and disappears when space is limited.
- Clickable situation links and buttons gain a small lift and a stronger soft shadow on fine-pointer hover. Navigation/text links gain clearer colour and underline changes. Focus outlines and raised focus states provide keyboard feedback. Informational panels use static shadows; course/service panels strengthen their shadow when their actual link is hovered or focused. Hover movement respects reduced motion.
- Approach, service detail, training detail, contact, resources and privacy pages use the existing 1280px container with article/aside slots. Paragraphs remain capped around 65 characters. Side panels contain existing photographs, audience/fee/session information, actions or section navigation. Below 1101px the article and side panel stack in source order. Payment, confirmation and error pages retain compact message layouts.
- CMS/API schemas, permissions, contact/provider details and the care/payment workflows do not change. Original SVG artwork is local; existing photography and font sources remain as registered below.

Primary references accessed on **2026-10-26**:

| Reference | Supported finding and implementation consequence |
| --- | --- |
| [W3C CSS Scroll Snap specification](https://www.w3.org/TR/css-scroll-snap-1/) | Proximity snapping lets the browser choose whether a nearby position should settle; the exact feel is browser-dependent. Native behaviour preserves ordinary scrolling rather than enforcing page steps. |
| [MDN animation-timeline reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) | View timelines support scroll-driven animation but have limited availability. Guard the enhancement with feature detection and retain a static fallback. |
| [W3C reduced-motion technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) | Interaction-triggered motion can be disabled according to user preference. This implementation disables parallax/snapping and keeps the header stationary under reduced motion. |
| [W3C Focus Not Obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | Sticky layers can obscure focused controls. Keep skip navigation above the header, show navigation on focus and offset scrolling by measured header height. |

These references inform implementation; they do not establish whole-site accessibility. Cross-browser snap feel, physical touch devices and screen readers require separate review.

#### Short first enquiry and text hierarchy

Adopted under C16/C17 on **2026-10-26**, after the user selected a short first enquiry and authorised implementation. This replaces the original twelve-field public form rather than changing the six service areas, nurse review or payment workflow.

- Five core inputs: reason for contact, name, reply method, its phone number or email address, and a short optional message. Privacy acknowledgement is still required. Care, callback, referral, group training and private training retain their existing request kinds and URLs.
- Selecting email reveals and requires email only; selecting phone or WhatsApp reveals and requires a phone number. Hidden alternatives are disabled, and the server uses only the chosen contact. Staff writes also require the contact appropriate to the selected method. Email-only records can be reviewed without supplying a phone.
- Known service/course links retain their valid context in a compact summary. Only training enquiries reveal the course selector; group training requires a course, while private training can ask for advice. Unavailable incoming context is discarded, and an unavailable submitted course receives an understandable error.
- Relationship, age category, area and availability are deferred to nurse follow-up. The existing staff fields and detailed records remain available; missing relationship/age are not filled with invented self/adult defaults. The validated legacy fields remain accepted for older callers.
- A small native script manages the conditional controls without dependencies or a multi-step wizard. Without JavaScript, labelled contact/course alternatives and completion instructions remain visible; server validation applies the chosen method and request kind. Typed active values, context and privacy selection survive validation and backend errors. Inline errors are associated with their controls, a linked summary receives focus, and the page title indicates a request needs checking.
- The support introduction is shorter, its repeated form heading is removed, and the sidebar explains the next steps in two items. It retains complimentary spiritual/bereavement information and the emergency boundary. No response-time promise or live operational contact is invented.
- The global preview banner and its styles are removed. Demo mode still adds noindex/nofollow, disables checkout and shows a brief fictional-details reminder inside the form. Removing the banner does not authorise live intake.
- Existing local fonts are retained: Lora 500 for main/section headings, DM Sans 600 for smaller headings/cards/labels, and DM Sans 400 for body text. Main headings scale around 40–72px and section headings around 30–48px; body text stays 18–20px. Leads are larger than body text; form helpers use 15px with clear spacing and contrast. Existing shadows, photographs, colour bands and scrolling behaviour remain.
- Shared validation and Payload nullability change without deleting fields or resetting development data. An ignored SQLite backup is taken before the local schema update. Request state is still computed on the server, and intake allowlisting, honeypot, rate limiting and private-record permissions are preserved.

Primary references accessed on **2026-10-26**: [W3C form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/) supports clear labels and associated instructions; [W3C user notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) supports concise feedback, inline errors and linked error lists. These inform the implementation; they do not establish whole-site accessibility or replace nurse usability and assistive-technology testing.

The former up-front demographic/availability questions and global preview banner remain recorded as superseded choices S07/S08. Public launch requirements, final privacy review, and detailed follow-up collection rules remain open.

#### Photography asset register

All source pages and the [Pexels licence](https://www.pexels.com/license/) were accessed on **2026-10-26**. The licence permits website use and modification, does not require attribution, and prohibits implying endorsement or portraying identifiable people offensively. Credits are retained here for provenance. Photographs illustrate family life and support; they do not identify actual staff or clients, establish a person's health condition, or document a Kenyan location.

| Local source asset | Photographer and original page | Current use |
| --- | --- | --- |
| `family.jpg` | August de Richelieu — [Family gathering for a group hug](https://www.pexels.com/photo/family-gathering-for-a-group-hug-4262424/) | Homepage hero. |
| `companionship.jpg` | Kampus Production — [Woman assisting elderly man](https://www.pexels.com/photo/woman-assisting-elderly-man-7551667/) | Support-process section, approach page and generic fallback for newly added courses. |
| `home-care.jpg` | Kampus Production — [Woman and elderly man sitting on bed](https://www.pexels.com/photo/woman-and-elderly-man-sitting-on-bed-7551671/) | Home-care training and follow-up detail. |
| `childcare.jpg` | Keira Burton — [Woman caring for her children](https://www.pexels.com/photo/woman-caring-for-her-children-6624421/) | Childcare training and caregiver-training service detail. |
| `baby-care.jpg` | William Fortunato — [Black mother hugging baby on hands](https://www.pexels.com/photo/black-mother-hugging-baby-on-hands-6392860/) | Baby-care training. |

The source JPEGs are under `apps/web/src/assets/photos/`. Course photographs are selected by slug rather than collection order, so editorial reordering retains the correct association. Replacing a photograph requires updating its asset, alternative text, crop and this register. Later organisation photography requires appropriate permission before use.

#### Font provenance

Accessed **2026-10-26**: [DM Sans's SIL Open Font License](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt) and [Lora's SIL Open Font License](https://github.com/google/fonts/blob/main/ofl/lora/OFL.txt). Latin WOFF2 files were retrieved through the official Google Fonts CSS endpoint for DM Sans weights 400–700 and Lora normal/italic weights 400–500. Only the necessary styles/subsets are included. Licence copies ship beside the fonts in `apps/web/public/fonts/`.

Responsive browser review, font/image loading, doubled-text reflow, keyboard access and reduced-motion checks support this refresh's acceptance. They do not replace screen-reader or physical-device testing; exact results are recorded in the MVP plan and README.

## Design systems and components

### Systems discussed

Access date for the checks identified below: 2026-10-26. Fit assessments are design judgments, not limitations imposed by the systems.

| System or method | Original discussion | Current interpretation and evidence |
| --- | --- | --- |
| Atlassian | Borrow semantic tokens; the earlier assistant judged its product-oriented components a poor default visual fit. It mentioned React/TypeScript and @atlaskit packaging. | Semantic-token thinking is supported by [Atlassian's token documentation](https://atlassian.design/foundations/tokens/). The exact packaging claim was not rechecked and is not a dependency decision. Components can be restyled; visual fit alone does not force a framework. |
| IBM Carbon | Borrow tokens and theme structure; the earlier assistant described React/web-component options and White, g10, g90, and g100 themes, and judged the default appearance corporate. | Those library/theme details remain inherited claims. The [official theme reference](https://carbondesignsystem.com/guidelines/themes/overview/) could not be retrieved successfully in this research. Verify before relying on exact current offerings. Carbon has not been selected or technically ruled out. |
| Material 3 Expressive | Consider softer shapes, palette tools, and restrained motion as inspiration. The earlier assistant referred to an original web project on hold and a community fork. | Visual inspiration does not require adopting Material components. The [Material Web repository](https://github.com/material-components/material-web) currently states that MWC is in maintenance mode pending new maintainers. This check does not establish the status or suitability of every Material-related project or any particular fork. |
| NHS and GOV.UK | Borrow clear forms, errors, skip links, content patterns, and accessibility practices; retain original Kenyan branding. | The [NHS design system](https://service-manual.nhs.uk/design-system) provides styles, components, and patterns and advertises version 10. [GOV.UK explicitly explains](https://design-system.service.gov.uk/accessibility/) that using its system still requires service-specific research, design, development, and testing. No UK branding or affiliation should be implied. |
| Radix and shadcn/ui | Accessible primitives and adaptable components were suggested for a React-based implementation. | Radix addresses semantics, keyboard behaviour, and focus management, while responsibilities remain with the integrator. [Radix accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility) and [shadcn's Astro installation](https://ui.shadcn.com/docs/installation/astro) establish useful capabilities; the latter uses a React integration. Neither is compulsory for Astro. |
| Custom Astro components and CSS | A small custom design system was recommended for full brand control. | This is the current proposal: use semantic HTML, platform interactions, and reusable project components first. CSS variables or Tailwind are implementation choices still to be selected. |

The earlier categorical descriptions of Atlassian and Carbon as poor foundations should be read as fit/effort judgments for this project, not proof that either cannot support a warm design.

### Proposed small custom system

The three layers discussed were:

1. Semantic tokens for repeatable decisions.
2. Accessible components appropriate to the chosen implementation.
3. An original visual identity expressed through typography, imagery, colour, spacing, and tone.

Illustrative token roles mentioned were surface-calm, text-primary, accent-warm, and border-soft. These are brainstorming examples, not an implemented token schema. Role-based names can retain their meaning while values change across themes.

Foundations to define if selected: colour roles and contrast, type scale, spacing, layout widths, radii, focus treatment, modest elevation, imagery, and motion. An 8-point spacing approach and generous readable body text are possible starting points, not adopted measurements.

Candidate components:

- Contact actions for phone, WhatsApp, and callback requests; a persistent mobile bar is an option to test for obstruction and keyboard/focus behaviour.
- Situation cards, service summaries, and nurse/team profiles with verifiable credentials.
- Callback, referral, intake, training-enquiry, and booking forms as needed by the agreed workflows.
- FAQs, resource cards, training/event cards, and clear free/paid service labels.
- Privacy information, consent controls where required, and a language switcher if translations are selected.
- Error summaries, field errors, pending states, confirmation, and safe retry paths.

A full enterprise component library, high-contrast mode, or dark mode is not assumed.

## Technology alternatives

### Original stack comparison

These rows preserve the alternatives discussed before the user's Astro preference. Effort, editing quality, and performance depend on implementation and maintenance; the earlier simple rankings were judgments rather than measured results.

| Approach | Why it was considered | Tradeoff and current status |
| --- | --- | --- |
| Server-rendered Wagtail/Django with custom CSS | Combines content editing and backend workflows with full template control. | Its position as the preferred public frontend was superseded by Astro. Wagtail/Django remains a backend/CMS candidate. |
| Astro with a headless CMS | Fits a content-led custom site and can minimise browser JavaScript. | Preferred frontend direction. CMS, server runtime, deployment, and operational backend remain to be chosen. |
| Next.js with Payload | Offers a TypeScript application with an editor and configurable backend features. | A public Next.js site is not the current preference. Payload remains an option behind Astro, while still requiring its Next.js backend application. |
| WordPress with a custom block theme | Was considered for nontechnical content editing and a familiar CMS ecosystem. | No theme, plugins, or operational-record design has been evaluated. Plugin dependence does not itself prove insecurity, and WordPress is not excluded by custom design. |
| Webflow or Framer | Were considered for visual editing and a service-led public website. | Neither has been selected or evaluated for the full private intake/booking/payment requirements. Third-party data handling requires review rather than a blanket claim that such platforms cannot be used. |

The original comparison also mentioned Astro/React, Sanity, Payload, Strapi, Django, NHS/GOV.UK HTML patterns, and tool-based style variables. These are alternatives, not installed technologies.

### Historical Astro-compatible shortlist

| Approach | Public content and editing | Private workflows | Main decision factor |
| --- | --- | --- | --- |
| Astro + Wagtail/Django + PostgreSQL | Astro presents content; Wagtail supplies a structured nurse-facing editor and a public content API. | Dedicated Django records and protected endpoints can handle intake, appointment, and payment operations. | Suitable candidate for a Python-maintained project; requires Python/JavaScript maintenance and explicit preview/publishing integration. |
| Astro + Payload + PostgreSQL | Astro presents content from Payload's editor and APIs. | Private operational collections and endpoints need appropriate access controls and workflow code. | Suitable candidate for a TypeScript team. Payload itself runs within a Next.js application, adding that backend application to maintain. |
| Astro + hosted CMS + specialist booking/payment services | An external CMS supplies editing, while specialist services handle selected operations. | Depends on each vendor and the information passed between systems. | Can reduce custom workflow code, with more vendors, recurring service dependencies, and data-flow review. No specific booking/CMS combination has been selected. |
| Astro server routes/actions + an appropriate editor/data service | Astro can handle runtime forms and endpoints itself, alongside suitable static content. | Still needs persistent storage, staff access, permissions, and operational management. | A separate application framework is not technically mandatory. Building a bespoke CMS/staff system without comparing existing capabilities could add unnecessary work. |

PostgreSQL is a proposed database in the two main shortlist options, not a confirmed user selection.

The original recommendation was conditional on maintainer skills. The user subsequently selected Payload, citing perceived ease of use and extensibility; that preference supersedes the open CMS shortlist. Production database, hosting and provider choices remain open. SQLite is used only as the local MVP development default.

Payload's [official plugin overview](https://payloadcms.com/docs/plugins/overview), checked on 2026-10-26, confirms official/community plugins and custom extensions. No plugin is required just because it exists. The local MVP uses core collections, access controls and custom validated intake endpoints rather than assuming a form-builder plugin supplies care workflows.

### Editing and content publication

Nurses need to update service descriptions, resources, and training dates without code. A proposal is to offer structured fields and a few reusable sections rather than unrestricted page layouts.

Assess any CMS using actual tasks: edit a service, update a training date, replace a consented image, preview a draft, publish it, and correct an error. Keep preview authentication, publishing behaviour, and public-content refresh explicit. Do not assume that a content API alone supplies a usable headless preview.

Sanity, Payload, and Strapi were named as headless options in the earlier conversation. The claim that one is definitively best for nontechnical editors came from a secondary comparison and has not been established for these nurses. A task-based editor check should inform selection.

### Technical evidence

The following primary documentation was consulted on 2026-10-26:

| Finding | Source |
| --- | --- |
| Astro can prerender public pages and render selected routes at request time using a server adapter. | [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) |
| Astro provides server actions that accept and validate form data; it also supports endpoints. | [Actions](https://docs.astro.build/en/guides/actions/), [endpoints](https://docs.astro.build/en/guides/endpoints/) |
| Astro supports selective browser interactivity and optional framework components. Exact page performance still depends on implementation. | [Islands architecture](https://docs.astro.build/en/concepts/islands/), [framework components](https://docs.astro.build/en/guides/framework-components/) |
| Content collections support structured content sources but are not, by themselves, a nurse-facing CMS editor. | [Content collections](https://docs.astro.build/en/guides/content-collections/) |
| Wagtail supports headless use, with additional integration needed for some frontend capabilities such as preview. | [Wagtail headless support](https://docs.wagtail.org/en/stable/advanced_topics/headless.html) |
| Payload supplies an admin interface, APIs, authentication, and configurable access controls within a Next.js application. Its API can serve another frontend. | [What is Payload?](https://payloadcms.com/docs/getting-started/what-is-payload), [REST API](https://payloadcms.com/docs/rest-api/overview), [access control](https://payloadcms.com/docs/access-control/overview) |
| shadcn documents an Astro setup with React; this is one integration choice, not a prerequisite for using Astro. | [Astro installation](https://ui.shadcn.com/docs/installation/astro) |

The current Astro CMS overview URL was intermittently unavailable. An [archived official Astro v5 CMS guide](https://v5.docs.astro.build/en/guides/cms/) supported the general explanation of a headless CMS; it is not treated as current-version setup instructions.

### Styling, hosting, and performance

Custom CSS using semantic variables and a Tailwind-based implementation were discussed. Neither is selected. The chosen styling method should preserve the original identity and make nurse-edited content predictable.

The earlier suggestion to favour a Nairobi/Kenya host considered latency and data location. This is a hypothesis to evaluate, not a guarantee of speed or compliance. Review actual facilities, processing locations, support, backups, logging, security, recovery, cost, and vendor contracts. Public images/static assets and private records can have different delivery requirements.

Do not use an assumed global CDN configuration to publish private intake data. The actual deployment must account for public caching, private responses, and operational data flows.

No framework bundle-size benchmark was run. Fast public pages remain a design goal: optimise images, fonts, page complexity, third-party embeds, and the amount of browser JavaScript. Validate representative pages on realistic mobile connections.

## Intake, booking, payments, and staff workflows

Status: launch capabilities are confirmed in C03. Nurse review and both training formats are now selected in C09/C10. Other flows below retain their proposal/open labels; the MVP plan records actual local behaviour.

### Contact and intake

Phone, WhatsApp, callback requests, and forms should remain understandable alternatives. State contact hours and response expectations once established.

Keep a short first-contact route available. Define detailed intake around the information needed to provide the chosen service, who is submitting, who may view it, and how sensitive information is handled. The request for detailed intake does not automatically approve medical-document uploads, an electronic health record, or mandatory client accounts.

Consider people enquiring for a relative, parent, child, or person unable to submit themselves. Appropriate identity, consent, and representative-authority rules need professional review rather than assumptions.

Referral and support-group linkage should explain what information is shared and with whom. Public professional information and confidential referral submissions need separate handling.

### Proposed service booking flow

For services requiring assessment:

Request support -> nurse review -> agree service, appointment, and fee -> payment where applicable -> confirmation.

This allows staff to assess fit, availability, coverage, travel, and responsibility before committing to a home visit or intervention. Whether each service requires review remains a business decision.

### Proposed training flow

For fixed scheduled courses:

Choose course -> see dates, requirements, price, and availability -> register and pay -> confirmation.

This is a proposal for course registration. Course offerings, capacity, scheduling, certification, instant confirmation, and rules for reserving a place while payment is pending remain open.

The original three training audiences must remain distinct: domestic managers, nannies, and home caregivers.

### Complimentary services

Present the founder's complimentary spiritual-care offering clearly and allow access without a payment demand. Explain the exact free scope and any overlap with paid psychological services before publishing fees.

Free status does not by itself establish unlimited availability, immediate appointments, or unrestricted geographic coverage.

### Payments

The earlier discussion considered:

- Direct Safaricom Daraja integration for M-Pesa.
- Gateways such as Pesapal, IntaSend, and Flutterwave.
- Hosted checkout, payment links, and a later more integrated experience.
- Cards and potential international payers/donors.

Only online payment capability is confirmed. Donation collection, specific international markets, a merchant account, a Till/Paybill arrangement, gateway selection, fees, and settlement terms are not agreed.

Current primary evidence checked on 2026-10-26:

| Candidate | Supported research finding | Not yet established for this organisation |
| --- | --- | --- |
| IntaSend | Its [payment-link documentation](https://developers.intasend.com/reference/payment-links/) describes reusable links supporting card and M-Pesa/mobile-money collection. Its [collections guide](https://developers.intasend.com/guides/collections/overview/) distinguishes Kenyan M-Pesa STK Push from other methods. | Merchant eligibility, enabled methods, fees, settlement, service reliability, suitability, and contractual data arrangements. |
| Pesapal | Its [order documentation](https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/submitorderrequest) describes hosted checkout, return callbacks, change notifications, and fetching payment status from its API. | Merchant approval, enabled payment methods, fees, refunds, settlements, and end-to-end operation for this business. |
| Safaricom Daraja | Direct integration was discussed; [the official developer portal](https://developer.safaricom.co.ke/) is the starting reference for evaluation. | The portal's integration details, account eligibility, required business arrangement, and this project's operational fit were not verified in this research. |
| Flutterwave | Named as an alternative in the inherited conversation. | Current Kenya availability, licensing, merchant eligibility, methods, fees, and suitability were not verified. It is not a researched shortlist recommendation. |

A hosted payment experience was recommended as an option to reduce custom payment-entry work. Keep clinical information out of payment descriptions. Verify payment status through the chosen provider's supported server process rather than treating a browser return page as proof of payment.

Business and UX questions include cancellation, rescheduling, refunds, deposits, receipts, delayed phone prompts, failed transactions, capacity changes, duplicate attempts, and who reconciles exceptions. These are topics to resolve, not an approved transaction model.

### Scheduling and staff work

An embedded scheduling tool such as Cal.com was mentioned as optional in the earlier conversation. No vendor, availability model, calendar integration, or data-handling arrangement has been evaluated.

A content editor and an operational staff workspace serve different tasks. Public-content editing should not give automatic access to confidential intake. Possible care, content, and finance responsibilities should inform access design; no final roles or separate portal product has been selected.

Notifications should make follow-up reliable without spreading confidential details into routine email, WhatsApp previews, analytics, or payment systems. Automated messaging, reminders, a chatbot, and a client portal are not launch commitments.

## Privacy, clinical boundaries, and accessibility

### Kenya data protection

The following findings are based on ODPC primary sources consulted on 2026-10-26, including search-indexed source text when direct retrieval timed out:

- The [ODPC FAQ](https://www.odpc.go.ke/faqs/) lists health administration and patient care among purposes not exempt from mandatory registration based on small turnover or staff numbers. Actual organisational classification still needs confirmation.
- The [ODPC health-data guidance](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Processing-of-Health-Data.pdf) discusses lawful processing, necessary collection, confidentiality, security, and distinct consent for health services and personal-data processing. A single checkbox is not a substitute for selecting and documenting the appropriate legal basis and safeguards.
- [ODPC registration guidance](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf) is a primary reference for registration evaluation.

Before live intake, establish necessary data, responsibility for processing, staff permissions, retention/deletion, access and correction requests, security, incident handling, and vendor/data-transfer arrangements. Assess whether an impact assessment is required for the actual processing. No legal compliance determination or registration has been completed.

Do not infer that all data must be hosted in one country, that all cross-border hosting is automatically permitted, or that a Kenyan host alone resolves the issue. Obtain a review of the actual data flows and applicable rules.

### Clinical and service boundaries

The website should identify who provides nursing, psychological, spiritual, therapy, training, and specialist services. A nurse-led identity does not itself establish every provider's qualification.

Publish availability and appropriate escalation information without implying an unestablished emergency or 24-hour service. Support-group linkage is not the same as operating a moderated community. Professional referral is not a promise that a specialist appointment is immediately available.

Training descriptions must distinguish practical instruction, assessment, attendance certificates, and any recognised qualification. No accreditation has been established for the initiative.

### Accessibility

The proposed target is [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/). This is a project recommendation, not an audited result or a statement of the initiative's legal status.

Design work should cover contrast, readable text, keyboard access, visible focus, labelled forms, understandable errors, suitable touch targets, reduced motion, zoom/reflow, and accessible confirmation and pending states.

The earlier suggestion to aim for AAA contrast where practical is an optional aspiration, not a claim of AAA conformance. An accessible light theme is necessary if selected; dark or high-contrast themes do not substitute for it.

Use actual phones and relevant assistive technology in later validation. Neither Radix nor NHS/GOV.UK patterns supply accessibility "for free", and source review alone cannot establish usability.

## Corrections to earlier advice

| Inherited claim or implication | Corrected interpretation | Evidence or status |
| --- | --- | --- |
| Astro needs a separate backend for forms. | Astro can execute server endpoints/actions with an appropriate runtime. A separate Django/Payload service is a management and architecture choice. | Astro rendering, endpoint, and action documentation linked above. |
| Astro necessarily means React with Radix/shadcn. | React is optional. Use framework components where needed rather than making them a requirement for static content. | Astro framework/islands documentation and shadcn's optional integration. |
| Astro is a choice against Wagtail. | Wagtail can supply headless content and a Django backend behind Astro. | Wagtail headless documentation. |
| Payload means the public site must use Next.js. | Payload's own application uses Next.js; Astro can consume its API as the public frontend. | Payload documentation linked above. |
| Self-hosting or a CMS choice makes health intake secure. | Permissions, data handling, deployment, staff processes, and operational controls still need design and verification. | Configurable access controls are capabilities, not a completed security design. |
| Radix gives accessibility "for free". | It handles important component behaviours; integration, content, styling, and whole-service testing remain necessary. | Radix and GOV.UK accessibility guidance. |
| Typical Astro bundles are 5-10 KB versus 100-200 KB for Next.js. | These inherited secondary-source figures are not a project benchmark and should not drive selection. | No reproducible measurement was supplied or run. |
| Small turnover or staff size may remove registration requirements for a care organisation. | ODPC lists health administration/patient care among non-exempt purposes; confirm this organisation's classification. | ODPC FAQ. |
| Explicit consent is the sole lawful basis for every health-data activity. | Assess the appropriate legal basis and applicable health-data conditions per processing activity; treatment consent and data-processing consent differ. | ODPC health-data guidance. |
| Daraja "works only in Kenya", so international payers automatically require a particular gateway. | Evaluate the specific product, payment method, payer access, merchant country, and settlement support. The blanket wording was not verified and is too broad for provider selection. | Daraja evaluation remains outstanding; provider method/country support must be checked directly. |
| A local host ensures performance and data compliance. | Location is one input. Measure performance and review actual processing, safeguards, contracts, and recovery. | No hosting evaluation or organisation-specific legal assessment was performed. |
| Payments should be postponed until after launch. | The user subsequently included payments in the launch scope. | C03 and S01 in the decision register. |

### Inherited claims not independently rechecked

The original assistant mentioned recent Wagtail autosave/block settings, an earlier editor accessibility checker and right-to-left language support; favoured Sanity for nontechnical editing based on a third-party comparison; described Carbon's specific themes/libraries; and referred to a Material community fork.

Those details are retained as discussion history, not current feature/version guarantees or adoption reasons. Verify any feature that becomes a selection criterion against the relevant product's current official documentation. No framework version is selected by this document.

The inherited answer also named secondary write-ups from jacar.es, CODERCOPS, wmtips, HelloDuty, and Mctaba, alongside an unspecified legal summary. The exact articles and their claims were not fully verified here. Primary-source findings above replace reliance on them where available; no missing URL is invented.

## Delivery scope and future possibilities

The original proposed phases were:

1. Core pages, situation-led navigation, WhatsApp/callback, and privacy information.
2. Training registration, events, and resources.
3. Payments, Kiswahili, and a professional referral portal.

These are historical suggestions. The user's launch clarification expands the first release to intake, appointments, and payments; the earlier phase labels cannot silently remove these requirements.

Translations, events, an extensive library, donations, a forum, client accounts, automated messaging, and a referral portal remain open possibilities. The actual scale of course registration and content resources needs definition. No implementation roadmap or delivery date has been approved.

## Basis for AGENTS.md

The user requested online research before establishing persistent project instructions. Primary sources checked on 2026-10-26:

- [OpenAI: custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md). It describes root/current-directory discovery, more specific directory guidance, and verification of loaded instructions. Uppercase AGENTS.md at this workspace root is appropriate even before Git is initialised.
- [OpenAI: rethinking skills and prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra). It recommends relevant context pointers and reviewing persistent instructions for unnecessary constraints and stale material.
- [OpenAI: iterating development workflows with Codex](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex). It discusses keeping repository context, conventions, and completion criteria in durable documents.

The root guide therefore carries concise project rules and task-specific pointers. The full research stays here. No nested instruction files, vendor-specific agent configuration, mandatory delegation workflow, or invented build commands are needed for the current folder.

The local Writing for Agents skill also informed document organisation: keep one authoritative home for detailed information, use conditional context links, and make completion checkable. The skill is guidance for this authoring session, not a dependency that future contributors must install.

## Coverage and handoff

| Discussion area | Authoritative record |
| --- | --- |
| Original identity, overview, six services, commitments, and tagline | Business brief. |
| Explicit preferences and launch/editor requirements | Decision register, confirmed requirements. |
| Homepage audience delegation | Decision register, D01. |
| Website research and visual-inspection limits | Website reference research and research-method sections above. |
| Positioning, navigation, draft copy, and trust | Proposed positioning and navigation. |
| Three visual directions, typography, imagery, and motion | Visual directions. |
| Named design systems, token layers, components, and optional themes | Design systems and components. |
| Original framework alternatives and current Astro-compatible options | Technology alternatives. |
| Contact, intake, training, booking, payments, referrals, and staff work | Workflow sections above. |
| Hosting, health-data obligations, clinical boundaries, and accessibility | Technology and privacy/accessibility sections above. |
| Corrections, inherited unverified claims, and displaced phasing | Corrections and delivery-scope sections above; decision register for superseded choices. |
| Persistent agent instructions and online guidance | Root AGENTS.md and its source basis above. |
| Remaining business, technical, and compliance choices | Decision register, open questions. |

The original handoff established documentary context. A local application now exists; its commands and validation are recorded in the README. Rendered reference-site review, nurse usability acceptance, provider onboarding and organisation-specific compliance review remain outstanding.
