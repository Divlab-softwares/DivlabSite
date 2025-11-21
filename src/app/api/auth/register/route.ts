import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ error: "Utilisateur déjà existant, Essayez de vous connecter ou changer d'e-mail" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
    });

    return NextResponse.json({ user });
}
