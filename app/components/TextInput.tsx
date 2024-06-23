import React, { CSSProperties, HTMLInputTypeAttribute } from "react";
import styles from "./textInput.module.css";

interface BaseInputParams {
    label: string;
    onChange: (e: any) => void;
    required?: boolean;
    style?: CSSProperties;
}

interface NumberInputParams extends BaseInputParams {
    type: "number";
    max: number;
    min: number;
}

interface TextInputParams extends BaseInputParams {
    type: "text";
    min?: never;
    max?: never;
}

interface EmailInputParams extends BaseInputParams {
    type: "email";
    min?: never;
    max?: never;
}

interface PasswordInputParams extends BaseInputParams {
    type: "password";
    min?: never;
    max?: never;
}

type InputParams =
    | NumberInputParams
    | TextInputParams
    | EmailInputParams
    | PasswordInputParams;

export default function TextInput({
    label,
    type = "text",
    onChange,
    required = false,
    max,
    min,
    style,
}: InputParams) {
    return (
        <div className={styles.inputContainer}>
            <input
                type={type}
                id="email"
                className={styles.formInput}
                placeholder=""
                onChange={(e) => onChange(e.target.value)}
                style={style}
                required={required}
                max={max && max}
                min={min && min}
            ></input>

            <label htmlFor="email" className={styles.label}>
                {label}
            </label>
        </div>
    );
}
