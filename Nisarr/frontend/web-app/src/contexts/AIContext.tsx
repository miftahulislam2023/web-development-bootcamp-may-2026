import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export interface AIContextType {
    isChatOpen: boolean;
    setChatOpen: (open: boolean) => void;
    bubbleMessage: string | null;
    showBubble: (message: string, action?: () => void, duration?: number) => void;
    hideBubble: () => void;
    bubbleAction: (() => void) | null;
    setStudyHooks?: (hooks: any) => void;
    setInventoryHooks?: (hooks: any) => void;
    pageContext: string; // Description of current page state for AI
    setPageContext: (context: string) => void;
}

export const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
    const [isChatOpen, setChatOpen] = useState(false);
    const [bubbleMessage, setBubbleMessage] = useState<string | null>(null);
    const [bubbleAction, setBubbleAction] = useState<(() => void) | null>(null);
    const [pageContext, setPageContext] = useState<string>("");
    const [studyHooks, setStudyHooks] = useState<any>(null);
    const [inventoryHooks, setInventoryHooks] = useState<any>(null);
    const location = useLocation();

    // Reset page context on navigation
    useEffect(() => {
        setPageContext(`User is viewing ${location.pathname}`);
        hideBubble(); // Hide bubble on nav
    }, [location.pathname]);

    const showBubble = (message: string, action?: () => void, duration = 8000) => {
        setBubbleMessage(message);
        setBubbleAction(() => action || null);

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                setBubbleMessage(null);
                setBubbleAction(null);
            }, duration);
        }
    };

    const hideBubble = () => {
        setBubbleMessage(null);
        setBubbleAction(null);
    };

    return (
        <AIContext.Provider value={{
            isChatOpen,
            setChatOpen,
            bubbleMessage,
            showBubble,
            hideBubble,
            bubbleAction,
            pageContext,
            setPageContext,
            setStudyHooks,
            setInventoryHooks,
        }}>
            {children}
        </AIContext.Provider>
    );
}

export function useAI() {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
}
