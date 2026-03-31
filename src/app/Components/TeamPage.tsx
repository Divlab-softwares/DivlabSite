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
        name: "TSAGUE GOMO EUGENE JUNIOR",
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
        <div className="relative h-fit" id="team-section">
            <FallBeamBackground
                lineCount={40}
                beamColorClass="blue-400"

                className="h-full w-full absolute top-0 left-0 "
            />
            <TeamCarousel
                members={teamMembers}
                title="EQUIPE DIVLAB"
                titleColor="blue"
                titleSize="xl"
                // infoTextColor="black"
                autoPlay={0}
                onMemberChange={(member, index) => {
                    console.log('Active member:', member.name);
                }}
            />
        </div>
    );
}