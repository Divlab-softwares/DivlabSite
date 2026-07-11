
import { prisma } from "@/app/lib/prisma";
import { unstable_cache } from "next/cache";
import {
    DEFAULT_BACK_COVER,
    DEFAULT_FRONT_COVER,
    DEFAULT_PROFILE_IMAGE,
    resolvePublicImage,
} from "./imageSources";


type Courses = {
    id: string;
    title: string;
    description: string;
    domain: string;
    state: string;
    roomCode: string;
    date_start: Date;
    date_end: Date;
    courseType: string;
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
                // trainer: { ...formations.trainer, user: { ...formations.trainer.user, image: (getSupabasePublicLink(formations.trainer.user.image as string, "images") ?? (formations.trainer.user.image as string)) as string } },
                frontCover: resolvePublicImage(course.frontCover, "images", DEFAULT_FRONT_COVER),
                backCover: resolvePublicImage(course.backCover, "images", DEFAULT_BACK_COVER),
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