"use client";
import { useSession, signOut } from "next-auth/react";

export default function Profile() {
    const { data: session } = useSession();

    if (!session) return <p>Non connecté</p>;

    return (
        <div>
            <p>Connecté en tant que {session.user?.email}</p>
            <button onClick={() => signOut()}>Se déconnecter</button>
        </div>
    );
}
