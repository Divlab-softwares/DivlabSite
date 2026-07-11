import { useState } from "react";
import { TopLoader } from "../lightswind/top-loader";


export function useApiLoader() {
    const [isLoading, setIsLoading] = useState(false);

    const fetchWithLoader = async (url: string, options: RequestInit = {}) => {
        setIsLoading(true);
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data;
        } finally {
            setIsLoading(false);
        }
    };

    const ApiLoader = () => <TopLoader isLoading={isLoading} color="#33C3F0" height={4} />;

    return { ApiLoader, fetchWithLoader, isLoading };
}