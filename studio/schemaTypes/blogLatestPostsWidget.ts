import {defineField, defineType} from 'sanity'

/**
 * Only controls the section header/config.
 * Blog post content stays in Markdown (src/content/post/).
 */
export const blogLatestPostsWidget = defineType({
  name: 'blogLatestPostsWidget',
  title: 'Blog: Neueste Beiträge',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Überschrift', type: 'string'}),
    defineField({name: 'information', title: 'Infotext (unter Überschrift)', type: 'text', rows: 3}),
    defineField({name: 'linkText', title: 'Link-Text (z. B. "Alle Beiträge")', type: 'string'}),
    defineField({name: 'linkUrl', title: 'Link-URL', type: 'string'}),
    defineField({
      name: 'count',
      title: 'Anzahl der Beiträge',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(12),
    }),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: `Blog-Posts: ${title ?? '(kein Titel)'}`}
    },
  },
})
