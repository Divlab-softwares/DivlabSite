"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TemplateItem {
    id: number;
    name: string;
    link: string;
    image_pc: string;
    image_mobile: string;
}

interface Props {
    templates: TemplateItem[];
    onSelect: (value: string) => void;
}

export default function TemplateCarousel({ templates, onSelect }: Props) {
    const [selected, setSelected] = useState<string>("");

    const handleSelect = (link: string) => {
        setSelected((l)=> l == link ? "" : link);
        onSelect(link);
    };

    return (
        <div className="w-full py-6">
            <h2 className="text-xl font-bold mb-4">Choisissez un Template</h2><span className="text-sm text-gray-500 ml-1">(Optionnel) Defilez <ArrowRight /></span>

            {/* Carrousel horizontal */}
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
                {templates.map((t) => (
                    <div
                        key={t.id}
                        className={`min-w-[320px] snap-center border rounded-2xl shadow-md p-4 transition-all
              cursor-pointer hover:shadow-xl
              ${selected === t.link ? "border-blue-600 shadow-blue-300" : "border-gray-200"}
            `}
                        onClick={() => handleSelect(t.link)}
                    >
                        {/* Images PC + Mobile */}
                        <div className="flex gap-4">
                            <Image
                                src={t.image_pc}
                                alt={t.name + " PC"}
                                width={200}
                                height={130}
                                className="rounded-lg object-cover border"
                            />
                            <Image
                                src={t.image_mobile}
                                alt={t.name + " Mobile"}
                                width={100}
                                height={180}
                                className="rounded-lg object-cover border "
                            />
                        </div>

                        {/* Title */}
                        <p className="text-center font-semibold mt-3">{t.name}</p>

                        {/* Button */}
                        <div className="mt-3 text-center">
                            <Button
                                className="rounded-lg px-4"
                                onClick={(e) => {
                                    e.stopPropagation(); // empêche la sélection automatique
                                    window.open(t.link, "_blank");
                                }}
                            >
                                Voir le template
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Affichage du template choisi */}
            {selected && (
                <p className="mt-3 text-green-600 font-semibold">
                    Template sélectionné : <a href={selected}>{selected}</a>
                </p>
            )}
        </div>
    );
}
