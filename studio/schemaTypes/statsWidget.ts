import {defineField, defineType} from 'sanity'

export const statsWidget = defineType({
  name: 'statsWidget',
  title: 'Stats (Kennzahlen)',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'stats',
      title: 'Kennzahlen',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'statItem',
          fields: [
            defineField({
              name: 'amount',
              title: 'Wert (z. B. "132K")',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'title', title: 'Bezeichnung', type: 'string'}),
            defineField({name: 'icon', title: 'Icon', type: 'string'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'amount'},
          },
        },
      ],
    }),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: `Stats: ${title ?? '(kein Titel)'}`}
    },
  },
})
