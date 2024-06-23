"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { UserObject } from "../types/userTypes";
import { User } from "../types/dbTypes";

export interface AuthContextType {
    user: UserObject | null;
    login: (userData: User) => void;
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
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        let username = localStorage.getItem("username");
        if (userId && username) {
            setUser({
                userId,
                username,
            });
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("username", userData.username);
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
