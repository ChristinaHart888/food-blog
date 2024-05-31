"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Popup from "../components/popup";
import styles from "./login.module.css";
import useDB from "../hooks/useDB";
import TextInput from "../components/TextInput";
import { useAuth } from "../context/authcontext";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [isDisabled, setIsDisabled] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const { loginUser, loginGuest } = useDB();
    const { user, login } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (user && user.userId != undefined) {
            router.push("/");
        }
    }, []);

    const loginHandler = async () => {
        setIsDisabled(true);
        if (email && password) {
            let result = await loginUser({ email: email, password: password });
            if (result.status === 200) {
                const userDetails = result.body;
                console.log("userDetails", userDetails);
                login({
                    username: userDetails.username,
                    userId: userDetails.userId,
                });
                router.push("./");
            } else {
                console.log("result", result);
                setErrorMessage(result.body.toString());
                setIsDisabled(false);
            }
        } else {
            setErrorMessage("Please enter Email and Password");
        }
    };
    const guestButtonHandler = async () => {
        let result = await loginGuest();
        if (result?.status === "success") {
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("username", result.username);
            router.push("./profile");
        } else {
            setErrorMessage(result?.message);
        }
    };

    return (
        <main className="">
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h1>Login</h1>
                    <form>
                        <TextInput
                            onChange={setEmail}
                            type="email"
                            label={"Email"}
                        ></TextInput>
                        <TextInput
                            onChange={setPassword}
                            type="password"
                            label={"Password"}
                        ></TextInput>
                    </form>
                    <button
                        onClick={loginHandler}
                        className={styles.formBtn}
                        id={styles.loginBtn}
                        disabled={isDisabled}
                    >
                        {isDisabled ? "Loading..." : "Log In"}
                    </button>
                    {/* <button
                        onClick={logInWithGoogleHandler}
                        className={styles.formBtn}
                        id={styles.guestBtn}
                        disabled
                    >
                        Log in with Google
                    </button> */}
                    <button
                        onClick={guestButtonHandler}
                        className={styles.formBtn}
                        id={styles.guestBtn}
                        disabled={isDisabled}
                    >
                        Continue as guest
                    </button>
                    <small>
                        New to Karaoke-v1?{" "}
                        <Link href="./signup" className={styles.signUpLink}>
                            Sign up
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
