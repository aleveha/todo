import { LoginForm } from "@components/login-form";
import type { NextPage } from "next";

const Page: NextPage = () => {
	return (
		<div className="ui-container flex h-screen flex-col items-center justify-center space-y-12">
			<h1 className="text-2xl">Login to your TODO list</h1>
			<LoginForm />
		</div>
	);
};

export default Page;
