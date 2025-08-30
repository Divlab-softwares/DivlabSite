import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import "./MyCarousel.scss";
import Image from "next/image";
import StripesBackground from '@/app/Components/lightswind/StripesBackground';


const length = 7
const items = [...new Array(length).keys()]
const z = length * 85


interface Question {
    id: number;
    value: string;
    answer: string;
    img: string; // Optional image property
}

interface AboutQuestionsProps {
    questions: Question[];
    questionHome: Question;
    index: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;

}


const MyCarousel = ({ questions, questionHome, index, setIndex }: AboutQuestionsProps) => {


    const angle = index / length * -360;
    const transform = `translateZ(-${z}px) rotateX(${angle}deg) rotateY(6deg)`

    const SetIndexVal = (val: number) => {
        index = val + 1;
    }

    return (
        <div className="bod ">

            <div className='hidden md:block'>
                <div className="scene z-0 shadow-[0_5px_20px_rgba(0,0,0,0.6)] rounded-3xl">
                    <StripesBackground
                        position="right"
                        width="w-full"
                        height="h-full"
                        opacity="opacity-60"
                        className='rounded-3xl'
                    />
                    <div className="mycarousel md:flex hidden z-1 shadow-[0_5px_20px_rgba(0,200,255,0.6)]   bg-[radial-gradient(ellipse_at_center , rgba(0,0,0,0)_60%, rgba(0,0,0,0.7)_100%)] inset-0 " style={{ transform }}>
                        {items.map((id) => (
                            <div className='item transform transition-transform duration-300 hover:scale-106  bg-gray' key={id} style={{
                                transform: getTransform(id)
                            }}>
                                 <Image
                                    alt=""
                                    width={500}
                                    height={420}

                                    className={" object-cover shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}

                                    src={id < 5 ? questions[ id ].img : `/assets/ImgCarousel/${id + 6}.jpeg`} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                /> 
                                <div className=' w-full  transform transition-transform duration-300 hover:scale-106 h-full pointer_event_none  absolute shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]  border rounded-3xl border-[rgba(0,200,255,0.6)]'>

                                </div>
                                
                            </div>

                        ))}
                    </div>
                   

                    <div
                        className="controls "
                        style={{ transform: `translateZ(-${z}px) rotateX(0deg)` }}
                    >
                        <button
                            style={{ transform: getTransform(length - 1) }}
                            onClick={() => setIndex(index - 1)}

                        />
                        <button
                            style={{ transform: getTransform(1) }}
                            onClick={() => setIndex(index + 1)}

                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

function getTransform(id: number) {
    const deg = id * (360 / length)
    return `rotateX(${deg}deg) translateZ(${z}px)`
}


export default MyCarousel;