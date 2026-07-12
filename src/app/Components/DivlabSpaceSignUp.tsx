import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { TopLoader } from "./lightswind/top-loader";
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
    setIsSignUpOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const DivlabSpaceSignUp: React.FC<Sign> = ({ setSignResult, setSign, setIsSignUpOpen }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState<string>("");

    // // Charger les messages au démarrage
    // useEffect(() => {
    //     fetch("/api/Conversations")
    //         .then(res => res.json())
    //         // .then(data => setMessages(data));
    // }, []);

    // Envoyer un message
    const handleSignUp = async (): Promise<void> => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
        });

        const data = await res.json();

        console.log("Response from /api/auth/register:", data);

        setIsLoading(false);

        if (res.ok) {
            // Auto-login juste après inscription
            await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            setSignResult?.({
                data: [formData],
                message: "Inscription réussie",
                status: "success"
            });
            setSign?.(-2);
            setIsSignUpOpen?.(false);
        } else {
            setSignResult?.({
                data: [],
                message: data.error || "Erreur lors de l'inscription",
                status: "failed"
            });
            setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            //alert("Erreur lors de l'inscription");
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

    const [visible, setVisible] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        //console.log("Form Data Submitted:", formData);
        if (formData.password === formData.confirmPassword) {
            handleSignUp();
        } else {
            setSignResult?.({
                data: [],
                message: "Les mots de passe ne correspondent pas.",
                status: "failed"
            });
            setFormData({ name: formData.name, email: formData.email, password: "", confirmPassword: "" });
            setIsLoading(false);
        }
        // setSign(false) 
        // Add your form submission logic here
    };

    return (
        <div className="w-full flex items-center justify-center bg-blue-400 rounded-2xl p-2 shadow-lg">
            <TopLoader isLoading={isLoading} color="#33C3F0" height={2} />
            <div className="w-full  p-8 bg-white rounded-xl shadow-md">
                <p className="text-2xl font-bold text-center text-gray-800">Creez votre compte Div<span className="text-info">lab</span></p>
                <hr className="my-4" />
                <p className="text-sm text-center text-gray-600">Veuillez remplir les informations ci-dessous pour créer votre compte.</p>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black border-transparent"
                            placeholder="Entrez tout votre nom "
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-black border-transparent"
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            type={visible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-black border-transparent"
                            placeholder="Entrez un mot de passe"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmer votre mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-black border-transparent"
                            placeholder="Confirmer votre mot de passe"
                            required
                        />
                    </div>



                    <button
                        type="submit"
                        // disabled={isLoading}
                        onClick={() => { formData.name && formData.email && formData.password && formData.confirmPassword && setIsLoading(true) }}
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <p>{isLoading ? 'Chargement, veuillez patienter...' : 'S\'inscrire'}</p>
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Vous avez deja un compte ?{" "}
                    <button onClick={() => { setSign?.(prev => (prev === 1 ? undefined : 1)) }} className="text-blue-500 hover:underline">
                        Se connecter
                    </button>
                </p>
                <button
                    onClick={() => { setIsLoading(true); signIn("google", { callbackUrl: "/Services" }); }}
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
