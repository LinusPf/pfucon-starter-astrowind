import {defineField, defineType} from 'sanity'

export const heroWidget = defineType({
  name: 'heroWidget',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'content',
      title: 'Zusatztext (unter Subtitle)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'actions',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'ctaButton'}],
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
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: `Hero: ${title ?? '(kein Titel)'}`, subtitle}
    },
  },
})
