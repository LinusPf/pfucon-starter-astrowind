import {defineField, defineType} from 'sanity'

export const heroTextWidget = defineType({
  name: 'heroTextWidget',
  title: 'Hero Text (kein Bild)',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'actions',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'ctaButton'}],
    }),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: `HeroText: ${title ?? '(kein Titel)'}`}
    },
  },
})
