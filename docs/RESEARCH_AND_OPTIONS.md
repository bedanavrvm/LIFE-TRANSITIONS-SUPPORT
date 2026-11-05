# Research and options

First recorded: 2026-10-26. Last updated: 2026-11-02.

This document consolidates the substantive brainstorming in the founder's supplied conversation and the subsequent research discussion. It is a structured record, not a verbatim transcript or a final implementation specification.

Current update: C36 reverts the entire C34/C35 floral-kit experiment after the user found it rigid and rejected the rose spray, borders and torn-paper treatment. The public website returns to the C32 flowing vines and C33 light cream/gold surfaces, with the official logo, tagline and established services. Astro/Payload and the care/training workflows remain selected. Render remains preferred with recurring cost minimised; final resource sizing remains open. The kit discussion below is superseded history, not current implementation guidance.

Use [the decision register](DECISIONS.md) to determine what has been selected. Use [the business brief](BUSINESS_BRIEF.md) for the original service wording. An option described here is not automatically a requirement.

## Research method and limits

- The earlier pasted conversation has no known original date. Source checks in this workspace were performed on 2026-10-26, with batch 1 accessibility references checked on 2026-10-27.
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

The warm direction was adopted for the local visual refresh in C12/C13. The other directions below remain alternatives; this table preserves the original comparison. C29–C31 later adopt the supplied official logo and gold/cream/black; see the [current brand specification](#official-brand-and-service-alignment).

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

The sections below record successive design passes. [C29–C31](#official-brand-and-service-alignment) set the current brand and service presentation; C23/C26 retain the professional icons and manual training preview. Earlier descriptions retain their historical rationale.

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
- The full-width sage header uses 24px downward/12px upward travel thresholds. Its later compact sizing, pointer-focus correction and revised reduced-motion behaviour are recorded in [the reading-navigation follow-up](#persistent-reading-navigation-and-stock-photography). Keyboard-visible focus, an open menu and proximity to the top preserve access. Without JavaScript it remains visibly sticky.
- Homepage bands alternate cream, near-white, sage, warm sand, green and near-white. The footer uses deep green with warm light text and its own legal divider. Original botanical and embracing/home/heart line art decorates available desktop gutters; it is non-interactive, contains no content and disappears when space is limited.
- Clickable situation links and buttons gain a small lift and a stronger soft shadow on fine-pointer hover. Navigation/text links gain clearer colour and underline changes. Focus outlines and raised focus states provide keyboard feedback. Informational panels use static shadows; course/service panels strengthen their shadow when their actual link is hovered or focused. Hover movement respects reduced motion.
- Approach, service detail, training detail, contact, resources and privacy pages use the existing 1280px container with article/aside slots. Paragraphs remain capped around 65 characters. Side panels contain existing photographs, audience/fee/session information, actions or section navigation. Below 1101px the article and side panel stack in source order. Payment, confirmation and error pages retain compact message layouts.
- CMS/API schemas, permissions, contact/provider details and the care/payment workflows do not change. Original SVG artwork is local; existing photography and font sources remain as registered below.

Primary references accessed on **2026-10-26**:

| Reference | Supported finding and implementation consequence |
| --- | --- |
| [W3C CSS Scroll Snap specification](https://www.w3.org/TR/css-scroll-snap-1/) | Proximity snapping lets the browser choose whether a nearby position should settle; the exact feel is browser-dependent. Native behaviour preserves ordinary scrolling rather than enforcing page steps. |
| [MDN animation-timeline reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) | View timelines support scroll-driven animation but have limited availability. Guard the enhancement with feature detection and retain a static fallback. |
| [W3C reduced-motion technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) | Interaction-triggered motion can be disabled according to user preference. The current implementation disables parallax/snapping and animated header transitions under reduced motion. |
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

#### Batch 1: service presentation and mobile navigation

Confirmed on **2026-10-27** under C18/C19 after the user selected photographs plus line art and improving the existing mobile menu, then authorised implementation. This extends the current warm visual direction without changing service scope, CMS schemas, intake, appointments or payments.

This section records the initial batch 1 composition. C20–C22 subsequently supersede its large service illustrations and extend its navigation; C23–C26 replace its utility icon paths and update the colours/training preview. Current behaviour is specified below.

**Service overview:** retain the CMS ordering and render two card columns above 780px, one below. Original icon medallions replace prominent numbering; the number field remains available for ordering. Each card has one native link covering its surface, labelled "Explore {service title}", with a visible keyboard outline and raised hover/focus shadow. Cards stretch within a row without truncating content. The complimentary badge follows the existing free flag. A warm callout below the cards offers "Help me choose support" through the existing enquiry form.

**Service details:** above 1100px, the existing 1280px content frame contains a two-column introduction with a 48px gap: title, summary, audience, fees and action on the left; photograph or illustration on the right. At 1100px and below, source order places the title, audience, fee guidance and request action before the visual, followed by the description and next steps. Existing CMS descriptions remain intact, including family therapy/counselling within complimentary spiritual care. A three-item next-steps panel explains sharing a brief request, nurse review/discussion and confirmation of arrangements. The caregiver-training page retains its training action. Missing services and backend failures retain their 404/503 statuses.

| Stable service slug | Small icon | Detail visual | Accent |
| --- | --- | --- | --- |
| psychological-support | Conversation | Original two-person conversation illustration | Sage |
| caregiver-training | Learning | Existing childcare photograph | Sand |
| spiritual-bereavement | Hands and leaf | Original hands supporting a leafy stem | Sand |
| support-groups | Group | Original connected people illustration | Sage |
| professional-linkage | Connection | Original referral-path illustration | Sage |
| home-follow-up | Home and heart | Existing home-care photograph | Sage |

**Artwork implementation:** CareIcon supplies typed original inline SVGs with consistent 24×24 geometry and rounded strokes. ServiceVisual combines the existing responsive photography component with four larger, separately composed illustrations. A single frontend slug mapping chooses visuals and accents independently of CMS ordering. A valid service with an unfamiliar slug receives neutral hands/leaf artwork and sage styling. The original artwork also replaces pictorial text symbols in homepage situation links, the reassurance strip, hero caption and flourish; the logo, gutter artwork and functional text arrows remain. Decorative SVGs are hidden from assistive technology and cannot receive focus. Existing photograph alternative text and credits remain applicable; the stock subjects are not presented as staff, clients or a verified location. No new bitmap assets, third-party icon package, animation library or remote asset requests are introduced.

**Mobile navigation:** retain the native details/summary control at widths up to 1100px, with a visible Menu label and matching open/close icons. The panel is at most 360px wide and constrained to the viewport, with scrollable overflow on short screens. Links are at least 48px high. Request support is the first, primary action, followed by Services, Caregiver training, Our approach, Resources and Contact. Desktop and mobile links identify exact pages with aria-current=page and containing service/training sections with aria-current=location; matching uses complete path segments.

With JavaScript, Escape closes the menu and restores toggle focus; outside pointer interaction and focus moving outside close it without stealing focus. Link activation closes the panel, desktop resizing clears its open state, and restored pages start closed. Native Enter/Space activation and ordinary Tab navigation remain; there is no focus trap or application-menu role. Without JavaScript, the summary and links still work. The existing scroll thresholds and open-menu header visibility are retained. A fixed bottom support bar, staff profiles, submission pending-state changes and additional animation remain outside this batch.

Primary references accessed on **2026-10-27**: [W3C disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) informs ordinary-link semantics and keyboard/dismissal behaviour; [WAI-ARIA current-location semantics](https://www.w3.org/TR/wai-aria-1.2/#aria-current) informs current-page/section feedback; [W3C decorative images](https://www.w3.org/WAI/tutorials/images/decorative/) informs redundant-artwork treatment. The APG example is guidance rather than production-ready code. Physical-device and assistive-technology validation remains separate from automated checks.

#### Persistent reading navigation and stock photography

Confirmed on **2026-10-27** under C20–C22 following the user's direct feedback. Typography, care workflows and data boundaries remain in use. C23–C26 subsequently update the utility icons, colour separation and homepage training preview as specified below.

- **Whole-card interaction:** service links already cover their cards; training links now extend over the complete photograph and body through a native link hit area. No hover, script click handler or extra keyboard target is needed to navigate. Container hover/focus states apply the shadow and action emphasis, including when the pointer is over a photograph.
- **Photography:** every service introduction uses a real-person stock photograph. Psychological support uses the new conversation photo; caregiver training retains childcare; spiritual/bereavement support uses existing companionship; support-group linkage uses the new group-conversation photo; professional linkage uses the new consultation photo; home follow-up retains home care. Unmapped valid services use companionship. The large illustration markup is removed. Subjects are illustrative and are not identified as staff, clients, verified partners or people with a particular condition.
- **Compact directional header:** default minimum heights are 75px desktop and 72px phone, reduced from 100/96px. Text can still enlarge and wrap. The scroll thresholds remain 24px downward to hide and 12px upward to reveal. Keyboard-visible focus, an open menu and the top of the page keep it accessible. Pointer focus after closing a menu no longer pins it; reduced-motion mode hides/reveals without animation. With JavaScript disabled the header remains visibly sticky.
- **Persistent breadcrumbs:** a shared trail appears below the header on content pages. Home and the containing Services/Training section remain native links, followed by the current page label. The trail stays at the top when the main header hides and moves below it when it returns. Current text can truncate visually while retaining its full accessible text; long ancestor trails scroll within their own row. Form values and private references are not included.
- **Persistent section navigation:** Resources and Privacy retain a 320px panel in the desktop gutter. The panel is pinned independently of article height so it does not disappear at the end of a section. At 1100px and below it becomes a compact horizontal index above the content, with space reserved for its measured height. Desktop introductions and footer content reserve the panel's column; link lists can scroll when space is limited.
- **Section tracking and anchors:** a small native script marks one section link with aria-current=location as headings cross the reserved reading offset. Clicking an index link retains ordinary fragment navigation. Active items are brought into the horizontal index viewport without scrolling the document or moving focus. Measured header, breadcrumb and index heights provide anchor clearance, with conservative CSS fallbacks when JavaScript is absent. Original article IDs and URLs remain compatible.
- **Implementation:** the existing header controller manages direction and exposed header height. The shared reading-navigation controller measures the pinned controls and tracks headings using animation-frame-scheduled scroll work. There is no new framework, dependency, CMS collection or server endpoint.

Primary references accessed on **2026-10-27**: [MDN positioning reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position) informs containing-block/pinned-position behaviour; [W3C Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) informs clearance for sticky layers and focused targets. Primary Pexels source pages and licence terms are recorded below. These references do not establish full accessibility or production readiness.

#### Photography asset register

The original five source pages were accessed on **2026-10-26**. The three follow-up sources and the [Pexels licence](https://www.pexels.com/license/) were checked on **2026-10-27**. The licence permits website use and modification, does not require attribution, and prohibits implying endorsement or portraying identifiable people offensively. Credits are retained here for provenance. Photographs illustrate family life and support; they do not identify actual staff or clients, establish a person's health condition, or document a Kenyan location.

| Local source asset | Photographer and original page | Current use |
| --- | --- | --- |
| `family.jpg` | August de Richelieu — [Family gathering for a group hug](https://www.pexels.com/photo/family-gathering-for-a-group-hug-4262424/) | Homepage hero. |
| `companionship.jpg` | Kampus Production — [Woman assisting elderly man](https://www.pexels.com/photo/woman-assisting-elderly-man-7551667/) | Support process, approach, spiritual/bereavement service and generic fallback for new courses/services. |
| `home-care.jpg` | Kampus Production — [Woman and elderly man sitting on bed](https://www.pexels.com/photo/woman-and-elderly-man-sitting-on-bed-7551671/) | Home-care training and follow-up detail. |
| `childcare.jpg` | Keira Burton — [Woman caring for her children](https://www.pexels.com/photo/woman-caring-for-her-children-6624421/) | Childcare training and caregiver-training service detail. |
| `baby-care.jpg` | William Fortunato — [Black mother hugging baby on hands](https://www.pexels.com/photo/black-mother-hugging-baby-on-hands-6392860/) | Baby-care training. |
| `conversation.jpg` | Polina Tankilevitch — [Women having conversation while sitting on the couch](https://www.pexels.com/photo/women-having-conversation-while-sitting-on-the-couch-5234577/) | Psychological support. Accessed 2026-10-27. |
| `community.jpg` | PICHA Stock — [Women having a conversation](https://www.pexels.com/photo/women-having-a-conversation-3869641/) | Support-group linkage, illustrating a group conversation. Accessed 2026-10-27. |
| `consultation.jpg` | Klaus Nielsen — [Doctor showing diagnosis to black patient in hospital](https://www.pexels.com/photo/doctor-showing-diagnosis-to-black-patient-in-hospital-6303652/) | Professional health linkage, illustrating a consultation. Accessed 2026-10-27. |

The source JPEGs are under `apps/web/src/assets/photos/`. Course photographs are selected by slug rather than collection order, so editorial reordering retains the correct association. Replacing a photograph requires updating its asset, alternative text, crop and this register. Later organisation photography requires appropriate permission before use.

#### Font provenance

Accessed **2026-10-26**: [DM Sans's SIL Open Font License](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt) and [Lora's SIL Open Font License](https://github.com/google/fonts/blob/main/ofl/lora/OFL.txt). Latin WOFF2 files were retrieved through the official Google Fonts CSS endpoint for DM Sans weights 400–700 and Lora normal/italic weights 400–500. Only the necessary styles/subsets are included. Licence copies ship beside the fonts in `apps/web/public/fonts/`.

Responsive browser review, font/image loading, doubled-text reflow, keyboard access and reduced-motion checks support this refresh's acceptance. They do not replace screen-reader or physical-device testing; exact results are recorded in the MVP plan and README.

#### Professional icons, colour and training carousel

Confirmed on **2026-10-27** under C23–C26. The user selected colour changes for both the navbar and page introductions, chose the training showcase rather than a photo gallery, and authorised implementation of the resulting plan.

- **Icons:** @lucide/astro 1.62.0 replaces the original CareIcon path definitions and public text arrows/checkmarks, including form actions, confirmations, menu controls and FAQ chevrons. The existing typed CareIcon interface maps semantic names to explicit component imports. Internal navigation uses ArrowRight; provider checkout uses ArrowUpRight. Icons render as local inline SVG with a consistent 24px/1.75-stroke base; decorative SVGs are hidden from assistive technology and cannot receive focus. The original logo and gutter artwork remain brand decoration. No React hydration, icon font or runtime icon CDN is added.
- **Colour:** navigation uses forest green #244c40 with warm-white text and a light primary action; introductions use pale sage #e7eddf; reading surfaces use warm white #fffefa. Cream/sand panels and the existing deeper-green footer retain warmth. Shared PageIntro markup gives ordinary content, service/training detail, support, confirmation and error introductions a full-width background with aligned inner content. The homepage uses its existing full-width hero band. Mobile-menu foregrounds and focus rings are scoped to their actual light/dark surfaces. Measured text sizes, compact header heights and directional/pinned navigation remain applicable.
- **Copy:** remove exactly "This service does not provide emergency response." from the footer, Contact page and support form. The remaining urgent-care guidance on Contact/support remains. No emergency availability, response time or professional capability is introduced by the copy change.
- **Training preview:** retain the first three public CMS courses and their order, photos, descriptions and whole-card links. A native horizontal track shows two full cards plus a preview on desktop and one full card plus a preview at widths up to 1100px. The main training catalogue remains a grid. Forty-eight-pixel previous/next buttons and a polite range status enhance native scrolling. Endpoint buttons use aria-disabled and ignore activation while retaining keyboard focus; carousel navigation changes only the track's horizontal position. A course is counted in the visible range when at least half its width is in view. Scroll/resize updates the range and controls.
- **Fallbacks:** no autoplay, looping, wheel interception or additional carousel dependency. Reduced motion makes button scrolling immediate; native horizontal snapping remains. Without JavaScript, the course track and native links remain available while enhanced controls are hidden. Zero/one-course and non-overflow layouts do not expose unusable controls. Existing desktop vertical snapping, breadcrumbs and section tracking retain their own behaviour.
- **Boundaries:** no CMS schema, public API, private-record permissions, booking/payment behaviour, new stock asset, testimonial or operational claim is added. The lockfile adds only the Lucide package and its web-workspace declaration; existing resolved packages and the DOMPurify override are preserved.

Primary references accessed on **2026-10-27**:

| Source | Finding and implementation use |
| --- | --- |
| [Lucide Astro getting started](https://lucide.dev/guide/astro/getting-started) | Official package name is @lucide/astro; named Astro imports render inline SVG and support size, colour and stroke settings. [Package metadata for version 1.62.0](https://registry.npmjs.org/@lucide/astro/1.62.0) declares Astro 4–7 peer support and the ISC licence. |
| [Lucide Astro accessibility](https://lucide.dev/guide/astro/advanced/accessibility) | Decorative icons are hidden by default; give icon-only controls an accessible name on the button. The package does not establish whole-site accessibility. |
| [WAI carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) | Use labelled previous/next controls and ordinary keyboard navigation; activating controls should preserve focus. This implementation chooses manual navigation without automatic rotation. |
| [WAI carousel tutorial](https://www.w3.org/WAI/tutorials/carousels/) | Keyboard operation, understandable focus and communicated item changes matter. A visible preview and persistent catalogue link help discovery; these design choices still require user/device testing. |

## Official brand and service alignment

Confirmed **2026-10-28**, C29–C31, after inspection of both supplied images and the user's explicit choices. This section supersedes the earlier green/terracotta palette and temporary logo/gutter artwork. Earlier design descriptions remain historical; existing photography, readable typography, short enquiries, Lucide icons, directional header, persistent reading navigation and manual training carousel remain current.

### Brand assets and composition

**Current decoration:** C36 restores the C32 flowing vines and C33 light surfaces described below. The [C34/C35 kit experiment](#floral-kit-placement-and-motion) is superseded history.

- The founder's logo JPEG is copied byte-for-byte to `apps/web/public/brand/official-logo.jpeg`. The compact emblem and favicon use an SVG viewport containing the same original JPEG; no tracing, AI approximation or raster alteration is involved. The full wordmark/tagline remains in light panels on About and the footer. The compact header pairs the emblem with live organisation text, retaining the normal 75px desktop / 72px phone header and allowing text enlargement to grow it as before.
- Gold, cream and black are supplied brand colour families. The hex values below are adopted web defaults, not sampled or supplied formal brand standards. C29 initially used large warm-black navigation, care-banner and footer surfaces. C33 supersedes those after the user found them dark and too strongly contrasted: use pale cream for navigation, light gold for reassurance and champagne for the footer. Warm black remains main text and official-logo artwork. Gold borders, soft shadows and gentle background changes distinguish regions. Navigation/footer hover and focus text use dark gold, not the former light text. Preserve semantic error styling.
- The first C29 composition used `floral-corner.svg` as isolated bouquets in narrow section gutters. C32 supersedes that placement after the user found it stiff and cut off. The small original `floral-divider.svg` remains in section spacing.
- C32 uses one continuous background from the page introduction through the footer. `floral-vine.svg` reuses the original vector flowers, buds and leaves along connected curling stems and irregular branches. Matching top/bottom stem positions and tangents let the artwork continue vertically without a broken seam. Left/right vines use different widths, opacity and vertical phase rather than restarting at each section. Their boxes extend behind the composition instead of being squeezed into spare gutters; only the page's horizontal boundary clips them. The top/bottom of the page fade softly.
- The shared page canvas places section backgrounds below the botanical layer and content above it. Cards, photographs and form panels cover the vines naturally; transparent text areas allow a faint background trace. The fixed section index stays above the footer. The layer is non-interactive, hidden from assistive technology and static, and needs no JavaScript or extra dependency. On phones the vines remain visible at lower opacity with more of their width outside the viewport, without creating horizontal scrolling.
- Keep Lora headings and DM Sans text, the existing 18–20px body scale, real stock photographs and neutral shadows. Script lettering remains within the supplied logo. No additional dependency, remote image request, animation library or icon font is introduced.
- The supplied logo's white background remains deliberately enclosed in its logo panel; the surrounding page uses cream. The JPEG limits very large or high-resolution reproduction; replace it with a founder-supplied vector/transparent original when available rather than inventing a replacement.

| Semantic role | Value | Use |
| --- | --- | --- |
| Surface | #FBF6EA | Main cream reading area. |
| Raised surface | #FFFCF5 | Cards, form surfaces, breadcrumbs. |
| Soft surface | #F0E4C9 | Champagne introductions and context panels. |
| Warm surface | #E9D9B7 | A deeper alternating band and selected medallions. |
| Reassurance surface | #F5EBD5 | Light gold care/reassurance section, adopted under C33. |
| Footer surface | #E9DCBF | Champagne footer, adopted under C33. |
| Ink | #191815 | Dark text and icon detail; no large black public surfaces under C33. |
| Muted | #595143 | Supporting text, darkened under C32 for backgrounds with vine strokes. |
| Accent | #B58A32 | Gold buttons, active navigation, decorative artwork. |
| Accent ink | #6B4F17 | Gold-brown text, button hover and focus, darkened under C32. |
| Decorative line | #D9C9A7 | Section and card dividers. |
| Control border | #8B7A58 | Input and interactive control boundaries. |

Calculated unchanged pairs: ink on cream 16.46:1; ink on gold 5.62:1; control border on cream 3.88:1 and champagne 3.31:1. Under C32, supporting text and accent ink are darker so a conservative 21% gold composite over the darkest light surface (#E9D9B7) still measures 4.80:1 and 4.67:1 respectively. This bound covers the overlapping low-opacity mobile layers; desktop side layers do not overlap. Bright gold on cream is only 2.93:1, so it is reserved for decoration rather than informative text or required control boundaries. Button hover swaps to dark gold with cream text; the background/text change is immediate so a colour transition does not briefly create cream text on bright gold.

Primary accessibility references checked **2026-10-28**: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) specifies 4.5:1 for ordinary text; [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) specifies 3:1 for necessary control/state cues. These measured pairs and browser checks do not establish whole-site accessibility.

### Content and compatibility

The [business brief addendum](BUSINESS_BRIEF.md#official-brand-and-flyer-addendum--2026-10-28) owns the founder-supplied details and ambiguity record. The current brand tagline is **Walking life’s seasons with you.**; the original sentence remains mission copy on About. The supplied original business description is unchanged.

- Retain the six established service slugs; expand psychological support, caregiver education, spiritual care and referral wording from the flyer. Keep home follow-up distinct from general community visits. Add `community-support`, covering first-time mothers and families of children with disabilities.
- Add `sacred-therapy`, `heart-to-heart-therapy` and `letters-of-hope` as signature packages. Sacred Therapy explains family conversations, memory preservation and possible accompaniment without immediate-visit/ICU-access promises. Heart to Heart describes telephone support without claiming anonymity or a session format. Letters of Hope invites an enquiry without inventing its service details. Prices and availability remain discussed arrangements.
- Services remain one public Payload collection. Its optional `category` select defaults to `service`, with `package` as the other value. Legacy missing categories are treated as services. The listing separates seven services from three packages, in their CMS order; record detail URLs and service-prefilled enquiries use the existing mechanisms. Editors can move records between groups without code changes. No new intake field, public endpoint or private-record access is added.
- Keep spiritual/bereavement support explicitly complimentary, including its original family-therapy wording and the flyer's free Christian/Muslim online prayer support. A package's association with illness or grief does not automatically make it part of that complimentary service.
- Seed defaults cover fresh installations, while ordinary seeding still only adds missing slugs. Update existing local copy with a backed-up, slug-scoped Payload operation, retaining IDs and unmodified fields. Do not reset the database or broadly overwrite staff edits. Public launch, operational verification, provider integration and hosting changes remain separate.

## Floral kit placement and motion

**Superseded by C36 on 2026-11-02.** The user requested a full revert because the result felt rigid and they disliked the rose spray, borders and torn-paper treatment. The following records the authorised experiment and its rationale; none of its application components, assets or particle effects remain active. The original supplied kit remains untouched; implementation additions are archived under ignored `.test-data/reverted-decor-kit/`.

Originally confirmed 2026-11-02 under C34/C35. Source: the founder-supplied `gold-floral-decor-kit` directory and the placement guide in this conversation. All 20 SVG assets and the four canvas motion modes were reviewed in an isolated Chromium page before selection. Selected assets were copied and adapted locally, without a new package, external font or animation library.

### Composition and page recipes

Reading areas have solid light surfaces and no vines behind paragraphs. The shared canvas now uses 40px margin vines only at 1400px and above, where the 1280px reading composition has at least 60px margins. Corner illustrations scale to available outer space and are hidden when space is inadequate, rather than clipped or allowed to touch text. Normal main frames are thin; photo/card compositions use brackets and package introductions use double outlines. The footer has one quiet repeating vine strip above its content. Title flourishes sit between the title and lead with 24–32px spacing. Topic washes are small introductory accents: rose #F7E8E4, sage #ECF0E5 or indigo #ECEBF5, with one topic hue per page. The existing cream/gold surfaces, black ink, typography, photographs and official logo remain.

| Page | Static recipe | Decorative motion |
| --- | --- | --- |
| Home | Rose spray, thin frame, restrained gold corner glow, title flourish and leaf-vine separator. | Six calm gold motes in introductory side margins. |
| Services | Retain catalogue layout; moon phases above Signature Packages; only Sacred Therapy has a foil-bordered card. | One .8s foil pass on that card's hover/focus. |
| Sacred Therapy | Olive branch, pale indigo accent, still warm heading glow, double introductory frame. | Six calm gold motes. |
| Spiritual/bereavement | Olive branch, pale indigo accent, still warm glow, arched introductory panel. | Six calm gold motes. |
| Heart to Heart / Psychological support | Lotus corner, sage accent, lotus pond beside the service information. Heart to Heart has a double introductory frame. | None. |
| Letters of Hope | Pressed flower beside the text, double introductory frame, torn-paper transition. | Four drifting dandelion seeds. |
| Safe baby care | Rose spray/wash and three blooms. | Two butterflies, exclusive to this page. |
| Childcare foundations / Community home visits | Rose spray/wash and three blooms. | None. |
| Training / Caregiver education / Caring at home | Tree of life beside the introductory information, laurel details, bracket framing. | None. |
| About | Tree of life beside the introduction, rose details and quiet flourish. | None. |
| Contact / Support | Very faint paper grain, restrained brackets and diamond separators outside form fields. | None. |
| Resources / Privacy / Other services | Quiet brackets, flourish, occasional small section separators. | None. |
| Thanks | Pressed flower beside the introductory message. | None. |
| Payment / Error | Plain light composition and minimal decoration. | None. |

Spot illustrations have reserved space, not text overlays. Service pages keep their real photograph; an additional decorative spot sits beside the reading content. No testimonials, memorial stories, certification claims or new service pages are invented. Recipes for wedding, pregnancy/postnatal, certificates and memorial pages remain future guidance.

### Motion and technical boundaries

One decorative effect per page takes precedence over the guide's combined effects: no animated candle, opening line draw, falling blossoms or photo parallax alongside particles. The manual training carousel, functional header direction changes and ordinary hover/focus feedback remain. Decoration is hidden from assistive technology and cannot intercept pointer input.

Ambient motion is confined to the introduction's side margins, with particle sizes bounded to their available width. Two edge canvases share the selected kind, with the stated total count. Motion runs only above 1100px with no reduced-motion preference. An explicit Pause/Resume background animation button reports its pressed state and has reserved space below the introduction. User pause persists through off-screen suspension and preference/viewport changes within the page. Off-screen and hidden-tab render loops stop. Live reduced-motion or narrow-viewport changes destroy the canvases; static ornaments and readable content remain. Without JavaScript, the pause button stays hidden and all content remains available.

The existing frontend presentation module owns page recipes. Unmapped routes remain neutral and still. No CMS fields, public APIs, care records, payment logic or database migrations change. The kit's stock page/frame typography and its global force-motion API are not adopted. Future adaptations must retain explicit pause, automatic suspension and static fallbacks.

Primary accessibility references checked 2026-11-02: [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) and [reduced-motion technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39). These define design/test targets, not a whole-site accessibility certification. Physical-device, screen-reader and low-end-device performance results must be reported separately.

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

### Payload CMS experience and plugin research — 2026-11-04

The user requested research into making the current CMS more useful and complete. [The CMS options report](PAYLOAD_CMS_OPTIONS.md) compares core dashboard/branding, versions and preview with eight official packages and selected community navigation, activity and scheduling plugins. It records exact package metadata, source links, Astro integration, Render storage constraints and a proposed order of work. Dashboard widgets address the empty start screen; package installation alone does not create a tailored nurse workspace. These remain recommendations under P16, with no application or dependency change.

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

### Hosting deployment options

**Neon setup completed, C39 (2026-11-03):** the supplied production branch is authenticated, linked and reconciled through `neon deploy`. The existing Payload/node-postgres pool uses Neon's pooled runtime URL and direct migration URL. Schema and write workflows passed on a temporary schema-only Neon branch before the production migration/public seed and non-writing production smoke. The verification branch was deleted; Render app deployment remains pending. [Full command/database/browser evidence](NEON_SETUP.md) supersedes the earlier statements that Neon setup had not been performed. Driver guidance checked against [Neon connection methods](https://neon.com/docs/connect/choose-connection) and [pooling](https://neon.com/docs/connect/connection-pooling); existing ORM/driver/authentication were retained.

**Render Free correction, C38 (2026-11-03):** the selected single-service Blueprint now uses Free with an ordered startup command for migration, missing-content seed, first-admin bootstrap and app launch. First-admin credentials come from Render environment settings, so no paid pre-deploy feature, Render Shell or manual local seed/admin command is needed. Existing content/accounts/passwords are preserved. The current [setup guide](RENDER_DEPLOYMENT.md) supersedes earlier paid pre-deploy/shell recommendations. Primary sources rechecked: [pre-deploy availability](https://render.com/docs/deploys#pre-deploy-command), [Free sleep and shell limitations](https://render.com/docs/free). Actual Free memory and cloud operation remain unverified.

**Selected implementation, C37 (2026-11-02):** one Render Node service runs Astro and Payload/Next.js through a shared production proxy, with Neon PostgreSQL. Local SQLite remains supported. The launcher, Render Blueprint and initial PostgreSQL migration are implemented; [the deployment guide](RENDER_DEPLOYMENT.md) records setup, bootstrap, boundaries and recovery. No provider resource/deployment is claimed. Earlier multi-service, SQLite-disk and Firebase suggestions remain alternatives/history; instance capacity and actual billing still need verification.

Researched **2026-10-27**; prices in **USD**. **Historical proposal:** deploy Astro SSR and Payload/Next as two Node services, with a separate PostgreSQL database, on one provider. A static-site upload alone cannot run the current server-side enquiries and staff backend. The user subsequently selected Render and prioritised cost in the revision below; resource sizes and public-launch approval remain open.

| Option | Suggested starting arrangement and cost assumptions |
| --- | --- |
| **Render — preferred for predictable service pricing and managed database recovery** | Astro `0.5c-512mb` ($7/month), Payload `1c-2g` ($25/month), and Postgres `0.5c-1g` ($19/month): **$51/month compute**, before storage, excess traffic, tax and optional workspace fees. The $6/256MB database reduces the base to $38, but the 1GB database is the more conservative proposed launch starting point. Hobby workspace is $0; Pro adds $25/month. These are pricing calculations, not measured capacity guarantees. [Official pricing](https://render.com/pricing), [current compute plan names](https://render.com/docs/compute-plans). |
| **Railway — alternative for usage-based billing and one project canvas** | Pro has a **$20/month minimum including $20 usage**, rather than a $20 charge added to all resource usage. Container RAM is $10/GB/month, CPU $20/vCPU/month, volumes $0.15/GB/month and egress $0.05/GB. A planning allowance of **$35–$60/month** assumes roughly 3GB average aggregate RAM across both apps/database, modest CPU/traffic and small storage; actual usage must be measured. Hobby's $5 minimum suits a developer prototype; Pro is positioned for production teams. [Plans and usage rates](https://docs.railway.com/pricing/plans). |

**Persistence and recovery:** Render continuously backs up paid Postgres with a three-day PITR window on Hobby and seven days on Pro or higher; free databases have no recovery capability. Railway's maintained single-node PostgreSQL can be upgraded to HA; backups/PITR must be enabled and verified rather than assumed from creating a database. Railway supports scheduled volume backups, with retention of six days daily, 27 days weekly and 89 days monthly, and bills incremental backup storage. Neither proposed price is an HA configuration. [Render recovery](https://render.com/docs/postgresql-backups), [Railway PostgreSQL](https://docs.railway.com/databases/postgresql), [Railway backups](https://docs.railway.com/volumes/backups).

**Regions and repository:** Render offers Frankfurt and Singapore plus three US regions; Railway offers Amsterdam and Singapore plus California/Virginia. Neither lists a Kenya region. Keep apps and database together; measure Kenyan-network latency before choosing. This is not a data-protection approval. Both support monorepos: retain repository-root access to the shared workspace and configure separate app build/start commands, rather than hiding shared packages behind an app-only root directory. [Render regions](https://render.com/docs/regions), [Railway regions](https://docs.railway.com/deployments/regions), [Render monorepos](https://render.com/docs/monorepo-support), [Railway shared monorepos](https://docs.railway.com/deployments/monorepo).

#### Cost-first Render revision — 2026-10-28

**Confirmed direction:** Render, with the lowest feasible recurring cost. The earlier $51/month sizing is retained as a **superseded recommendation**, not a minimum hosting price. The options below are proposed configurations and advertised arithmetic, not proven capacity. They assume the $0 Hobby workspace, one instance per app, USD/month, and exclude domain registration, tax, overages and independent backup storage. [Current prices](https://render.com/pricing).

| Configuration | Base/month | Tradeoff or work required |
| --- | --- | --- |
| Free Astro SSR + paid 512MB Payload + 1GB SQLite disk | **$7.25** | Smallest change to the current architecture, but the public frontend sleeps after 15 idle minutes and can take about a minute to wake. |
| Two paid 512MB Node services + 1GB SQLite disk | **$14.25** | Lowest proposed always-on arrangement preserving separate SSR apps; test Payload within 512MB and implement SQLite recovery. |
| Two paid 512MB services + smallest paid Postgres | **$20 + database storage** | Adds a PostgreSQL adapter/migration; avoids operating SQLite backups on an app disk. |
| Future free static Astro + paid 512MB Payload + SQLite disk / paid Postgres | **$7.25 / $13 + database storage** | Requires moving dynamic forms/payment pages to a backend and rebuilding public content after CMS publication. This is application work, not a hosting toggle. [Static hosting](https://render.com/docs/static-sites). |

**Disk evidence and limits:** pricing is $0.25/GB/month; the [official Terraform example](https://raw.githubusercontent.com/render-oss/terraform-provider-render/main/docs/resources/web_service.md) explicitly configures a 1GB disk. The main docs do not state an absolute minimum; 10GB in the Blueprint reference is a default, not evidence of a 10GB minimum. Disks require a paid service, attach to one instance, cannot be shared between apps and disable zero-downtime deployment. Only the mount persists; include database sidecars. Disks are unavailable during build/pre-deploy commands, so SQLite initialization/migrations must account for runtime access. [Disk documentation](https://render.com/docs/disks).

**Recovery and free limits:** Render warns against restoring custom databases from disk snapshots because recovery can be corrupt. Use a SQLite-aware online backup, store copies independently and test restoration; snapshots alone are insufficient. Free web services cannot attach disks, and free Postgres expires after 30 days without backups. [SQLite backup API](https://www.sqlite.org/backup.html), [Render free limits](https://render.com/docs/free).

**Cohosting:** one paid service plus disk has a theoretical $7.25 base, but running Astro and Payload together needs routing/proxying, supervision and combined-memory checks. Render exposes one public HTTP port and explicitly recommends separate services. Do not promise this works within 512MB. [Port binding](https://render.com/docs/web-services#binding-to-multiple-ports), [Render FAQ](https://render.com/docs/faq#can-i-deploy-multiple-apps-to-a-single-render-service).

**Single-service SSR follow-up (2026-11-02, within P13):** the Astro public website and Payload/Next.js can be evaluated in one Render service with Neon as the external database. Astro already powers the webpage; the second application is the Payload/Next.js staff backend. This is a proposed topology, not a selected deployment or measured compatibility result. Rechecked primary sources: [Render's one-public-port constraint](https://render.com/docs/web-services#binding-to-multiple-ports), [Render's recommendation to separate applications](https://render.com/docs/faq#can-i-deploy-multiple-apps-to-a-single-render-service), and [Astro standalone/middleware modes](https://docs.astro.build/en/guides/integrations-guide/node/), accessed 2026-11-02.

One approach preserves both production servers behind a small reverse proxy in one container: forward `/admin`, `/api` and Next assets such as `/_next` to Payload/Next, and public pages including `/support` and `/payment/...` plus Astro assets to Astro. Only the proxy binds to Render's public `PORT`; app listeners can remain internal. Build both workspaces and supervise startup, shutdown and failures together; the current development launcher is not the production entry point. Preserve original host/protocol and reviewed client-address handling, existing form-origin checks and internal API authentication. This retains request-time CMS content and current server-side form/payment behaviour without static publishing automation, subject to routing and deployment verification. Astro middleware is another integration mechanism, but no combined custom server has been designed or validated.

The apps share memory, CPU, restarts and deployments. Render recommends separate services for resource isolation, although its documentation does not establish a blanket prohibition on multiple apps. A larger single instance could cost more than two small instances; do not promise the smallest plan will fit. With Neon, this arrangement needs no SQLite disk, but still requires the PostgreSQL adapter/migrations described below. Benchmark both apps together under public-page requests and authenticated staff editing before selecting capacity. Compared with static Firebase + Render, a combined-service interruption also affects the public pages. No application, container, process configuration, provider account or deployment was changed for this follow-up.

**Practical proposal:** trial the $7.25 sleeping-frontend option for a demo, or $14.25 for always-on; upgrade only if measured memory requires it. A local Windows Payload-only sample used about 137MiB warm RSS on read-only routes, supporting a trial but not proving Render/Linux or authenticated-editor capacity. No cloud deployment, load or backup-restore test has been performed.

#### Neon database alternative — 2026-10-28

**Proposed only (P14):** keep the Astro and Payload/Next applications on Render, and use Neon for Payload's PostgreSQL database. Neon now also offers Node.js Functions, but its current documentation explicitly distinguishes them from full-stack app hosting and says they do not host websites. They are not a drop-in host for this checkout's complete Next/Payload staff interface. [Neon Functions](https://neon.com/docs/compute/functions/overview).

| Arrangement | Advertised base/month, USD |
| --- | --- |
| Free Render Astro SSR + paid 512MB Render Payload + Neon Free | **$7**, with the public frontend's Render sleep/cold-start tradeoff |
| Paid Render Astro + paid 512MB Render Payload + Neon Free | **$14**, with both Render apps always on; the database can still idle |

These figures reuse the Render prices above, exclude other usage/taxes/domains and assume Payload fits 512MB. They remove the SQLite disk charge, not the Payload application host. Neon Free is conditional on usage, rather than a promise that this database will remain free indefinitely.

**Current free limits:** 1GB PostgreSQL storage per project (20GB total across the account), 100 CU-hours per project per month and 5GB public transfer per project per month. At 0.25 CU, 100 CU-hours covers **400 active hours**, less than a continuously active month. CU-hour or transfer exhaustion suspends compute until the next billing period or upgrade; storage-limit violations block operations that increase storage until capacity is freed or the plan changes. These limits do not delete data. The limited six-hour restore window does not establish a sufficient backup policy. [Neon plans and quota behaviour](https://neon.com/docs/introduction/plans).

**Idling:** Free compute necessarily suspends after five inactive minutes. Neon says the next query normally reactivates it within a few hundred milliseconds; this is a provider description, not measured end-to-end latency for this application. Repeated database queries and health checks can consume the compute allowance. [Scale to Zero](https://neon.com/docs/introduction/scale-to-zero).

**Required work:** replace the hardcoded SQLite adapter with a matching Payload PostgreSQL adapter, configure a server-only Neon TLS connection, review pooling/migration connections, and migrate/test the schema and any retained content. Changing DATABASE_URI alone cannot convert a SQLite file into PostgreSQL. Test cold starts, quota-failure feedback and restoration before live intake. [Payload PostgreSQL adapter](https://payloadcms.com/docs/database/postgres). No application changes, Neon account, deployment or migration are included in this proposal.

**Preparation required in this checkout (source inspection, not a deployed result):**

- The Astro app already uses Node standalone SSR. Keep the two applications and shared npm workspace accessible from the repository root; provide separate production builds/starts and bind each server to the provider's assigned port/interface. Use the project's supported Node 24.22.1 runtime. [Astro Node deployment](https://docs.astro.build/en/guides/integrations-guide/node/), [Payload deployment](https://payloadcms.com/docs/production/deployment).
- Payload currently hardcodes sqliteAdapter. The lowest-cost option keeps SQLite, configuring its persistent mount, runtime schema setup/migrations and SQLite-aware backup/restore. PostgreSQL remains an optional adapter/migration path with additional cost; it is not a deployment requirement. Keep local synthetic development data separate from the hosted database. [Payload PostgreSQL adapter](https://payloadcms.com/docs/database/postgres).
- Inject server secrets and actual WEB_URL/CMS_URL values through the host. WEB_URL must be correct when Astro is built because its host allowlist is compiled. The [CMS build helper](../scripts/next.mjs) unconditionally loads a local .env, and bootstrap scripts assume the same file; adapt them to accept host-injected environment variables without committing .env or production secrets.
- Review proxy/client-address handling and the process-local enquiry limiter, configure working email/password recovery, and verify HTTPS, staff access and live payment settings before accepting real enquiries. Keep a staging deployment private and synthetic: DEMO_MODE currently changes messaging/payment availability but does not disable enquiry storage.
- Existing photographs/fonts ship with the app and Payload has no upload collection. Object storage is unnecessary for this version; revisit it if staff-managed uploads are added. Render is preferred; region, resource sizing and live-data privacy requirements remain open.

An all-Vercel deployment is possible but would require replacing the Astro Node adapter and still providing persistent database services. Its Hobby plan is restricted to personal non-commercial use; Pro starts at $20/month plus applicable usage, so a free Hobby deployment is not the proposed business-hosting baseline. [Astro Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/), [Vercel plans](https://vercel.com/pricing), [Hobby terms](https://vercel.com/docs/plans/hobby). This is an alternative, not a statement that Payload cannot run on Vercel.

Provider documentation and published prices were checked; no cloud account, deployment, load test or restore test was performed. Prices/limits need confirmation in the chosen provider's checkout. Production database migration, environment/start commands and live-intake controls remain implementation work.

#### Firebase Hosting frontend + Render Payload + Neon — 2026-11-02

**Proposal P15, not an implementation or deployment selection:** the user's suggested split is viable. Host a statically built Astro public website on Firebase Hosting, retain Payload/Next.js and operational endpoints on one Render web service, and use Neon PostgreSQL for the database. The earlier two-Render-service arrangement preserves the current server-rendered application; it is not the only valid topology. Render also offers static hosting, so separating static content from server work enables the saving rather than Firebase alone.

**Current source boundary:** `apps/web/astro.config.mjs` selects Node standalone SSR. Public pages fetch Payload content at request time through `src/lib/cms.ts`; `src/pages/support.astro` validates POST submissions and forwards them with a server-only internal key; `src/pages/payment/[reference].astro` retrieves private payment summaries server-side. Firebase Hosting's static file service cannot execute these existing handlers by uploading the current build.

**Recommended low-cost adaptation:** generate public service/training routes at build time from Payload's public feeds; handle intake validation, abuse controls and private payment pages on Render. Preserve progressive enhancement and usable form errors when changing the form destination. Browser requests must not contain the existing internal API key or database credentials: add an explicitly public, validated submission boundary rather than exposing the trusted internal endpoint. Restrict cross-origin browser access where needed, and keep private payment/intake data out of generated HTML and public feeds. Domain and origin handling require review; this is more than changing `output` in Astro's configuration.

**Nurse editing:** retain the Payload editor and trigger a CI build/deploy after public-content changes, with a manual retry path. Updated public content becomes visible after the build/deployment completes. A failed CMS fetch/build should retain the previous published site rather than publish empty fallback content. The public pages can then load without a running Render frontend; form submissions and private pages still depend on Render. Existing visual interactions do not inherently require server rendering.

**Cost and limits:** Firebase Hosting provides CDN delivery and automatic SSL, with no-cost quotas currently including 10GB hosting storage and 10GB/month transfer. On Spark, exceeding transfer allowance can disable the site after a grace period; free hosting is conditional on usage. One paid Render CMS service replaces the two paid app services in the earlier estimate, subject to measured memory requirements and Neon limits. This is a proposal, not a measured capacity or billing result.

**SSR alternative:** the Astro server can instead run in Cloud Run (with Firebase Hosting routing requests to it), or dynamic handlers can use Cloud Functions. These require a billing account/Blaze and introduce a Google server runtime alongside Render. They preserve dynamic capabilities but do not deliver the same static-only operational simplicity. Firebase App Hosting is a separate product; its preconfigured framework support currently lists Next.js and Angular. Do not assume an existing Astro standalone build has automatic App Hosting integration.

Primary sources accessed **2026-11-02**: [Firebase Hosting capabilities](https://firebase.google.com/docs/hosting), [Hosting quotas and overage behaviour](https://firebase.google.com/docs/hosting/usage-quotas-pricing), [Hosting with Functions/Cloud Run and billing requirements](https://firebase.google.com/docs/hosting/serverless-overview), [App Hosting framework support](https://firebase.google.com/docs/app-hosting/frameworks-tooling), [Astro rendering modes](https://docs.astro.build/en/guides/on-demand-rendering/). Architecture recommendations and source-based observations above are our analysis. No application configuration, provider account, deployment or database migration was changed or tested for P15.

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

## Public website improvement candidates — 2026-11-04

**Status: proposals for discussion, not approved implementation.** Keep the official light gold/cream identity, continuous flowing vines, photographs and existing navigation. The rejected rose sprays, page borders and torn-card treatment remain superseded. No live-site, field-performance or nurse/family usability audit was performed for these recommendations. Sources below were accessed on 2026-11-04; source facts and our proposed applications are distinguished explicitly.

### 1. Show the people and explain the actual service

Source inspection finds values and an invitation to ask who provides support on [About](../apps/web/src/pages/about.astro), but no named team profiles. Service pages already show audience, generic fee guidance, a request action and next steps. **Proposal:** add consented staff portraits, names, verified qualifications and responsibilities, then make each service's expectations specific: delivery setting, coverage, what happens during the first conversation, what is included and which costs need discussion. Publish hours, response windows and prices only after the team confirms them. Extend the existing acknowledgement with verified contact/response information; nurse review and appointment agreement remain unchanged. This is our recommendation, not a measured conversion finding. Never substitute stock subjects for staff or invent testimonials, partners or outcome figures.

### 2. Build a small, maintained resource library

**Observed reference:** [Sue Ryder's grief-support hub](https://www.sueryder.org/grief-support/) separates coping with grief, supporting another person, and support for children. Its [supporting-someone section](https://www.sueryder.org/grief-support/supporting-someone-bereaved/) links short, specific questions and practical topics. C04 already requires nurses to edit resources; the current static article lacks that editing path. **Proposal:** expand it into three to six original guides, grouped by family situation, with reviewer, review date and a relevant support link. Start with preparation and practical questions; clinical guidance requires professional review. The [NHS content policy](https://www.nhs.uk/our-policies/content-policy/) describes clinical sign-off and maintenance as its own editorial process; borrow the accountability principle, not NHS branding or an assumption of Kenyan compliance. Its displayed review date is old, so it is an editorial example rather than a current local requirement.

### 3. Refine composition and motion without another redesign

**Source guidance:** [W3C's carousel tutorial](https://www.w3.org/WAI/tutorials/carousels/) calls for keyboard operation, comprehensible focus, announced changes and control of movement. Its [animation-from-interactions guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) explains reduced-motion support; that specific criterion is Level AAA, not an AA requirement. **Proposal:** refine photo crops, subject placement, section rhythm and the space around calls to action. Retain the existing manual training carousel and reduced-motion behaviour. Evaluate any new movement separately with families and phone users; the reverted floral-kit motions are not implicitly reapproved. A passing component check would not establish whole-site accessibility.

### 4. Make local information discoverable when launch-ready

**Source facts:** [Google Business Profile eligibility](https://support.google.com/business/answer/13763036?hl=en) generally requires in-person customer contact. Its [service-area guidance](https://support.google.com/business/answer/9157481?hl=en) says businesses visiting customers without receiving them at their own address should use a service-area profile and remove the customer-facing address. [Google's structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) require accurate, visible supporting content and do not guarantee rich results. **Proposal:** confirm real service areas and contacts, assess profile eligibility, and complement existing metadata with a published-content sitemap and appropriate organisation/breadcrumb data. Never invent a clinic address or claim rankings. Preserve demo/preview noindex until launch approval; private records and unpublished drafts stay outside public discovery.

### 5. Measure speed before changing infrastructure

**Source targets:** [Web Vitals](https://web.dev/articles/vitals) defines good field thresholds as LCP at most 2.5 seconds, INP at most 200 milliseconds and CLS at most 0.1, assessed at the 75th percentile separately for mobile and desktop. These are targets, not this site's measured results. **Proposal:** compare warm and cold page loads and real-phone performance before prioritising work. Inspect public CMS overfetch and image delivery; only introduce bounded, invalidation-aware public caching if measurements justify it. Keep private responses, authenticated previews and drafts out of shared caches. A local Lighthouse result cannot establish real-user performance or production uptime.

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
