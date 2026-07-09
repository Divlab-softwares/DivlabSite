import { TeamCarousel } from "@/app/Components/lightswind/team-carousel"
import FallBeamBackground from "./lightswind/fall-beam-background";

const teamMembers = [
    {
        id: "1",
        name: "NGANA NONGNI ANGE DIVIN",
        role: "Founder",
        image: "/assets/team/divin.jpg",
        bio: "Dirigeant visionaire avec +5 ans d'expériences. Devellopeur web et chercheur dans le domaine de l\'IA"
    },
    {
        id: "2",
        name: "TSAGUE EUGENE",
        role: "UX/UI designer",
        image: "/assets/team/junior.jpg",
        bio: "Entrepreuneur aguerrit avec de l'experience professionnelle en tant que designer web | Fondateur de John Tech"
    },
    {
        id: "3",
        name: " MONNY EMANDE FRANCK ALEX",
        role: "UI/UX developer",
        image: "/assets/team/alex.jpg",
        bio: "Designer web passionné et créatif. Esprit d'équipe et toujours à la recherche de nouvelles tendances dans l'informatique."
    },
    {
        id: "4",
        name: "CALEB YANG",
        role: "UI/UX developer",
        image: "/assets/team/caleb.jpg",
        bio: "Homme d'affaires dynamique et innovant. Develloppeur web fullstack ayant des annees d'experiences proffessionnel"
    },
    {
        id: "5",
        name: "GUIBOLO HAKASSOU YVAN AARON",
        role: "web designer",
        image: "/assets/team/yvan.jpg",
        bio: "devellopeur web plein de passion et d\'ambitions"
    },
    // {
    //     id: "6",
    //     name: "EMMANUEL",
    //     role: "Community manager",
    //     image: "/assets/team/emmanuel.jpg",
    //     bio: "Community manager et proffessionnel dans le relationnel et le marketing."
    // },
    // {
    //     id: "7",
    //     name: "LIONEL",
    //     role: "UI/UX developer",
    //     image: "/assets/team/yvan.jpg",
    //     bio: "Develloppeur web passionné et créatif. Professionnel du PHP et des technologies web."
    // },
    {
        id: "6",
        name: "DONGMO TATSADJEU MICHAEL-VEURT",
        role: "DATA ANALYST",
        image: "/assets/team/michael.jpg",
        bio: "Expert de la data et prompt analyst proffessionel."
    },
    {
        id: "7",
        name: "TANKOU RAOULT",
        role: "web designer | Trader",
        image: "/assets/team/raoult.jpg",
        bio: "Graphiste et photograph talentueux | Fondateur de  Valor Nexus"
    },

    // ... more members
];

export default function TeamPage() {
    return (
        <div className="divlab-section-shell relative h-fit overflow-hidden py-16" id="team-section">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--divlab-bg)] to-transparent" />
            <div className="absolute left-1/2 top-12 h-56 w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,197,66,0.18),transparent_65%)] blur-2xl" />
            <FallBeamBackground
                lineCount={40}
                beamColorClass="blue-400"

                className="h-full w-full absolute top-0 left-0 "
            />
            <div className="relative z-10 mx-auto max-w-7xl px-5">
                <div className="mx-auto mb-8 max-w-3xl text-center">
                    <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold uppercase text-amber-200">
                        Fondateurs & talents cles
                    </span>
                    <p className="mt-4 text-[var(--divlab-muted)]">
                        Une equipe presentee comme un socle: technique, design, data et vision produit.
                    </p>
                </div>
                <div className="relative rounded-[2rem] border border-amber-300/20 bg-gradient-to-b from-amber-300/10 via-white/5 to-blue-500/10 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
                    <TeamCarousel
                        members={teamMembers}
                        title="EQUIPE DIVLAB"
                        titleColor="blue"
                        titleSize="xl"
                        autoPlay={0}
                        className="rounded-[2rem]"
                        onMemberChange={(member, index) => {
                            console.log('Active member:', member.name);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
