import { Input } from '@/app/Components/lightswind/input';
import { Label } from '@/app/Components/lightswind/label';
import { Button } from '@/app/Components/lightswind/button';
import { Textarea } from '@/app/Components/lightswind/textarea';
import Title from "./Title"
import { useForm, ValidationError } from '@formspree/react';
import { useState, useRef, useEffect } from "react";

const ContactForm = () => {

    const [state, handleSubmit] = useForm("mvgbzjer");
    const [MessageColor, setMessageColor] = useState("bg-transparent");
    const [succeed, setSucceed] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        message: "",
    });

    const handleClick = () => {
        if (state.succeeded) {
            setMessageColor("bg-green-200");
            setSucceed("Message envoye");
        } else if (state.submitting) {
            setMessageColor("bg-gray-300");
            setSucceed("Veuillez patienter, operation en cours");
        } else {
            setMessageColor("bg-red-500 ");
            setSucceed("Veuillez reessayer, probleme de connexion ou champs requis");
        }

    }




    return (
        <div className="flex flex-col justify-center  items-align m-10 md:px-[10%] px-[2%]  " id="contact">
            <Title title="Vos avis et messages" />

            <div className="flex flex-row justify-center items-start h-auto w-full ">

                <div className='bg-slate-200 relative h-fit md:w-2/5   p-10 m-2 rounded-xl text-black md:flex hidden flex-col border border-info shadow-[0_5px_20px_rgba(0,200,255,0.6)]'>
                    <h1 className='font-extrabold uppercase  text-3xl'> Contactez-nous</h1>
                    <hr />
                    <p className='text-md mt-5'> Nous sommes la pour vous aider, notre equipe professionnelle vourepondra dans les 4h suivantes</p>

                    <div className='w-full flex flex-col items-start ml-10 mt-10 pb-5'>
                        <p className='text-gray-600 font-bold'>Email</p>
                        <span className="font-bold text-md  mb-5 mt-1">divlabsoftwares@gmail.com</span>

                        <p className='text-gray-600 font-bold'>Appelez nous</p>
                        <span className="font-bold text-md  mb-5 mt-1">+237 652509674</span>

                        <p className='text-gray-600 font-bold'>Notre adresse</p>
                        <span className="font-bold text-md  mb-5 mt-1">Cameroun | Douala</span>
                    </div>
                    <div className='absolute rounded-2xl bg-white/20 -bottom-30 -right-6 border border-info shadow-[0_5px_20px_rgba(0,200,255,0.6)] w-45 h-45'>

                    </div>
                    <div className='absolute rounded-2xl bg-white/10 -bottom-50 right-25 border border-info shadow-[0_5px_20px_rgba(0,200,255,0.6)] w-35 h-35'>

                    </div>
                </div>

                <form onSubmit={handleSubmit} method="POST" className="relative flex flex-col justify-between w-full  md:w-3/5  h-fit p-10 m-2 border border-info rounded-xl bg-black/80 shadow-[0_5px_20px_rgba(0,200,255,0.6)]">

                    <div className='pb-5 flex-col flex items-align justify-center'>
                        <h1 className='font-bold uppercase  text-xl'> Formulaire de contact</h1>
                        <hr />
                    </div>


                    <div className='w-full flex items-center flex-row justify-between mb-4'>

                        <div className='w-1/2 '>
                            <Label htmlFor="text">Nom</Label>
                            <Input required type="text" name="name" placeholder="Votre Nom"
                                value={formData.name}
                                onChange={handleChange}
                                className='bg-white text-black' />
                            <ValidationError
                                prefix="Name"
                                field="name"
                                errors={state.errors}
                            />
                        </div>


                        <div className='w-1/2 ml-3'>
                            <Label htmlFor="text">Prenom</Label>
                            <Input type="text" name="surname" placeholder="Votre Prenom" value={formData.surname}
                                onChange={handleChange} className='bg-white text-black' />
                            <ValidationError
                                prefix="Surname"
                                field="surname"
                                errors={state.errors}
                            />
                        </div>

                    </div>


                    <div className='mb-4'>
                        <Label htmlFor="email">Email</Label>
                        <Input required type="email" name="email" placeholder="Votre Email" value={formData.email}
                            onChange={handleChange} className='bg-white text-black' />
                        <ValidationError
                            prefix="Email"
                            field="email"
                            errors={state.errors}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="text" className='h-100'>Votre message</Label>
                        <Textarea rows={10} required name="message" placeholder="Votre Message" value={formData.message}
                            onChange={handleChange} className='bg-white/40 text-black' />
                        <ValidationError
                            prefix="Message"
                            field="message"
                            errors={state.errors}
                        />
                    </div>

                    <div className='flex justify-center w-full mt-5'>
                        <Button type="submit" variant='form' disabled={state.submitting} onClick={() => handleClick()} size="lg" className='form w-full'> Soumettre</Button>
                    </div>
                    <div className={`w-full p-2  h-5 ${MessageColor} text-center text-black absolute bottom-0 left-0 rounded-b-xl flex flex-col justify-center items-center font-bold`}>  {succeed && <p>{succeed}</p>}</div>
                </form>
            </div>

        </div>
    );
}

export default ContactForm;