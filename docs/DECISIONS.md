# Decisions and open questions

First recorded: 2026-10-26. Last updated: 2026-10-26.

This register is the authority for project decision status. The earlier pasted conversation has no known original date; entries imported from it use the recording date, not an invented decision date.

The original business text is in [the business brief](BUSINESS_BRIEF.md). Detailed reasoning and sources are in [research and options](RESEARCH_AND_OPTIONS.md).

## Status definitions

| Status | Meaning |
| --- | --- |
| Confirmed | Explicitly supplied or selected by the user. Founder-supplied business statements still require evidence before being described as independently verified. |
| Delegated default | Chosen by the assistant within discretion explicitly delegated by the user. The user may revise it. |
| Proposed | An assistant recommendation or brainstormed option. It has not been selected. |
| Superseded | Earlier advice or direction displaced by later requirements or evidence. Retained to explain the change. |
| Open | Information or a choice still needed. No implicit selection should be made from a shortlist. |

Research verification is a separate issue: an externally supported fact can inform a proposal without making the proposal approved.

## Confirmed requirements

| ID | Requirement | Source or evidence of intent | Consequence |
| --- | --- | --- | --- |
| C01 | Use the supplied Life Transitions Support Partners identity, nurse-led Nairobi context, services, commitments, and tagline. | The user's formal business description, preserved in full in the business brief. | Preserve the six service areas and the complimentary spiritual-care description. Do not invent legal status or credentials. |
| C02 | Astro is the public frontend. | The supplied earlier conversation ends with "ASTRO IS GOOD"; the user later explicitly selected Astro with Payload. | Frontend selection is confirmed. Dependency versions and local adapter settings are implementation defaults, not production-hosting choices. |
| C03 | Launch includes service browsing, phone/WhatsApp contact, short callback/training-enquiry forms, detailed intake, appointment booking, and online payments. | Asked what someone should be able to do at launch, the user answered "all of the above" to the three offered capability levels. | Preserve the full capability scope. Detailed fields, appointment rules, and chargeable offerings remain open. This does not automatically require accounts, medical-document uploads, or a full clinical record system. |
| C04 | Nurses need a simple editor for content updates. | The user selected "The nurses need a simple editor" for service descriptions, resources, and training dates. | Payload supplies the editor. Actual staff usability and final content ownership still need review. |
| C05 | Establish complete documentation and a proper root AGENTS.md before continuing product planning. | The user requested everything discussed be documented, requested online research for AGENTS.md, then instructed "Implement the plan." | Create the five agreed Markdown documents. Keep application setup outside this documentation task. |
| C06 | The original discovery stage was research and documentation without application code. | The initial request explicitly said "No code". | Historical boundary, later superseded for the runnable local MVP by C11. It remains important when interpreting earlier records. |
| C07 | Research at least seven relevant websites. | The user's original research request. | Eight reference websites are recorded, with evidence limits. A rendered visual audit remains outstanding. |
| C08 | Use Astro with Payload as the stack. | The user explicitly preferred Astro with Payload, citing perceived ease of use and plugin extensibility. | Payload is the selected editor/backend; Wagtail and other CMS comparisons are retained as history. Database and hosting choices are separate. |
| C09 | A nurse reviews care requests before confirming appointments. | The user selected "Nurse reviews first (Recommended)" for home visits, counselling and family support. | Submission is not confirmation. Local staff review and coordinate appointments manually. |
| C10 | Offer both group and private training formats. | The user selected "Both formats (Recommended)" for scheduled groups and private sessions for families/employers. | Support both enquiry types. Actual dates, curriculum, fees, certification and capacity rules remain open. |
| C11 | Build a runnable local MVP with the scope and boundaries in the initial plan. | After "Implement the plan", the user clarified "Build a runnable Astro + Payload MVP". | Application code is now authorised. Use Payload admin, no mandatory client accounts, manual care coordination, hosted payment links and a small resource section. No production deployment is requested. See the MVP plan for local defaults and launch prerequisites. |
| C12 | Refresh the public website with larger typography, photography and a warmer editorial composition. | The user found the text small and the website rigid, then instructed "Implement the plan" after the visual-refresh plan. | Adopt cream/green/terracotta, locally hosted Lora and DM Sans, 18–20px body text, lighter situation links, photo-led care/training sections and restrained motion. Apply readability improvements throughout the public pages. Backend workflows and production launch remain separate. |
| C13 | Use licensed stock photography now, with organisation photography as a later replacement. | The user selected "Licensed stock now (Recommended)" during refresh planning. | Use locally served Pexels assets with documented provenance. Do not imply they depict staff, clients, endorsements or Kenyan locations. See the asset register in research and options. |
| C14 | Add gentle homepage snapping and parallax on desktop only. | The user selected "Gentle snap + parallax (Recommended)" and "Desktop effects only (Recommended)", then authorised the implementation plan. | Native proximity snapping applies above 1100px; photographs and decorative layers move subtly in supporting browsers. Phones, content pages, forms and reduced-motion mode retain ordinary scrolling. No full-screen mandatory steps or scroll interception. |
| C15 | Distinguish navigation, sections and footer; widen content-page compositions and make interaction feedback visible. | The user requested subtle warmth in side spaces, less uniform cream, a distinct footer, roomier text pages, a sticky header that hides down/reappears up, plus hover effects and shadows. The user instructed "Implement the plan." | Use sage navigation, distinct homepage colour bands, original gutter artwork, a deep-green footer, article/aside layouts and consistent hover/focus treatment. The detailed behaviours and accessibility defaults are recorded in research and options. |

