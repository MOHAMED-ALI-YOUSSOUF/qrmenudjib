import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'restaurant',
  title: 'Restaurant',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: "owner",
      type: "reference",
      to: [{ type: "user" }],
      title: "Propriétaire",
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'whatsapp',
      title: 'Numéro WhatsApp',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^\+?[1-9]\d{1,14}$/, "Numéro invalide"),
    }),
    defineField({ name: 'primaryColor', title: 'Couleur principale', type: 'string' }),
    defineField({ name: 'secondaryColor', title: 'Couleur secondaire', type: 'string' }),
    defineField({ name: 'accentColor', title: 'Couleur d’accent', type: 'string' }),
    defineField({ name: 'fontFamily', title: 'Police d’écriture', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'string' }),
    defineField({ name: 'facebook', title: 'Facebook', type: 'string' }),
    defineField({ name: 'tiktok', title: 'TikTok', type: 'string' }),
    defineField({ name: 'adresse', title: 'Adresse', type: 'string' }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Actif", value: "active" },
          { title: "Désactivé", value: "disabled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "pendingReason",
      title: "Raison de l'attente",
      type: "string",
      hidden: ({ document }) => document?.status !== "pending",
    }),
    defineField({
      name: "createdAt",
      title: "Date de création",
      type: "datetime",
      options: { dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm" },
    }),
  ],
})
