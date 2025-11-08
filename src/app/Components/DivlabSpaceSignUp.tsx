"use client";


import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { TopLoader } from "./lightswind/top-loader";
import { useRouter } from "next/navigation";

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface SignResult {
    data: FormData[];
    message: string;
    status: "success" | "failed";
}

interface Sign {
    setSignResult?: React.Dispatch<React.SetStateAction<SignResult | null>>;
    setSign?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const DivlabSpaceSignUp: React.FC<Sign> = ({ setSignResult, setSign }) => {
    const router = useRouter();
     const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState<string>("");

    // // Charger les messages au démarrage
    // useEffect(() => {
    //     fetch("/api/Conversations")
    //         .then(res => res.json())
    //         // .then(data => setMessages(data));
    // }, []);
        const [visible, setVisible] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Envoyer un message
    const handleSignUp = async (): Promise<void> => {
          setIsLoading(true);
        try {
            if (!formData.email.includes("@") || formData.password.length < 6) {
          setSignResult?.({
                    data: [],
                    message: "Email invalide ou mot de passe trop court",
                    status: "failed",
                });
                setIsLoading(false);
                return;
            }
              const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name:formData.name, email: formData.email, password: formData.password }),
        });
             
        if (!res.ok) {
            const errorData = await res.json();
            setSignResult?.({
                data: [],
                message: errorData?.message || "Erreur lors de l'inscription",
                status: "failed"
            });
            setIsLoading(false);
            return;
        }




        const data = await res.json();

        console.log("Response from /api/auth/register:", data);

        setIsLoading(false);

  

        const message = data?.message || data?.error || "Erreur lors de l’inscription";
        if (res.ok) {
        setSignResult?.({
            data: [formData],
            message: message,
            status: "success"
        });
              alert(data.message || "Inscription réussie !");
        } else {
            
            setSignResult?.({
                data: [],
                message: message,
                status: "failed"
            });
            setFormData({ name: "", email: "", password: "", confirmPassword: ""});
            //alert("Erreur lors de l'inscription");
        }
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        setIsLoading(false);
        setSignResult?.({
            data: [],
            message: "Erreur lors de l’inscription",
            status: "failed"
        });
    }
    };

    // Ajouter client
    // const addClient = async () => {
    //     const res = await fetch("/api/Clients", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({name: formData.name , email: formData.email }),
    //     });
    //     // const newClient = await res.json();
    //     // setClients([...clients, newClient]);
    //     // setName("");
    //     // setEmail("");
    // };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
    handleSignUp();
  setIsLoading(true);

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message); // ou redirection
      router.push("/DivlabSpaceLogin"); // ✅ redirige vers login
    } else {
      alert(data.error || "Une erreur est survenue");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur réseau");
  } finally {
    setIsLoading(false);
  }
};


    return (
       <div className="flex flex-col justify-center  items-align m-10 md:px-[30%] px-[5%]  " id="contact">

            <TopLoader isLoading={isLoading} color="#9dd7e9ff" height={2} />
          <div className="flex flex-col justify-center  items-align m-10 md:px-[30%] px-[5%]  " id="contact">
                 <div className='pb-5 flex-col flex items-align justify-center'>
                    <h1 className='font-bold uppercase  text-xl'> Creez votre compte Div<span className="text-info">lab</span></h1>
                    <hr />
                </div>
                <p className="text-2xl font-bold text-center text-gray-800"></p>
                <hr className="my-4" />
                <p className="text-sm text-center text-gray-600">Veuillez remplir les informations ci-dessous pour créer votre compte.</p>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="name" className='font-bold uppercase  text-xl'>
                            Nom
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 text-info py-2 mt-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black border-transparent"
                            placeholder="Entrez tout votre nom "
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className='font-bold uppercase  text-xl'>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2  text-info border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-black border-transparent"
                            placeholder="Entrez votre e-mail"
                            required
                        />
                    </div>
                    <div className="mb-4 relative"> 
                        <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {!visible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                        <label htmlFor="password" className='font-bold uppercase  text-xl'>
                            Mot de passe
                        </label>
                        <input
                            type={visible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border text-info rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-black border-transparent"
                            placeholder="Entrez un mot de passe"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className='font-bold uppercase  text-xl'>
                            Confirmer votre mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg text-info focus:outline-none focus:ring-2 focus:ring-blue-500  text-black border-transparent"
                            placeholder="Confirmer votre mot de passe"
                            required
                        />
                    </div>



                    <button
                        type="submit"
                       // disabled={isLoading}
                        onClick={() => { formData.name  && formData.email && formData.password && formData.confirmPassword && setIsLoading(true) }}
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                       <p>{isLoading ? 'Chargement, veuillez patienter...' : 'S\'inscrire'}</p>
                    </button>
                </form>
                 <p className="mt-4 text-sm text-center text-gray-600">
          Vous avez déjà un compte ?{" "}
          <button
            onClick={() => setSign?.(prev => (prev === 1 ? undefined : 1))}
            className="text-blue-500 hover:underline"
          >
            Se connecter
          </button>
        </p>
                <button
                    onClick={() => {setIsLoading(true); signIn("google", { callbackUrl: "/Services" });}}
                    className="mt-2 flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    <FcGoogle size={20} />
                    <span className="text-gray-600 text-sm">Se connecter avec Google</span>
                </button>
            </div>
            
        </div>
    );
};

export default DivlabSpaceSignUp;