## Delegated default

| ID | Choice | Delegation and rationale | Revision boundary |
| --- | --- | --- | --- |
| D01 | Lead the homepage with families seeking support; provide clear caregiver-training and professional-referral routes. | The user answered "Choose what's best. If i dont like it. ill request a change" to the homepage-audience question. The assistant chose families because they need immediate, understandable access to care. | This is an adopted default within that specific delegation, not blanket approval of the palette, backend, workflows, or every assistant suggestion. |

## Proposals

All entries below remain proposals. Their detailed descriptions and alternatives are maintained in the research document.

| ID | Proposal | Rationale or tradeoff |
| --- | --- | --- |
| P01 | Use situation-led navigation, a concise family-focused introduction, and visible contact routes. | Visitors should not need to understand professional service categories to find help. |
| P03 | Define a small custom system of semantic design tokens and reusable components. Start with Astro components and platform features; add React/Radix/shadcn only where useful. | Provides custom design without adopting a large product-UI system or unnecessary browser JavaScript. |
| P04 | Target WCAG 2.2 AA and test the finished mobile and assistive-technology experience. | Accessibility is important for stressed visitors and caregivers; no compliance result is claimed. |
| P06 | Prerender suitable public content and handle private submissions and changing operational data through protected server workflows. | Keeps public pages lightweight while supporting intake, booking, and payments. Deployment and ownership boundaries remain open. |
| P07 | Give nurses structured editing fields and a limited set of reusable page sections. | Supports content updates without requiring code or unrestricted layout editing. A nurse usability check is still needed. |
| P09 | Finalise scheduled-course details, place reservations and payment timing. | Both formats are confirmed by C10. The local MVP records interest; instant booking, capacity enforcement and operational details remain open. |
| P10 | Evaluate hosted checkout or payment links from IntaSend or Pesapal; retain direct Daraja as an alternative. | Allows online payment without building a card-entry experience. No merchant approval, fee comparison, or provider selection has occurred. |
| P11 | Present spiritual support respectfully and explain the complimentary scope clearly. | The founder already identifies the service as free; inclusive wording and boundaries with other services need review. |
| P12 | Replace illustrative stock with consented organisation photography when available, alongside verifiable team information and clear next steps. | Authentic Kenyan people and homes remain the long-term imagery goal; C13 authorises licensed stock for the current refresh. No invented testimonials, qualifications or outcomes. |

## Superseded advice

| ID | Earlier suggestion | Why it no longer governs |
| --- | --- | --- |
| S01 | Launch with core pages, WhatsApp, and a callback form; postpone payments. | C03 explicitly includes payments, intake, and booking at launch. A simpler brochure-only launch may be reconsidered only through a later scope change. |
| S02 | Put training registration into a later growth phase as a blanket rule. | Launch now includes broader enquiries, booking, and payment capabilities. The exact training-registration offering is open; the old phasing cannot be treated as agreed scope. |
| S03 | Treat server-rendered Wagtail as the preferred public website and Astro as only the second choice. | Astro was selected as the public frontend; C08 subsequently selected Payload as the backend/CMS. Wagtail is now a historical alternative. |
| S04 | P05: leave Wagtail/Django versus Payload undecided. | C08 selects Payload. PostgreSQL has not been selected for production. |
| S05 | P08: nurse review before care confirmation is only a proposal. | The user's explicit booking choice confirms nurse review in C09. Other scheduling and payment rules remain open. |
| S06 | P02: the warm visual direction and exact font choice are wholly undecided; the local hero uses an illustration. | C12 adopts the warm editorial refresh with Lora/DM Sans and photography. The earlier cream/green illustration established a gentle starting point, but the user found its typography small and composition stiff. Alternative directions remain available for future revision. |

