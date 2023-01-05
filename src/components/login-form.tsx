import { UserState, userState } from "@states/userState";
import { EMAIL_REGEXP } from "@utils/validator";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { useForm } from "react-hook-form";

interface ILoginForm {
	email: string;
	password: string;
}

export const LoginForm: FC = () => {
	const [, setUser] = useAtom(userState);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginForm>({
		defaultValues: { email: "", password: "" },
		mode: "onChange",
	});

	const onSubmit = async (values: ILoginForm) => {
		const { data: user } = await axios.post<UserState>("/api/user/login", values);
		setUser(user);
		await router.push(`/todos/${user.email}`);
	};

	return (
		<form className="flex w-full flex-col space-y-6 sm:w-1/2" onSubmit={handleSubmit(onSubmit)}>
			<div className="relative pb-4">
				<input
					className="ui-input"
					placeholder="your.email@gmail.com"
					type="text"
					{...register("email", {
						required: true,
						pattern: { value: EMAIL_REGEXP, message: "Wrong email format" },
					})}
				/>
				<span className="ui-input-error absolute -bottom-2">{errors.email?.message}</span>
			</div>
			<div className="relative pb-4">
				<input
					className="ui-input"
					placeholder="your password"
					type="password"
					{...register("password", {
						required: true,
						minLength: { value: 8, message: "Too short password" },
					})}
				/>
				<span className="ui-input-error absolute -bottom-2">{errors.password?.message}</span>
			</div>
			<button className="ui-button" type="submit">
				Login
			</button>
		</form>
	);
};
