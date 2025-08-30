import { useState } from "react"
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/app/Components/lightswind/collapsible";

export default function MyCollapsibles() {
    const [openId, setOpenId] = useState<string | null>(null)

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id)
    }

    return (
        <div className="space-y-2">
            <Collapsible open={openId === "1"} onOpenChange={() => handleToggle("1")}>
                <CollapsibleTrigger className="w-full p-2 bg-gray-200">Section 1</CollapsibleTrigger>
                <CollapsibleContent className="p-2 border">Contenu 1</CollapsibleContent>
            </Collapsible>

            <Collapsible open={openId === "2"} onOpenChange={() => handleToggle("2")}>
                <CollapsibleTrigger className="w-full p-2 bg-gray-200">Section 2</CollapsibleTrigger>
                <CollapsibleContent className="p-2 border">Contenu 2</CollapsibleContent>
            </Collapsible>

            <Collapsible open={openId === "3"} onOpenChange={() => handleToggle("3")}>
                <CollapsibleTrigger className="w-full p-2 bg-gray-200">Section 3</CollapsibleTrigger>
                <CollapsibleContent className="p-2 border">Contenu 3</CollapsibleContent>
            </Collapsible>

            
        </div>
    )
}