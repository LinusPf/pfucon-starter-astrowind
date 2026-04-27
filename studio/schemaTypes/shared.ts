import {defineField, defineType} from 'sanity'

/**
 * Reusable CTA button/link object.
 * Maps to CallToAction interface in src/types.d.ts
 */
export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'Button / Link',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
    }),
    defineField({
      name: 'variant',
      title: 'Stil',
      type: 'string',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Tertiary', value: 'tertiary'},
          {title: 'Link', value: 'link'},
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'icon',
      title: 'Icon (Tabler-Name, z. B. tabler:download)',
      type: 'string',
    }),
    defineField({
      name: 'target',
      title: 'Target',
      type: 'string',
      options: {list: ['_blank', '_self']},
    }),
  ],
  preview: {
    select: {title: 'text', subtitle: 'href'},
  },
})

/**
 * Generic item used in Features, Steps, FAQs, Content items[].
 * Maps to Item interface in src/types.d.ts
 */
export const widgetItem = defineType({
  name: 'widgetItem',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'description', title: 'Beschreibung', type: 'text', rows: 3}),
    defineField({
      name: 'icon',
      title: 'Icon (Tabler-Name, z. B. tabler:rocket)',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Bild',
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
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
