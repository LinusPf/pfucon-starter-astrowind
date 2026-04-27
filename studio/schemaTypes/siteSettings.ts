import {defineField, defineType} from 'sanity'

/**
 * Singleton — nur ein Dokument pro Dataset.
 * Enthält globale Org-Schema-Daten und SEO-Defaults.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site-Einstellungen',
  type: 'document',
  fields: [
    defineField({name: 'siteName', title: 'Websitename', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'siteDescription', title: 'Beschreibung (SEO)', type: 'text', rows: 3, validation: (Rule) => Rule.max(160)}),
    defineField({
      name: 'defaultOgImage',
      title: 'Standard Open Graph Bild (1200×628)',
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

    // Organization / LocalBusiness Schema
    defineField({
      name: 'businessType',
      title: 'Unternehmenstyp (Schema.org)',
      type: 'string',
      options: {
        list: [
          {title: 'Organization', value: 'Organization'},
          {title: 'LocalBusiness', value: 'LocalBusiness'},
          {title: 'Restaurant', value: 'Restaurant'},
          {title: 'MedicalBusiness', value: 'MedicalBusiness'},
          {title: 'LegalService', value: 'LegalService'},
          {title: 'FinancialService', value: 'FinancialService'},
          {title: 'HomeAndConstructionBusiness', value: 'HomeAndConstructionBusiness'},
          {title: 'ProfessionalService', value: 'ProfessionalService'},
        ],
      },
      initialValue: 'Organization',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: false},
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
      name: 'address',
      title: 'Adresse',
      type: 'object',
      fields: [
        defineField({name: 'streetAddress', title: 'Straße & Hausnummer', type: 'string'}),
        defineField({name: 'addressLocality', title: 'Ort', type: 'string'}),
        defineField({name: 'postalCode', title: 'PLZ', type: 'string'}),
        defineField({name: 'addressCountry', title: 'Land (ISO 3166, z. B. AT)', type: 'string', initialValue: 'AT'}),
      ],
    }),
    defineField({name: 'telephone', title: 'Telefon (E.164, z. B. +43123456789)', type: 'string'}),
    defineField({name: 'email', title: 'E-Mail', type: 'string'}),
    defineField({name: 'url', title: 'Website-URL', type: 'url'}),
    defineField({
      name: 'openingHours',
      title: 'Öffnungszeiten',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'openingHoursEntry',
          fields: [
            defineField({
              name: 'days',
              title: 'Tage (z. B. "Mo-Fr" oder "Sa")',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'hours',
              title: 'Uhrzeiten (z. B. "09:00-17:00")',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'days', subtitle: 'hours'},
          },
        },
      ],
    }),
    defineField({
      name: 'socialProfiles',
      title: 'Social Media Profile',
      type: 'array',
      of: [{type: 'url'}],
      description: 'Vollständige URLs (https://linkedin.com/company/...)',
    }),

    // Search Console & Bing Verification (optional, alternativ zu Env-Vars)
    defineField({name: 'gscVerification', title: 'Google Search Console Verify-Code', type: 'string', description: 'Nur der Code, nicht der ganze Meta-Tag'}),
    defineField({name: 'bingVerification', title: 'Bing Webmaster Verify-Code', type: 'string'}),
  ],
  preview: {
    select: {title: 'siteName'},
    prepare({title}) {
      return {title: `Site-Einstellungen: ${title ?? '(nicht konfiguriert)'}`}
    },
  },
})
