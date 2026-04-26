import {ctaButton, widgetItem} from './shared'
import {heroWidget} from './heroWidget'
import {hero2Widget} from './hero2Widget'
import {heroTextWidget} from './heroTextWidget'
import {noteWidget} from './noteWidget'
import {featuresWidget} from './featuresWidget'
import {contentWidget} from './contentWidget'
import {stepsWidget} from './stepsWidget'
import {faqsWidget} from './faqsWidget'
import {statsWidget} from './statsWidget'
import {callToActionWidget} from './callToActionWidget'
import {testimonialsWidget} from './testimonialsWidget'
import {pricingWidget} from './pricingWidget'
import {brandsWidget} from './brandsWidget'
import {blogLatestPostsWidget} from './blogLatestPostsWidget'
import {contactWidget} from './contactWidget'
import {homePage} from './homePage'

// Shared object types must be registered before widgets that reference them.
export const schemaTypes = [
  // Shared objects
  ctaButton,
  widgetItem,
  // Widget object types (used inside homePage.pageBuilder)
  heroWidget,
  hero2Widget,
  heroTextWidget,
  noteWidget,
  featuresWidget,
  contentWidget,
  stepsWidget,
  faqsWidget,
  statsWidget,
  callToActionWidget,
  testimonialsWidget,
  pricingWidget,
  brandsWidget,
  blogLatestPostsWidget,
  contactWidget,
  // Document types
  homePage,
]
