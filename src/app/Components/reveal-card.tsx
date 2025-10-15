import * as React from "react";
import { cn } from "./lib/utils"; // Ensure this utility is present or replace with className logic
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"; // Import HTMLMotionProps

interface RevealCardContextType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RevealCardContext = React.createContext<RevealCardContextType | undefined>(undefined);

interface RevealCardProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    openDelay?: number;
    closeDelay?: number;
    NewClassName?: string;
}

const RevealCard: React.FC<RevealCardProps> = ({
    children,
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
    NewClassName = "",
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = React.useCallback(
        (value: boolean | ((prev: boolean) => boolean)) => {
            if (!isControlled) {
                setUncontrolledOpen(value);
            }
            if (onOpenChange) {
                const newValue = typeof value === "function" ? value(open) : value;
                onOpenChange(newValue);
            }
        },
        [isControlled, onOpenChange, open]
    );

    const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleOpen = React.useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }

        if (!open) {
            openTimerRef.current = setTimeout(() => {
                setOpen(true);
            }, openDelay);
        }
    }, [open, openDelay, setOpen]);

    const handleClose = React.useCallback(() => {
        if (openTimerRef.current) {
            clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }

        if (open) {
            closeTimerRef.current = setTimeout(() => {
                setOpen(false);
            }, closeDelay);
        }
    }, [open, closeDelay, setOpen]);

    // Clear timers on unmount
    React.useEffect(() => {
        return () => {
            if (openTimerRef.current) clearTimeout(openTimerRef.current);
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    return (
        <RevealCardContext.Provider value={{ open, setOpen }}>
            <div
                className={`  ${NewClassName}`}
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                onFocusCapture={handleOpen} // Use capture phase to ensure it fires before child's onFocus
                onBlurCapture={handleClose}  // Use capture phase
            >
                {children}
            </div>
        </RevealCardContext.Provider>
    );
};

interface RevealCardTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

const RevealCardTrigger: React.FC<RevealCardTriggerProps> = ({ children, asChild = false }) => {
    // If asChild is true, we just render the child directly.
    // The onMouseEnter/Leave/Focus/Blur listeners are on the parent RevealCard div.
    if (asChild) {
        return <>{children}</>;
    }

    // If not asChild, we wrap the children in a div to ensure the RevealCard has a DOM element to attach listeners to.
    // This div also needs to be part of the hover/focus interaction, so it's placed inside the RevealCard's event listeners.
    // The outer div in RevealCard handles the events, so this div simply renders the content.
    return <div tabIndex={0}>{children}</div>; // Add tabIndex for keyboard accessibility
};

// ---
// **CHANGE MADE HERE:**
// Changed `React.HTMLAttributes<HTMLDivElement>` to `HTMLMotionProps<"div">`
// ---
interface RevealCardContentProps extends HTMLMotionProps<"div"> {
    align?: "center" | "start" | "end";
    sideOffset?: number;
}

const RevealCardContent = React.forwardRef<HTMLDivElement, RevealCardContentProps>(
    ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
        const context = React.useContext(RevealCardContext);
        if (!context) {
            throw new Error("RevealCardContent must be used within a RevealCard");
        }

        const { open } = context;

        return (
            <AnimatePresence>
                {open && ( // Conditionally render the motion.div based on `open` state
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, scale: 0.95, y: 15 }} // Start invisible, slightly smaller, and slightly up
                        animate={{ opacity: 1, scale: 1, y: 0 }}       // Fade in, grow to full size, move to natural position
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}      // Fade out, shrink, and move up on exit
                        transition={{ duration: 0.2, ease: "easeInOut" }} // Smooth transition
                        className={cn(` z-50 rounded-xl  text-black shadow-md `, className )}
                        // style={{
                        //     top: `calc(100% + ${sideOffset}px)`, // Position below the trigger
                        //     left: align === "center" ? "50%" : align === "start" ? "0" : "auto",
                        //     right: align === "end" ? "0" : "auto",
                        //     transform: align === "center" ? "translateX(-50%)" : "none", // Center horizontally if align="center"
                        //     // No need for transform here directly, framer-motion handles it
                        // }}
                        {...props} // Pass through Framer Motion props
                    />
                )}
            </AnimatePresence>
        );
    }
);
RevealCardContent.displayName = "RevealCardContent";

// Exports
export { RevealCard, RevealCardTrigger, RevealCardContent };