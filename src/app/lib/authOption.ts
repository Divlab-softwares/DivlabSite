import { NextAuthOptions } from "next-auth";
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
        id?: string;
        role?: string;
    }
}

const useSecureCookies = process.env.NODE_ENV === 'production';
const cookiePrefix = useSecureCookies ? "__Secure-site-" : "site-";
const domain = ".divlabs-tech.com"; // Votre domaine commun
const authSecret =
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.SUPABASE_JWT_SECRET;

if (!authSecret) {
    throw new Error("NEXTAUTH_SECRET est requis pour chiffrer les sessions.");
}

export const authOptions = {
    adapter: PrismaAdapter(prisma),
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
                token.id = user.id;
                token.sub = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
                token.role = user.role || "user";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id || token.sub;
                session.user.name = token.name ?? undefined;
                session.user.email = token.email ?? undefined;
                session.user.image = token.picture ?? undefined;
                session.user.role = token.role || "user";
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: authSecret,
        maxAge: 60 * 60 * 24 * 30,
    },
    secret: authSecret,
    debug: process.env.NEXTAUTH_DEBUG === "true",
} satisfies NextAuthOptions;


