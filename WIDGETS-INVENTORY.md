# Widgets Inventory — AstroWind Homepage

Generated for Phase 1 of the PfuCon Starter Sanity Integration.

## Widgets used in `src/pages/index.astro`

| # | Widget | Component | Sanity Schema (Phase 2) |
|---|--------|-----------|-------------------------|
| 1 | **Hero** | `~/components/widgets/Hero.astro` | `heroWidget.ts` |
| 2 | **Note** | `~/components/widgets/Note.astro` | `noteWidget.ts` |
| 3 | **Features** | `~/components/widgets/Features.astro` | `featuresWidget.ts` |
| 4 | **Features2** | `~/components/widgets/Features2.astro` | reuses `featuresWidget.ts` |
| 5 | **Steps** | `~/components/widgets/Steps.astro` | `stepsWidget.ts` |
| 6 | **Content** | `~/components/widgets/Content.astro` (×3) | `contentWidget.ts` |
| 7 | **BlogLatestPosts** | `~/components/widgets/BlogLatestPosts.astro` | `blogLatestPostsWidget.ts` |
| 8 | **FAQs** | `~/components/widgets/FAQs.astro` | `faqsWidget.ts` |
| 9 | **Stats** | `~/components/widgets/Stats.astro` | `statsWidget.ts` |
| 10 | **CallToAction** | `~/components/widgets/CallToAction.astro` | `callToActionWidget.ts` |

**Total on homepage: 10 unique widget types (Content used 3 times)**

---

## All available widgets in `src/components/widgets/`

These also need Sanity schemas so customers can add them via the Page Builder.

| # | Widget | Used on homepage | Sanity Schema (Phase 2) |
|---|--------|-----------------|-------------------------|
| 1 | Announcement | — | `announcementWidget.ts` |
| 2 | BlogHighlightedPosts | — | `blogHighlightedPostsWidget.ts` |
| 3 | BlogLatestPosts | ✅ | `blogLatestPostsWidget.ts` |
| 4 | Brands | — | `brandsWidget.ts` |
| 5 | CallToAction | ✅ | `callToActionWidget.ts` |
| 6 | Contact | — | `contactWidget.ts` |
| 7 | Content | ✅ | `contentWidget.ts` |
| 8 | FAQs | ✅ | `faqsWidget.ts` |
| 9 | Features | ✅ | `featuresWidget.ts` |
| 10 | Features2 | ✅ | reuses `featuresWidget.ts` |
| 11 | Features3 | — | reuses `featuresWidget.ts` |
| 12 | Hero | ✅ | `heroWidget.ts` |
| 13 | Hero2 | — | `hero2Widget.ts` |
| 14 | HeroText | — | `heroTextWidget.ts` |
| 15 | Note | ✅ | `noteWidget.ts` |
| 16 | Pricing | — | `pricingWidget.ts` |
| 17 | Stats | ✅ | `statsWidget.ts` |
| 18 | Steps | ✅ | `stepsWidget.ts` |
| 19 | Steps2 | — | reuses `stepsWidget.ts` |
| 20 | Testimonials | — | `testimonialsWidget.ts` |

Layout components (Header, Footer) are excluded — these are not page-builder widgets.

---

## Props per Widget

### Shared base types

**Widget** (base for all page widgets):
```
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string | Record<string, string>>
```

**Headline** (extended by most widgets):
```
title?: string
subtitle?: string
tagline?: string
classes?: Record<string, string>
```

**Item** (used in items[] arrays):
```
title?: string
description?: string
icon?: string
classes?: Record<string, string>
callToAction?: CallToAction
image?: Image
```

**CallToAction** (button/link):
```
variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
text?: string
href?: string
icon?: string
target?: string
type?: 'button' | 'submit' | 'reset'
classes?: Record<string, string>
```

**Image**:
```
src: string
alt?: string
```

---

### 1. Hero
Extends `Headline` (without classes) + `Widget` (without isDark, classes)
```
title?: string          — slot or prop, supports HTML fragments
subtitle?: string       — slot or prop, supports HTML fragments
tagline?: string
content?: string
actions?: CallToAction[]
image?: { src: string, alt: string }
id?: string
bg?: string
```

### 2. Note
```
icon?: string           — default: 'tabler:info-square'
title?: string
description?: string
```

### 3. Features / Features2 / Features3
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
items?: Item[]
columns?: number
defaultIcon?: string
image?: Image
video?: { src: string, type?: string }
callToAction1?: CallToAction
callToAction2?: CallToAction
isReversed?: boolean
isBeforeContent?: boolean
isAfterContent?: boolean
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 4. Content
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
content?: string        — portableText / rich text block
image?: Image
items?: Item[]
columns?: number
isReversed?: boolean
isAfterContent?: boolean
callToAction?: CallToAction
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```
Slots: `content` (rich HTML), `bg`

### 5. Steps / Steps2
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
items?: Item[]          — each item: title, description, icon
callToAction?: CallToAction
image?: Image
isReversed?: boolean
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 6. FAQs
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
iconUp?: string
iconDown?: string
items?: Item[]          — each item: title (question), description (answer)
columns?: number
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 7. Stats
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
stats?: Array<{ amount: string|number, title: string, icon?: string }>
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 8. CallToAction
Extends `Widget`
```
title?: string          — slot
subtitle?: string       — slot
actions?: CallToAction[]
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```
Slots: `title`, `subtitle`, `bg`

### 9. BlogLatestPosts
Extends `Widget`
```
title?: string
linkText?: string
linkUrl?: string | URL
information?: string
count?: number          — number of posts to display
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```
Note: Content stays Markdown — Sanity schema only controls the section header/config.

### 10. Testimonials
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
testimonials?: Array<{
  title?: string
  testimonial?: string
  name?: string
  job?: string
  image?: string | Image
}>
callToAction?: CallToAction
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 11. Pricing
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
prices?: Array<{
  title?: string
  subtitle?: string
  description?: string
  price?: number | string
  period?: string
  items?: Item[]
  callToAction?: CallToAction
  hasRibbon?: boolean
  ribbonTitle?: string
}>
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 12. Brands
Extends `Headline` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
icons?: string[]        — icon names
images?: Image[]        — brand logo images
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 13. Hero2
Similar to Hero, separate component for alternate layout.

### 14. HeroText
Text-only hero variant, no image.

### 15. Contact
Extends `Headline` + `Form` + `Widget`
```
title?: string
subtitle?: string
tagline?: string
inputs?: Array<{ type, name, label?, autocomplete?, placeholder? }>
textarea?: { label?, name?, placeholder?, rows? }
disclaimer?: { label? }
button?: string
description?: string
id?: string
isDark?: boolean
bg?: string
classes?: Record<string, string>
```

### 16. Announcement
Separate banner widget, not page-builder based.

### 17. BlogHighlightedPosts
Variant of BlogLatestPosts with highlighted/pinned posts.

---

## Phase 2 Schema Files to Create

Minimum set (covers all homepage widgets + common marketing widgets):

```
studio/schemaTypes/
  heroWidget.ts
  hero2Widget.ts
  heroTextWidget.ts
  noteWidget.ts
  featuresWidget.ts       — covers Features, Features2, Features3
  contentWidget.ts
  stepsWidget.ts          — covers Steps, Steps2
  faqsWidget.ts
  statsWidget.ts
  callToActionWidget.ts
  testimonialsWidget.ts
  pricingWidget.ts
  brandsWidget.ts
  blogLatestPostsWidget.ts
  contactWidget.ts
  homePage.ts             — Page Builder document with pageBuilder array
```
