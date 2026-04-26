import {defineField, defineType} from 'sanity'

/**
 * Covers Steps and Steps2 via the `variant` field.
 */
export const stepsWidget = defineType({
  name: 'stepsWidget',
  title: 'Steps (Schritte)',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variante',
      type: 'string',
      options: {
        list: [
          {title: 'Steps (mit Bild)', value: 'steps'},
          {title: 'Steps 2 (ohne Bild)', value: 'steps2'},
        ],
      },
      initialValue: 'steps',
    }),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Schritte',
      type: 'array',
      of: [{type: 'widgetItem'}],
    }),
    defineField({
      name: 'image',
      title: 'Begleitbild',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt-Text ist Pflicht für Barrierefreiheit und SEO'),
        }),
      ],
    }),
    defineField({
      name: 'callToAction',
      title: 'Button',
      type: 'ctaButton',
    }),
    defineField({name: 'isReversed', title: 'Layout umkehren', type: 'boolean', initialValue: false}),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', variant: 'variant'},
    prepare({title, variant}) {
      const label = variant === 'steps2' ? 'Steps2' : 'Steps'
      return {title: `${label}: ${title ?? '(kein Titel)'}`}
    },
  },
})
