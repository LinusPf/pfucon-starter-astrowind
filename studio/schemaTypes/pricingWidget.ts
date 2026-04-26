import {defineField, defineType} from 'sanity'

export const pricingWidget = defineType({
  name: 'pricingWidget',
  title: 'Pricing (Preistabelle)',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'prices',
      title: 'Pakete',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'priceItem',
          fields: [
            defineField({name: 'title', title: 'Paketname', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'subtitle', title: 'Kurzbeschreibung', type: 'string'}),
            defineField({name: 'description', title: 'Beschreibung', type: 'text', rows: 3}),
            defineField({name: 'price', title: 'Preis (z. B. "29" oder "auf Anfrage")', type: 'string'}),
            defineField({name: 'period', title: 'Zeitraum (z. B. "/ Monat")', type: 'string'}),
            defineField({
              name: 'items',
              title: 'Features im Paket',
              type: 'array',
              of: [{type: 'widgetItem'}],
            }),
            defineField({
              name: 'callToAction',
              title: 'Button',
              type: 'ctaButton',
            }),
            defineField({name: 'hasRibbon', title: 'Highlight-Ribbon anzeigen', type: 'boolean', initialValue: false}),
            defineField({name: 'ribbonTitle', title: 'Ribbon-Text (z. B. "Beliebt")', type: 'string'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'price'},
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
      return {title: `Pricing: ${title ?? '(kein Titel)'}`}
    },
  },
})
