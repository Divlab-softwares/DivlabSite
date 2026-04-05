import  { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// ✅ Types étendus
declare module "next-auth" {
    interface User {
        role?: string;
    }
    interface Session {
        user: {
            id?: string;
            email?: string;
            name?: string;
            image?: string;
            role?: string;
        } & DefaultSession["user"];
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
    }
}

const useSecureCookies = process.env.NODE_ENV === 'production';
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const domain = ".divlabs-tech.com"; // Votre domaine commun

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt"  },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

               return passwordMatch ? user : null;
            },
        }),
    ],
    cookies: {
        sessionToken: {
            name: `${cookiePrefix}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: useSecureCookies,
                domain: useSecureCookies ? domain : undefined, // Ne pas mettre de domain en local
            },
        },
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider === "google") {
                // Vérifie si un user avec cet email existe déjà
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email ?? undefined },
                });

                // Si oui, autorise la connexion Google à ce même compte
                if (existingUser) {
                    return true;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                //token.id = user.id;
                token.role = user.role || "user";
            }
            return token;
        },
        async session({ session, token }) {
            if (token.role) {
                //session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },

    debug: process.env.NODE_ENV === "development", // pour voir les logs détaillés
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;


