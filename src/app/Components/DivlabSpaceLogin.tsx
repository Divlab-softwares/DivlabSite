import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
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
}



const DivlabSpaceLogin = ({ setSignResult, setSign,  }: Sign) => {

    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // signIn peut retourner undefined
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setIsLoading(false);
        
        if (res?.error) {
            
            setSignResult?.({
                data: [],
                message: `${res.error == "CredentialsSignin" ? "Identifiants invalides, verifiez votre mot de passe ou votre email" : res.error}` || "Erreur lors de la connexion",
                status: "failed"
            });
            setFormData({ email: "", password: "" });
        } else if (res?.ok) {

            setSignResult?.({
                data: [{ name: "Chez Divlab", email, password, confirmPassword: "" }],
                message: "Inscription réussie",
                status: "success"
            });
            setIsLoading(false);
            setSign?.(-2);
            //window.location.href = "/dashboard";
        }

        console.log("Response from /api/auth/register:", res);

        // if (res && !res.error) {
        //     // ✅ ici res est défini et pas d’erreur
        //     window.location.href = "/DivlabSpace";
        // } else if (res?.error) {
        //     console.log("Erreur :", res.error);
        // } else {
        //     console.log("Réponse indéfinie, probablement un problème côté serveur");
        // }
    };




    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-blue-400 rounded-2xl p-2 shadow-lg">
            <TopLoader isLoading={isLoading} color="#33C3F0" height={2} />
            <div className="w-full  p-8 bg-white rounded-xl shadow-md">
                <p className="text-2xl font-bold text-center text-gray-800">Connectez vous a votre compte Div<span className="text-info">lab</span></p>
                <hr className="my-4" />
                <p className="text-sm text-center text-gray-600">Veuillez remplir les informations ci-dessous pour vous connecter.</p>

                <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  border-transparent"
                            placeholder="Entrz votre email"
                        />
                    </div>

                    {/* Password Input */}
                   
                    <div className="relative">

                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                         <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {!visible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                        <input
                            type={visible ? "text" : "password"}
                            id="password"
                            name="password"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  border-transparent"
                            placeholder="Entrez votre mot de passe"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            // disabled={isLoading}
                            onClick={() => { formData.email && formData.password && setIsLoading(true) }}
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <p>{isLoading ? 'Chargement, veuillez patienter...' : 'Se connecter'}</p>
                        </button>
                    </div>
                </form>

                {/* Additional Links */}
                <div className="text-sm text-center text-gray-600 mt-4">
                    <p>
                        Vous n'avez pas encore de compte ?{" "}
                        <button onClick={() => { setSign && setSign(prev => (prev === 0 ? undefined : 0)) }} className="text-blue-500 hover:underline">
                            S'inscrire
                        </button>
                    </p>
                </div>

                <button
                    onClick={() => {setIsLoading(true); signIn("google");}}
                    className="mt-2 flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    <FcGoogle size={20} />
                    <span className="text-gray-600 text-sm">Se connecter avec Google</span>
                </button>
            </div>
        </div>
    );
};

export default DivlabSpaceLogin;