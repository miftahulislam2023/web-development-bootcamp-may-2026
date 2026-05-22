import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export function AnimatedPage({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ width: "100%", minHeight: "100%" }}
        >
            {children}
        </motion.div>
    );
}
