import Title from "./Title";
import { AnimatedOceanWaves } from "@/app/Components/lightswind/AnimatedOceanWaves"
import { InteractiveGradient } from "@/app/Components/lightswind/interactive-gradient"
import Link from "next/link";
import Wave from 'react-wavify'

import Aos from "aos";
import "aos/dist/aos.css";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/app/Components/lightswind/card";
import { Button } from "@/app/Components/lightswind/button";
import Image from "next/image";
import { useEffect } from "react"

const Services = () => {

    useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
        });
    })

    return (
        <div className="flex flex-col items-center justify-center  relative" id="services">
            <Wave fill='#121c22'
                paused={false}
                style={{ display: 'flex' }}
                options={{
                    height: 20,
                    amplitude: 60,
                    speed: 0.15,
                    points: 4
                }}
                className="transform rotate-180"
            />
            <Title title="Nos Services" dataAos="fade-down" />
            <p data-aos="fade-right">Voici un aperçu des services que nous proposons.</p>


            <div className="flex flex-row justify-center gap-5 m-5 mt-10 w-full  flex-wrap md:flex-nowrap  ">
                <InteractiveGradient
                  dataAos="fade-right"
                    color="#1890ff"
                    glowColor="#ffc40050"
                    followMouse={true}
                    hoverOnly={false}
                    intensity={100}
                    backgroundColor="#151419"
                    width="20rem"
                    height="fit"
                    borderRadius="2.25rem"
                    className=" transition-transform  justify-center h-100% mt-5 duration-500 hover:scale-105 hover:-translate-y-5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] shadow-[0_5px_20px_rgba(0,0,0,0.5)]">

                    <Card className="w-100% relative h-100% rounded-4xl border-none flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-5 w-full h-20 rounded-3xl bg-gray-500 transform duration-300 hover:h-50">
                                <Image
                                    alt=""
                                    width={320}
                                    height={420}

                                    className={" object-cover shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}

                                    src={`/assets/ImgCarousel/7.jpeg`} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                />
                            </div>
                            <CardTitle className="text-white" >Formations specialisées</CardTitle>
                            <CardDescription >Langages de programmation et Machine learning a portée de main.</CardDescription>
                            <hr />
                        </CardHeader>
                        <CardContent className="text-white">
                            <p className="">Développez vos compétences avec nos programmes de formation adaptés aux besoins du marché. Nous proposons des parcours pratiques en développement web, cloud computing, data science et intelligence artificielle, conçus pour renforcer votre expertise et accélérer votre carrière.</p>
                        </CardContent>
                        <CardFooter className="">
                            <Button className="text-white rounded-2xl w-5/6 bg-[#ffc40050]  text-md p-0 transition-transform duration-400 hover:scale-99 hover:bg-[#755b06a6] hover:translate-y-1 shadow-[inset_3px_-3px_20px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_50px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)] " >
                                <Link
                                    href="/Formations"
                                    onClick={() => {
                                        if ("/Formations".startsWith("/")) {
                                            window.scrollTo(0, 0);
                                        }
                                    }}
                                    className="w-full h-full p-2"
                                >

                                    Voir

                                </Link></Button>
                        </CardFooter>
                    </Card>

                </InteractiveGradient>

                <InteractiveGradient
                    dataAos="fade-up"
                    color="#1890ff"
                    glowColor="#1076675d"
                    followMouse={true}
                    hoverOnly={false}
                    intensity={100}
                    backgroundColor="#151419"
                    width="20rem"
                    height="fit"
                    borderRadius="2.25rem"
                    className="h-100%  hover:border-info transition-transform mt-5 duration-500  hover:scale-105 hover:-translate-y-5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
                    <Card className="w-100% relative h-100% rounded-4xl border-none flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-5 w-full h-20 rounded-3xl bg-gray-500 transform duration-300 hover:h-50">
                                <Image
                                    alt=""
                                    width={320}
                                    height={420}

                                    className={" object-cover shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}

                                    src={`/assets/ImgCarousel/2.png`} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                />
                            </div>
                            <CardTitle className="text-white">Solutions Web & Cloud</CardTitle>
                            <CardDescription>Créez votre identité en ligne via votre propre site web ou portofolio.</CardDescription>
                            <hr />
                        </CardHeader>
                        <CardContent className="text-white">
                            <p>Nous concevons et déployons des solutions modernes pour vos applications web et cloud. De la création de sites performants à l’intégration de services cloud sécurisés et évolutifs, nous vous aidons à digitaliser vos processus et à gagner en efficacité.</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="text-white p-0  rounded-2xl w-5/6 bg-[#1076675d] hover:bg-[#0a4b4171]  text-md transition-transform duration-400 hover:scale-99  hover:translate-y-1 shadow-[inset_3px_-3px_20px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_50px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)] " >
                                <Link
                                    href="/Formations#solutions web"
                                    onClick={() => {
                                        if ("/Formations".startsWith("/")) {
                                            window.scrollTo(0, 0);
                                        }
                                    }}
                                    className="w-full h-full p-2"
                                >
                                    Voir

                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                </InteractiveGradient>

                <InteractiveGradient
                    dataAos="fade-down"
                    color="#1890ff"
                    glowColor="#0074d956"
                    followMouse={true}
                    hoverOnly={false}
                    intensity={100}
                    backgroundColor="#151419"
                    width="20rem"
                    height="fit"
                    borderRadius="2.25rem"
                    className="  hover:border-info  h-100% transition-transform mt-5 duration-500 hover:scale-105 hover:-translate-y-5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
                    <Card className="w-100% relative h-100% rounded-4xl border-none flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-5 w-full h-20 rounded-3xl bg-gray-500 transform duration-300 hover:h-50">
                                <Image
                                    alt=""
                                    width={320}
                                    height={420}

                                    className={" object-cover shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}

                                    src={`/assets/ImgCarousel/13.jpg`} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                />
                            </div>
                            <CardTitle className="text-white">Intelligence artificielle</CardTitle>
                            <CardDescription>Decouvrez le monde de l'IA et son fonctionnnent plus que mysterieux.</CardDescription>
                            <hr />
                        </CardHeader>
                        <CardContent className="text-white">
                            <p>Exploitez la puissance des données grâce à nos solutions en intelligence artificielle. Nous développons des modèles sur mesure pour l’automatisation, la prédiction et l’optimisation, afin de transformer vos données en leviers stratégiques pour votre entreprise.</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="text-white p-0 rounded-2xl w-5/6 bg-[#0074d956] hover:bg-[#003c70a1]  text-md transition-transform duration-400 hover:scale-99  hover:translate-y-1 shadow-[inset_3px_-3px_20px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_50px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)] " >
                                <Link
                                    href="/Formations#ia"
                                    onClick={() => {
                                        if ("/Formations".startsWith("/")) {
                                            window.scrollTo(0, 0);
                                        }
                                    }}
                                    className="w-full h-full p-2"
                                >
                                    Voir

                                </Link></Button> </CardFooter>
                    </Card>
                </InteractiveGradient>

                <InteractiveGradient
                    dataAos="fade-up"
                    color="#1890ff"
                    glowColor="#8f0f4459"
                    followMouse={true}
                    hoverOnly={false}
                    intensity={100}
                    backgroundColor="#151419"
                    width="20rem"
                    height="fit"
                    borderRadius="2.25rem"
                    className=" hover:border-info transition-transform mt-5 duration-500 hover:scale-105 hover:-translate-y-5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.9)] shadow-[0_5px_20px_rgba(0,0,0,0.5)] ">

                    <Card className="w-100% relative h-100% rounded-4xl border-none flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-5 w-full h-20 rounded-3xl bg-gray-500 transform duration-300 hover:h-50">
                                <Image
                                    alt=""
                                    width={320}
                                    height={420}

                                    className={" object-cover shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}

                                    src={`/assets/ImgCarousel/4.jpeg`} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                />
                            </div>
                            <CardTitle className="text-white">Design & Creativite</CardTitle>
                            <CardDescription>Donnez vie a vos idées et pensées sous forme de visuel attractifs.</CardDescription>
                            <hr />
                        </CardHeader>
                        <CardContent className="text-white">
                            <p> Donnez vie à vos idées avec des designs modernes et percutants. Notre équipe combine créativité et technologies pour concevoir des interfaces ergonomiques, des identités visuelles uniques et des expériences utilisateurs engageantes.</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="text-white p-0 rounded-2xl w-5/6 bg-[#8f0f4459] hover:bg-[#3f081fb2] text-md transition-transform duration-400 hover:scale-99  hover:translate-y-1 shadow-[inset_3px_-3px_20px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_50px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)] " >
                                <Link
                                    href="/Formations#design"
                                    onClick={() => {
                                        if ("/Formations".startsWith("/")) {
                                            window.scrollTo(0, 0);
                                        }
                                    }}

                                    className="w-full h-full p-2"
                                >
                                    Voir

                                </Link></Button> </CardFooter>
                    </Card>
                </InteractiveGradient>



            </div>


            <div className="relative w-full h-48 rounded overflow-hidden ">

                <AnimatedOceanWaves
                    height="50%"
                    oceanBackground="#05080e"
                    frontWaveOpacity={0.7}
                    backWaveOpacity={0.28}
                    waveDuration={10}
                />


            </div>




        </div>
    );
}

export default Services;