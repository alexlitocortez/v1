"use client";

import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from "react";
import { Payment } from "~/app/dashboard/data";

interface AppContextType {
    nameContext: Payment[];
    setNameContext: Dispatch<SetStateAction<Payment[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppWrapperProps {
    children: ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
    const [nameContext, setNameContext] = useState<Payment[]>([]); // Initialize as an empty array

    return (
        <AppContext.Provider value={{ nameContext, setNameContext }}>
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppWrapper");
    }
    return context;
}

export default AppContext;