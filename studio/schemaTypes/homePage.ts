import {defineField, defineType} from 'sanity'

/**
 * Singleton document — exactly one per Sanity dataset.
 * The pageBuilder array allows the customer to compose the homepage
 * from any combination of widgets in any order.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO Titel',
      type: 'string',
      description: 'Erscheint im Browser-Tab und in Suchmaschinen.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta-Beschreibung',
      type: 'text',
      rows: 3,
      description: 'Kurzbeschreibung für Suchmaschinen (150–160 Zeichen).',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Seitenaufbau',
      type: 'array',
      of: [
        {type: 'heroWidget'},
        {type: 'hero2Widget'},
        {type: 'heroTextWidget'},
        {type: 'noteWidget'},
        {type: 'featuresWidget'},
        {type: 'contentWidget'},
        {type: 'stepsWidget'},
        {type: 'faqsWidget'},
        {type: 'statsWidget'},
        {type: 'callToActionWidget'},
        {type: 'testimonialsWidget'},
        {type: 'pricingWidget'},
        {type: 'brandsWidget'},
        {type: 'blogLatestPostsWidget'},
        {type: 'contactWidget'},
      ],
      options: {
        // Show type selection modal with readable titles
        insertMenu: {
          groups: [
            {name: 'hero', title: 'Hero', of: ['heroWidget', 'hero2Widget', 'heroTextWidget']},
            {name: 'content', title: 'Content', of: ['contentWidget', 'featuresWidget', 'stepsWidget']},
            {name: 'social', title: 'Social Proof', of: ['testimonialsWidget', 'statsWidget', 'brandsWidget']},
            {name: 'conversion', title: 'Conversion', of: ['callToActionWidget', 'pricingWidget', 'contactWidget']},
            {name: 'misc', title: 'Sonstiges', of: ['noteWidget', 'faqsWidget', 'blogLatestPostsWidget']},
          ],
        },
      },
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title ?? 'Homepage'}
    },
  },
})
