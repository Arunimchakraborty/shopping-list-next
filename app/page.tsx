import Image from "next/image";
import LoginButton from "@/components/loginButton";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
	return (
		<main>
			<h1>Lmeu</h1>
			<LoginButton />
			<LogoutButton />
		</main>
	);
}
