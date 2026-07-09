import { unstable_cache } from "next/cache";

type Courses = {
    id: string;
    title: string;
    description: string;
    domain: string;
    state: string;
    roomCode: string;
    date_start: Date;
    date_end: Date;
    type: string;
    time: number;
    price: number;
    trainerId: string;
    trainer: {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string | null;
        };
        valid: boolean;
        reject: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    language: string;
    currency: string;
    frontCover: string;
    backCover: string;
};

export const getRankedCourses = unstable_cache(
    async () => {
        console.log("=== RÉCUPÉRATION DB : Ranked Courses ===");
        try {
            const formations = await prisma.course.findMany({
                where: { state: { in: ["started", "upcoming"] }, rank: { gt: 0 } },
                orderBy: { createdAt: "asc" },
            });

            const withPublicImg: Courses[] = (formations || []).map((course: any) => ({
                ...(course),
            }));
            // console.log("Ranked courses:", withPublicImg);

            return withPublicImg as Courses[];

        } catch (err: any) {
            console.error("Erreur de recuperation des formations classées:", err.message);
            return [];
        }
    },
    ['ranked-courses-key'], // Clé unique pour identifier ce cache
    {
        revalidate: 3600, // Cache pendant 1 heure (en secondes)
        tags: ['rankedCourses'] // Tag pour pouvoir forcer la mise à jour plus tard
    }
);