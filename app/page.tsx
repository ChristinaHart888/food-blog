import Image from "next/image";
import styles from "./page.module.css";
import Card from "./components/card";

export default function Home() {
    return (
        <main>
            <h1>Homepage</h1>
            <div
                className="card-container"
                style={{
                    display: "grid",
                    gap: "0.4em",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(175px, 10em))",
                    padding: "0.5em",
                }}
            >
                <Card
                    title="Reviews"
                    link="/reviews"
                    background="/images/jb-mj.jpg"
                ></Card>
                <Card title="Stores" link="/stores" background=""></Card>
                <Card
                    title="Add Review"
                    link="/reviews/new"
                    background=""
                ></Card>
                <Card title="Add Store" link="/stores/new" background=""></Card>
            </div>
        </main>
    );
}
