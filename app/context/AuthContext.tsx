"use client";
import React, { createContext, useState, useContext } from "react";
import { UserObject } from "../types/userTypes";

export interface AuthContextType {
    user: UserObject | null;
    login: (userData: object) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return null;
    }
    return context;
};

export const AuthProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState<UserObject | null>(null);

    const login = (userData: Object) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
