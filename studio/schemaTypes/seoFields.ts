import {defineField, defineType} from 'sanity'

/**
 * Reusable SEO fields object — embed in any page document type.
 * Usage: defineField({ name: 'seo', type: 'seoFields' })
 */
export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'SEO Titel (überschreibt Standard)',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Ideal: unter 60 Zeichen'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta-Beschreibung',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Ideal: 150–160 Zeichen'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Bild (überschreibt Standard, 1200×628)',
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
      name: 'noindex',
      title: 'Seite aus Suchmaschinen ausschließen (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (nur bei Duplicate Content setzen)',
      type: 'url',
    }),
  ],
})
