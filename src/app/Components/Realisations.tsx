import Title from "./Title";
import Carousel3D, { type Carousel3DItem } from "./lightswind/carousel-3d";
import { DotBackground } from "@/app/Components/lightswind/grid-dot-background"

const items: Carousel3DItem[] = [
    {
        id: 1,
        title: "Site vitrine",
        brand: "Developpement Web",
        description: "Site concu par les ingenieurs de Divlab afin de vous faciliter l'acces au different produits et offres.",
        tags: ["React", "Next.js", "HTML/scss", "Tailwindcss"],
        imageUrl: "/assets/projects/4.png",
        link: "/projects/firecat"
    },
    {
        id: 2,
        title: "IA reconnaissance vocale",
        brand: "Machine Learning",
        description: "Une IA de reconnaissance vocale concu pour assister des projets personeles et les taches de bureau specifiques.",
        tags: ["Python", "Jupiter", "Pycharm", "Sqlite 3"],
        imageUrl: "/assets/projects/2.png",
        link: "/projects/firecat"
    },
    {
        id: 3,
        title: "Portofolio moderne personalisable",
        brand: "Developpement web",
        description: "Un portofolio modifiable a votre guise grace a une architecture bien concu et agreable a faconner.",
        tags: ["React", "JSX", "Vs code"],
        imageUrl: "/assets/projects/5.png",
        link: "/projects/firecat"
    },
    {
        id: 4,
        title: "Site web deal flow",
        brand: "Developpement web",
        description: "Site web concu pour la presentation et la vente des articles commestibles , recommendes par les restaurants.",
        tags: ["React", "JSX", "Vs code"],
        imageUrl: "/assets/projects/6.png",
        link: "/projects/firecat"
    },
    {
        id: 5,
        title: "DIVLAB Client Dashboard",
        brand: "Developpement web",
        description: "ERP concu pour la gestion complete des activites de DIVLAB.",
        tags: ["React", "JSX", "Vs code"],
        imageUrl: "/assets/projects/1.png",
        link: "/projects/firecat"
    }
];

const Realisations = () => {
    return (
        <div className="h-auto " data-theme="night" id="realisations">
            <div className="flex flex-col items-center justify-center p-4 h-100% relative " >
                <Title className="z-50 my-10" title="Nos Réalisations" />
                <p className="my-4" data-aos="fade-right">Voici quelques exemples de nos projets récents.</p>
                <DotBackground
                    dotSize={1}
                    dotColor="#d4d4d4"
                    darkDotColor="#404040"
                    spacing={20}
                    showFade={true}
                    fadeIntensity={30}
                    className="h-full"
                />




                {/* <ParticlesBackground
                        colors={['#00ffff', '#ff00ff', '#ffaa00']}
                        size={4}
                        countDesktop={80}
                        countTablet={60}
                        countMobile={40}
                        zIndex={0}
                        height="100%"
                    /> */}




                <div className="w-full">
                    <Carousel3D
                        items={items}
                        autoRotate={true}
                        rotateInterval={4000}
                        cardHeight={500}
                        isMobileSwipe={true}
                    />
                </div>


                {/* <Carousel >
                    <CarouselContent>
                        {items.map((item) => (
                            <CarouselItem key={item.id}>
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-4xl font-semibold">{item.title}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel> */}


            </div>
        </div>

    );
}

export default Realisations;