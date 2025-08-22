import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'passwordResetToken',
  title: 'Password Reset Token',
  type: 'document',
  fields: [
    defineField({
        name: "user",
        title: "User",
        type: "reference",
        to: [{ type: "user" }],
    }),
    defineField({
        name: "token",
        title: "Token",
        type: "string",
    }),
    defineField({
        name: "expiresAt",
        title: "Expires At",
        type: "datetime",
    }),
  ],
});