"use client";

import { createContext, useState, useContext, ReactNode, FC } from "react";
import { Payment } from "~/app/dashboard/data";

interface AppContextType {
    selectedRows: Payment[];
    setSelectedRows: React.Dispatch<React.SetStateAction<Payment[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppWrapperProps {
    children: ReactNode;
}

export const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
    const [selectedRows, setSelectedRows] = useState<Payment[]>([]);

    return (
        <AppContext.Provider value={{ selectedRows, setSelectedRows }}>
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext() {
    return useContext(AppContext)
}