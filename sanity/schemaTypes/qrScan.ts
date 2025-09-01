// schemas/qrScan.ts
import { defineType, defineField } from "sanity"

export const qrScan = defineType({
  name: "qrScan",
  title: "QR Scans",
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
      name: "scannedAt",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "device",
      title: "Device",
      type: "string",
      options: { list: ["mobile", "desktop", "tablet"] },
    }),
    defineField({
      name: "ip",
      title: "IP (optionnel)",
      type: "string",
    }),
  ],
})