Earlier inaccurate technical claims, including a compulsory separate Astro backend and accessibility "for free", are corrected in [the evidence review](RESEARCH_AND_OPTIONS.md#corrections-to-earlier-advice). They are not project requirements.

## Open questions

| ID | Topic | What must be established |
| --- | --- | --- |
| O01 | Maintenance team and budget | Who will maintain the selected TypeScript-based stack, ongoing support costs, budget and acceptable vendor dependence. |
| O02 | Production data and editing | Payload is selected; SQLite is a local development default. Select production database/storage/migrations and validate nurse editing, preview, publishing and updates. |
| O03 | Hosting and data flow | Identify where public content, private records, uploads if needed, backups, logs, notifications, and vendor systems are processed and stored. Confirm relevant safeguards and transfer arrangements. |
| O04 | Detailed intake | Define necessary fields, who may submit for another person, consent/lawful-basis handling, identity checks if needed, staff access, retention, correction/deletion, and submission failure handling. Medical history, attachments, and client accounts are not assumed. |
| O05 | Appointment operations | Nurse review before confirmation is selected. Define staff availability, coverage, travel, durations, capacity and any remote appointments; local coordination is manual. |
| O06 | Prices and complimentary services | Set fees, travel charges, deposits, subsidies if any, and the precise free-service boundary. Preserve the original inclusion of family therapy/counselling under complimentary spiritual care while clarifying overlap. |
| O07 | Payment operations | Decide what is payable online, when charging occurs, who handles reconciliation, cancellation/refund rules, receipts, and failed or delayed payment handling. Complete merchant onboarding and provider evaluation. |
| O08 | Professional responsibilities | Confirm verified nursing/counselling/therapy credentials, who provides each service, clinical boundaries, escalation, and specialist referral responsibility. No hospital or emergency-service capability is assumed. |
| O09 | Training | Define each curriculum, prerequisites, duration, practical competency assessment, instructors, dates, delivery format, capacity, price, and the status of any certificate. |
| O10 | Referral network and support groups | Establish partners, vetting criteria, eligibility, costs, consent to sharing, feedback, and follow-up. Linking clients to groups does not itself require a website forum. |
| O11 | Privacy and regulatory review | Confirm the organisation's legal form, actual activities, ODPC classification/registration, health-data obligations, any impact assessment needs, and relevant professional requirements. |
| O12 | Brand and imagery | C12–C15 select the current local presentation, stock imagery and scrolling/layout direction. Final production identity/logo, organisation photography and permissions, and founder review of the finished presentation remain open. |
| O13 | Languages and accessibility | Decide whether English and Kiswahili are required at launch, who maintains translations, and whether additional contrast/theme options are needed. Agree acceptance checks for the proposed accessibility target. |
| O14 | Content ownership | Identify who drafts, clinically reviews, publishes, and updates service information, resources, training dates, and staff profiles. Confirm permission for any stories or testimonials. |
| O15 | Response and availability | Establish published hours and realistic callback/WhatsApp response expectations. Clarify emergency boundaries without implying a 24-hour or crisis service. |
| O16 | Ambiguous wording | Clarify "provider illness" and the intended scope of financial-goal guidance. Retain the original text until the founder resolves it. |

## Future ideas that are not commitments

Resource libraries, events, support-group directories, Kiswahili translations, high-contrast or dark themes, embedded scheduling tools, professional referral portals, and donations were discussed as possibilities. Their status is not upgraded by appearing in the research.

Content editing for resources and training dates is required by C04; the extent of any library or events platform remains open. Phone/WhatsApp contact is in C03, but automated messaging and chatbots have not been requested. A detailed intake workflow does not establish a full electronic health record or a client portal requirement.

## Updating this register

1. Record the user's direction or the explicit scope of a delegation.
2. Add or update the relevant entry, including rationale and recording date.
3. Mark displaced choices as superseded and explain what replaced them.
4. Update the affected detailed document and its links; avoid copying its full contents here.
5. Keep unknowns open until resolved. A researched capability or an assistant preference is not evidence of user selection.

## Suggested next planning sequence

The initial scope is in [the MVP plan](MVP_PLAN.md). The user selected Astro/Payload, nurse-reviewed care and both training formats, then authorised a runnable local build. Continue resolving the remaining operating, privacy, production-data and provider questions before public launch.

The local build uses reversible defaults; it does not settle unresolved real-world policies or authorise deployment.
