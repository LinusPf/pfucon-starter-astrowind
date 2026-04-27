import {defineField, defineType} from 'sanity'

export const contactWidget = defineType({
  name: 'contactWidget',
  title: 'Kontaktformular',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'subtitle', title: 'Untertitel', type: 'text', rows: 3}),
    defineField({
      name: 'inputs',
      title: 'Formularfelder',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'formInput',
          fields: [
            defineField({
              name: 'type',
              title: 'Feldtyp',
              type: 'string',
              options: {list: ['text', 'email', 'tel', 'number']},
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'name', title: 'Name (HTML name-Attribut)', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'placeholder', title: 'Placeholder', type: 'string'}),
            defineField({name: 'autocomplete', title: 'Autocomplete', type: 'string'}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'name'},
          },
        },
      ],
    }),
    defineField({
      name: 'textarea',
      title: 'Textarea',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'name', title: 'Name', type: 'string'}),
        defineField({name: 'placeholder', title: 'Placeholder', type: 'string'}),
        defineField({name: 'rows', title: 'Zeilen', type: 'number', initialValue: 4}),
      ],
    }),
    defineField({name: 'button', title: 'Button-Text', type: 'string', initialValue: 'Senden'}),
    defineField({name: 'description', title: 'Text nach dem Button', type: 'text', rows: 2}),
    defineField({name: 'isDark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
    defineField({name: 'id', title: 'Anker-ID', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: `Kontakt: ${title ?? '(kein Titel)'}`}
    },
  },
})
