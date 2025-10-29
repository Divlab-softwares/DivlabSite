import  { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";



const prisma = new PrismaClient(); 

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },


            async authorize(credentials, req) {

                if (!credentials?.email) {
                    return null; // ou gérer autrement
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) return null;


                const isValid = await compare(credentials!.password, user.password);
                if (!isValid) return null;

                const setUserConnected = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        connected: true
                    }
                });

                return { id: user.id.toString(), name: user.name, email: user.email };
            },
        }),
    ],
    session: { strategy: "jwt" as const },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            // Ici, session.user peut être undefined → faut sécuriser
            if (session.user) {
                (session.user as any).id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    pages: { signIn: "/DivlabSpace" },
    secret: process.env.NEXTAUTH_SECRET,
};

// export const getServerAuthSession = (ctx: {

