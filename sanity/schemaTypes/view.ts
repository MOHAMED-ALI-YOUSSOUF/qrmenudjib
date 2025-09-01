// schemas/view.ts
import { defineType, defineField } from 'sanity'

export const view = defineType({
  name: 'view',
  title: 'View',
  type: 'document',
  fields: [
    defineField({
      name: 'restaurant',
      title: 'Restaurant',
      type: 'reference',
      to: [{ type: 'restaurant' }],
      description: 'Le restaurant consulté'
    }),
    defineField({
      name: 'visitorId',
      title: 'Visitor ID',
      type: 'string',
      description: 'ID unique généré pour chaque visiteur (anonyme)',
    }),
    defineField({
      name: 'viewedAt',
      title: 'Date de vue',
      type: 'datetime',
      description: 'Date et heure de la consultation',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'type',
      title: 'Type de vue',
      type: 'string',
      options: {
        list: [
          { title: 'Menu', value: 'menu' },
          { title: 'Restaurant', value: 'restaurant' }
        ],
        layout: 'radio'
      },
      initialValue: 'menu'
    }),
  ]
})
