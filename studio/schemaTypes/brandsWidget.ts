import {defineField, defineType} from 'sanity'

export const brandsWidget = defineType({
  name: 'brandsWidget',
  title: 'Brands (Logos)',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'images',
      title: 'Logo-Bilder',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt-Text (Firmenname)',
              type: 'string',
              validation: (Rule) => Rule.required().error('Alt-Text ist Pflicht für Barrierefreiheit und SEO'),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'icons',
      title: 'Icon-Namen (alternativ zu Bildern)',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: `Brands: ${title ?? '(kein Titel)'}`}
    },
  },
})
