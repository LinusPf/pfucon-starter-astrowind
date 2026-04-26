import {defineField, defineType} from 'sanity'

export const noteWidget = defineType({
  name: 'noteWidget',
  title: 'Note (Hinweisband)',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Label (z. B. "Philosophie:")', type: 'string'}),
    defineField({name: 'description', title: 'Text', type: 'string'}),
    defineField({
      name: 'icon',
      title: 'Icon (Tabler-Name)',
      type: 'string',
      initialValue: 'tabler:info-square',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
    prepare({title, subtitle}) {
      return {title: `Note: ${title ?? ''}`, subtitle}
    },
  },
})
