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
        <div className="divlab-section-shell flex flex-col justify-center px-[2%] py-16 md:px-[10%]" id="contact">
            <Title title="Vos avis et messages" />

            <div className="flex h-auto w-full flex-row items-start justify-center">

                <div className='divlab-glass relative m-2 hidden h-fit flex-col rounded-[2rem] p-10 text-[var(--divlab-text)] md:flex md:w-2/5'>
                    <h1 className='font-extrabold uppercase  text-3xl'> Contactez-nous</h1>
                    <hr />
                    <p className='text-md mt-5 text-[var(--divlab-muted)]'> Nous sommes la pour vous aider, notre equipe professionnelle vous repondra dans les 4h suivantes</p>

                    <div className='w-full flex flex-col items-start ml-10 mt-10 pb-5'>
                        <p className='font-bold text-cyan-300'>Email</p>
                        <span className="font-bold text-md  mb-5 mt-1">divlabsoftwares@gmail.com</span>

                        <p className='font-bold text-cyan-300'>Appelez nous</p>
                        <span className="font-bold text-md  mb-5 mt-1">+237 652509674</span>

                        <p className='font-bold text-cyan-300'>Notre adresse</p>
                        <span className="font-bold text-md  mb-5 mt-1">Cameroun | Douala</span>
                    </div>
                    <div className='absolute -bottom-30 -right-6 z-99 h-45 w-45 rounded-2xl border border-cyan-300/30 bg-white/10 shadow-[0_5px_20px_rgba(0,200,255,0.35)]'>

                    </div>
                    <div className='absolute -bottom-50 right-25 h-35 w-35 rounded-2xl border border-amber-300/30 bg-white/10 shadow-[0_5px_20px_rgba(0,200,255,0.25)]'>

                    </div>
                </div>

                <form onSubmit={handleSubmit} method="POST" className="divlab-glass relative m-2 flex h-fit w-full flex-col justify-between rounded-[2rem] p-10 md:w-3/5">

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
                            onChange={handleChange} className='bg-white/40 text-black text-md' />
                        <ValidationError
                            prefix="Message"
                            field="message"
                            errors={state.errors}
                        />
                    </div>

                    <div className='flex justify-center w-full mt-5'>
                        <Button type="submit" variant='form' disabled={state.submitting} onClick={() => handleClick()} size="lg" className='form w-full rounded-xl bg-cyan-300 font-black text-[#071421] hover:bg-cyan-200'> Soumettre</Button>
                    </div>
                    <div className={`w-full p-2  h-5 ${MessageColor} text-center text-black absolute bottom-0 left-0 rounded-b-xl flex flex-col justify-center items-center font-bold`}>  {succeed && <p>{succeed}</p>}</div>
                </form>
            </div>

        </div>
    );
}

export default ContactForm;
