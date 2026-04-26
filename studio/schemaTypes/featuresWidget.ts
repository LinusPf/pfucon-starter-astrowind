import {defineField, defineType} from 'sanity'

/**
 * Covers Features, Features2, Features3 via the `variant` field.
 * All three share the same Feature interface in src/types.d.ts.
 */
export const featuresWidget = defineType({
  name: 'featuresWidget',
  title: 'Features (Grid)',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variante',
      type: 'string',
      options: {
        list: [
          {title: 'Features (Standard)', value: 'features'},
          {title: 'Features 2 (Icons farbig)', value: 'features2'},
          {title: 'Features 3 (kompakt)', value: 'features3'},
        ],
      },
      initialValue: 'features',
    }),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Feature-Items',
      type: 'array',
      of: [{type: 'widgetItem'}],
    }),
    defineField({
      name: 'columns',
      title: 'Spalten',
      type: 'number',
      options: {list: [2, 3, 4]},
      initialValue: 3,
    }),
    defineField({
      name: 'defaultIcon',
      title: 'Standard-Icon (falls Item kein eigenes hat)',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Begleitbild (optional)',
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
      name: 'callToAction1',
      title: 'Primär-Button',
      type: 'ctaButton',
    }),
    defineField({
      name: 'callToAction2',
      title: 'Sekundär-Button',
      type: 'ctaButton',
    }),
    defineField({name: 'isReversed', title: 'Layout umkehren', type: 'boolean', initialValue: false}),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', variant: 'variant'},
    prepare({title, variant}) {
      const label = variant === 'features2' ? 'Features2' : variant === 'features3' ? 'Features3' : 'Features'
      return {title: `${label}: ${title ?? '(kein Titel)'}`}
    },
  },
})
