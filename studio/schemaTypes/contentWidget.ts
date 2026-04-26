import {defineField, defineType} from 'sanity'

export const contentWidget = defineType({
  name: 'contentWidget',
  title: 'Content (Bild + Text)',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'content',
      title: 'Textblock (Rich Text)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'items',
      title: 'Aufzählungs-Items',
      type: 'array',
      of: [{type: 'widgetItem'}],
    }),
    defineField({
      name: 'columns',
      title: 'Spalten (Items)',
      type: 'number',
      options: {list: [1, 2]},
      initialValue: 1,
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
    defineField({name: 'isReversed', title: 'Bild rechts', type: 'boolean', initialValue: false}),
    defineField({name: 'isAfterContent', title: 'Folgt auf anderen Content-Block (reduzierter Abstand)', type: 'boolean', initialValue: false}),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: `Content: ${title ?? '(kein Titel)'}`, subtitle}
    },
  },
})
