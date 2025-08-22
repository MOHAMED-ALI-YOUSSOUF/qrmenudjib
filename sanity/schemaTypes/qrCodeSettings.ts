import { defineType, defineField } from "sanity";

export const qrCodeSettings = defineType({
  name: "qrCodeSettings",
  title: "Paramètres QR Code",
  type: "document",
  fields: [
    defineField({
      name: "restaurant",
      title: "Restaurant",
      type: "reference",
      to: [{ type: "restaurant" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL du menu",
      type: "url",
      description: "URL vers laquelle le QR Code redirige",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      title: "Taille du QR Code",
      type: "number",
      description: "Taille en pixels (128-512)",
      initialValue: 256,
      validation: (Rule) => Rule.min(128).max(512),
    }),
    defineField({
      name: "logoSize",
      title: "Taille du logo",
      type: "number",
      description: "Taille du logo en pixels (20-100)",
      initialValue: 50,
      validation: (Rule) => Rule.min(20).max(100),
    }),
    defineField({
      name: "backgroundColor",
      title: "Couleur de fond",
      type: "string",
      description: "Couleur d'arrière-plan du QR Code",
      initialValue: "#ffffff",
    }),
    defineField({
      name: "foregroundColor",
      title: "Couleur du code",
      type: "string",
      description: "Couleur des modules du QR Code",
      initialValue: "#000000",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Logo à placer au centre du QR Code",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "createdAt",
      title: "Créé le",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Mis à jour le",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "restaurant.name",
      subtitle: "url",
    },
  },
});
