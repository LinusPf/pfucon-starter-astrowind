import {defineField, defineType} from 'sanity'

/**
 * The full-width CTA section widget (nicht der einzelne Button).
 * Maps to CallToAction widget in src/components/widgets/CallToAction.astro
 */
export const callToActionWidget = defineType({
  name: 'callToActionWidget',
  title: 'Call to Action (Sektion)',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'actions',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'ctaButton'}],
    }),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: `CTA: ${title ?? '(kein Titel)'}`, subtitle}
    },
  },
})
