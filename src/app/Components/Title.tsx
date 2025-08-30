import Aos from "aos";

import { useEffect } from "react";
import "aos/dist/aos.css";

interface TitleProps {
    title: string;
    className?: string;
    dataAos?:string;
    id?:string;
}

const Title = ({ title ,className, dataAos,id}: TitleProps) => {
    useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
        });
    });
    return (
        <h1 className={`text-2xl uppercase font-bold text-center mb-5 ${className}`} id={id} data-aos={dataAos}>
            {title}
        </h1>
    );
}

export default Title;