import {defineField, defineType} from 'sanity'

export const videoBlock = defineType({
  name: 'videoBlock',
  title: 'Video (YouTube)',
  type: 'object',
  fields: [
    defineField({
      name: 'videoId',
      title: 'YouTube Video-ID',
      type: 'string',
      description: 'Die ID aus der YouTube-URL: youtube.com/watch?v=DIESE_ID',
      validation: (Rule) => Rule.required().regex(/^[a-zA-Z0-9_-]{11}$/, {name: 'YouTube ID', invert: false}),
    }),
    defineField({
      name: 'title',
      title: 'Titel / Barrierefreiheit-Label',
      type: 'string',
      description: 'Kurze Beschreibung des Videos (Pflicht für Barrierefreiheit).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Vorschaubild (optional)',
      type: 'image',
      description: 'Wird statt dem YouTube-Thumbnail angezeigt (DSGVO: kein Aufruf von YouTube beim Laden).',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Bildunterschrift (optional)',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'title', videoId: 'videoId', media: 'thumbnail'},
    prepare({title, videoId, media}) {
      return {
        title: title ?? 'Video',
        subtitle: videoId ? `ID: ${videoId}` : 'Keine ID',
        media,
      }
    },
  },
})
