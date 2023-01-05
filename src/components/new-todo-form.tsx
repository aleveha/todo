import { todo as Todo } from "@prisma/client";
import { userState } from "@states/userState";
import axios from "axios";
import { useAtom } from "jotai";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

interface Props {
	defaultValues?: Todo;
	resetDefaultValue: () => void;
}

export const NewTodoForm: FC<Props> = ({ defaultValues, resetDefaultValue }) => {
	const [user] = useAtom(userState);
	const { mutate } = useSWRConfig();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<Todo>({
		defaultValues: { title: "" },
		mode: "onChange",
	});

	const onSubmit = async (values: Todo) => {
		if (!user) {
			return;
		}
		await axios.post<Todo>("/api/todo/upsert", {
			...values,
			user_email: user.email,
			date: defaultValues ? new Date() : undefined,
		});
		reset();
		resetDefaultValue();
		await mutate("/api/todo/");
	};

	useEffect(() => {
		reset(defaultValues ?? { title: "", note: "" });
	}, [defaultValues, reset]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="overflow-hidden rounded-lg border border-gray-300 p-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
				<div className="mr-4 flex items-center space-x-4">
					<input
						className="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0"
						placeholder="Title"
						type="text"
						{...register("title", {
							maxLength: { value: 100, message: "Too long title" },
							minLength: { value: 3, message: "Too short title" },
							required: true,
						})}
					/>
					<span className="ui-input-error whitespace-nowrap">{errors.title?.message}</span>
				</div>
				<div className="relative pb-4">
					<textarea
						className="block h-full w-full resize-none border-0 py-0 placeholder-gray-500 focus:ring-0 sm:text-sm"
						placeholder="Write a note..."
						rows={5}
						{...register("note", { required: false, maxLength: { value: 255, message: "Too long note" } })}
					/>
					<span className="ui-input-error absolute -bottom-2">{errors.note?.message}</span>
				</div>
				<div className="h-px" />
				<div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
					<div className="flex-shrink-0">
						<button type="submit" className="ui-button">
							{defaultValues ? "Update" : "Create"}
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};
