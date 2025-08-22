import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { writeClient } from "@/sanity/lib/write-client";
import { groq } from "next-sanity";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Veuillez fournir un email et un mot de passe.");
        }

        // Recherche de l'utilisateur
        const user = await writeClient.fetch(
          groq`*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );

        if (!user) {
          throw new Error("Aucun compte trouvé avec cet email.");
        }

        // Vérification du mot de passe
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Mot de passe incorrect.");
        }

         const restaurant = await writeClient.fetch(
          groq`*[_type == "restaurant" && owner._ref == $userId && status == "active"][0]`,
          { userId: user._id }
        );

       if (!restaurant) {
        throw new Error("Votre compte est en cours de validation et sera activé sous 24 heures. Merci de votre patience.");
      }


        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
