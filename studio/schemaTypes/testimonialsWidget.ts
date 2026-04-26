import {defineField, defineType} from 'sanity'

export const testimonialsWidget = defineType({
  name: 'testimonialsWidget',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'testimonialItem',
          fields: [
            defineField({name: 'title', title: 'Überschrift (optional)', type: 'string'}),
            defineField({
              name: 'testimonial',
              title: 'Zitat',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'job', title: 'Position / Unternehmen', type: 'string'}),
            defineField({
              name: 'image',
              title: 'Profilbild',
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
          ],
          preview: {
            select: {title: 'name', subtitle: 'testimonial'},
          },
        },
      ],
    }),
    defineField({
      name: 'callToAction',
      title: 'Button',
      type: 'ctaButton',
    }),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: `Testimonials: ${title ?? '(kein Titel)'}`}
    },
  },
})
