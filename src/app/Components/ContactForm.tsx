import { Input } from '@/app/Components/lightswind/input';
import { Label } from '@/app/Components/lightswind/label';
import { Button } from '@/app/Components/lightswind/button';
import { Textarea } from '@/app/Components/lightswind/textarea';
import Title from "./Title"
import { useForm, ValidationError } from '@formspree/react';
import { useState, useRef, useEffect } from "react";

const ContactForm = () => {

    const [state, handleSubmit] = useForm("mvgbzjer");
    const [MessageColor, setMessageColor] = useState("");
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

   useEffect(() => {
           if (state.succeeded) {
               setSucceed("Message envoyé ✅");
               setMessageColor ("bg-green-200");
           }else if(state.submitting){
            setSucceed("Message non envoyee, veuillez verifier votre connexion");
               setMessageColor("bg-gray-300");
           }
       }, [state.succeeded]);
    



    return (
        <div className="flex flex-col justify-center  items-align m-10 md:px-[30%] px-[5%]  ">
            <Title title="Vos avis et messages" />

            <form onSubmit={handleSubmit} method="POST" className="relative flex flex-col justify-between  w-full h-fit p-10 m-2 border border-info rounded-xl bg-black/80 shadow-[0_5px_20px_rgba(0,200,255,0.6)]">

                <div className='pb-5 flex-col flex items-align justify-center'>
                    <h1 className='font-bold uppercase  text-xl'> Formulaire </h1>
                    <hr />
                </div>


                <div className='flex flew-row gap-5'>
                    <div>
                        <Label htmlFor="text">Nom</Label>
                        <Input required type="text" name="name" placeholder="Votre Nom"
                            value={formData.name}
                            onChange={handleChange}
                             className='bg-white/20' />
                        <ValidationError
                            prefix="Name"
                            field="name"
                            errors={state.errors}
                        />
                    </div>
                   

                    <div>
                        <Label htmlFor="text">Prenom</Label>
                        <Input type="text" name="surname" placeholder="Votre Prenom" value={formData.surname}
                            onChange={handleChange} className='bg-white/20' />
                    </div>
                    <ValidationError
                        prefix="Surname"
                        field="surname"
                        errors={state.errors}
                    />
                   

                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input required type="email" name="email" placeholder="Votre Email" value={formData.email}
                        onChange={handleChange} className='bg-white text-black' />
                    <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                    />
                </div>
              
                <div>
                    <Label htmlFor="text" className='h-100'>Votre message</Label>
                    <Textarea required name="message" placeholder="Votre Message" value={formData.message}
                        onChange={handleChange} className='bg-white/20' />
                    <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                    />
                </div>
               
                <div className='flex justify-center w-full mt-5'>
                    <Button type="submit" disabled={state.submitting} onClick={() => state.succeeded? setSucceed("reussi"): state.submitting ? setSucceed("Veuillez patienter") : setSucceed("Veuillez verifier votre connexion et les champs requis")} size="lg" className='w-full'> Soumettre</Button>
                </div>
                <div className={`w-full p-2 bg-gray-100  h-5 ${MessageColor} text-center text-black absolute bottom-0 left-0 rounded-b-xl flex flex-col justify-center items-center`}>  {succeed && <p>{succeed}</p>}</div>
            </form>
        </div>
    );
}

export default ContactForm;