import { signIn } from "next-auth/react";
import { useState } from "react";

interface Sign {
    setSign: React.Dispatch<React.SetStateAction<boolean>>;
    setSignValid: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DivlabSpaceLogin = ({ setSign, setSignValid, setIsLoading }: Sign) => {
    
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // signIn peut retourner undefined
        const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/DivlabSpace"
        });

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md ">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            onClick={() => setSignValid(true)}
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* Additional Links */}
                <div className="text-sm text-center text-gray-600">
                    <p>
                        Don't have an account?{" "}
                        <button onClick={() => { setSign(true); setIsLoading (true)}}  className="text-blue-500 hover:underline">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DivlabSpaceLogin;