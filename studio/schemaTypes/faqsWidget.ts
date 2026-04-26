import {defineField, defineType} from 'sanity'

export const faqsWidget = defineType({
  name: 'faqsWidget',
  title: 'FAQs',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Fragen & Antworten',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Frage',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Antwort',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'icon', title: 'Icon', type: 'string'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        },
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Spalten',
      type: 'number',
      options: {list: [1, 2]},
      initialValue: 1,
    }),
    defineField({name: 'iconUp', title: 'Icon offen', type: 'string', initialValue: 'tabler:chevron-up'}),
    defineField({name: 'iconDown', title: 'Icon geschlossen', type: 'string', initialValue: 'tabler:chevron-down'}),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: `FAQs: ${title ?? '(kein Titel)'}`}
    },
  },
})
