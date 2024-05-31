"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Popup from "../components/popup";
import styles from "./signin.module.css";
import useDB from "../hooks/useDB";
import TextInput from "../components/TextInput";
import { useAuth } from "../context/authcontext";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { addUser } = useDB();
    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && user.userId != undefined) {
            router.push("/");
        }
    }, []);

    const signUpHandler = async () => {
        if (username && password) {
            const result = await addUser({
                email: email,
                username: username,
                password: password,
            });
            if (result.status === 200) {
                //localStorage.setItem("userId", result.userId);
                login({
                    userId: result.userId,
                    username: username,
                });
                router.push("./");
            } else {
                console.log("result.body", result.body);
                setErrorMessage(result.body.toString());
                setTimeout(() => {
                    setErrorMessage("");
                }, 5000);
            }
        }
    };

    return (
        <main className="">
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h1>Sign Up</h1>
                    <form>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                id="email"
                                placeholder=""
                                className={styles.formInput}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder=""
                                id="username"
                                className={styles.formInput}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            ></input>
                            <label htmlFor="username" className={styles.label}>
                                Username
                            </label>
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="password"
                                placeholder=""
                                id="password"
                                className={styles.formInput}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                            <label htmlFor="password" className={styles.label}>
                                Password
                            </label>
                        </div>
                    </form>
                    <button onClick={signUpHandler} className={styles.formBtn}>
                        Sign Up
                    </button>
                    <small>
                        Already have an account?{" "}
                        <Link href="./login" className={styles.signUpLink}>
                            Login
                        </Link>{" "}
                        now!
                    </small>
                </div>
                <Popup
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    timeout={5000}
                ></Popup>
            </div>
        </main>
    );
}
