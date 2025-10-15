import React, { useState, useEffect } from "react";

interface Sign {
    setSign: React.Dispatch<React.SetStateAction<boolean>>;
    setSignValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const DivlabSpaceSignUp = ({ setSign, setSignValid }: Sign) => {

    const [input, setInput] = useState("");

    // // Charger les messages au démarrage
    // useEffect(() => {
    //     fetch("/api/Conversations")
    //         .then(res => res.json())
    //         // .then(data => setMessages(data));
    // }, []);

    // Envoyer un message
    const sendMessage = async () => {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
        });
       
        const newMsg = await res.json();

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


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);

        sendMessage();
        setSign(false) 
        // Add your form submission logic here
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black border-transparent"
                            placeholder="Enter your name"
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
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-black border-transparent"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={() => { setSignValid(true) } }
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Vous avez deja un compte ?{" "}
                    <button onClick={() => setSign(false)} className="text-blue-500 hover:underline">
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default DivlabSpaceSignUp;
