import { FilterRadioButtonGroup } from "@components/filter-radio-button-group";
import { NewTodoForm } from "@components/new-todo-form";
import { todo as Todo } from "@prisma/client";
import { Filter, userState } from "@states/userState";
import axios from "axios";
import clsx from "clsx";
import { useAtom } from "jotai";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import * as process from "process";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import useSWR, { SWRConfig, useSWRConfig } from "swr";

function sort(todos: Todo[], filter: Filter) {
	switch (filter) {
		case Filter.completed:
			return todos.filter(todo => todo.is_completed);
		case Filter.incompleted:
			return todos.filter(todo => !todo.is_completed);
		default:
			return todos.sort((a, b) => (a.is_completed === b.is_completed ? b.id - a.id : a.is_completed ? 1 : -1));
	}
}

const Todos: FC = () => {
	const [user, setUser] = useAtom(userState);
	const [editTodo, setEditTodo] = useState<Todo>();
	const router = useRouter();
	const { mutate } = useSWRConfig();

	const { data: todos } = useSWR<Todo[]>("/api/todo/", () =>
		axios.get(`/api/todo/${user?.email}`).then(res => res.data),
	);

	const handleTodoDeleted = (todo: Todo) => async () => {
		await axios.post<Todo>("/api/todo/delete", todo);
		await mutate("/api/todo/");
	};

	const onTodoCompleted = (todo: Todo) => async (event: ChangeEvent<HTMLInputElement>) => {
		await axios.post<Todo>("/api/todo/upsert", {
			...todo,
			is_completed: event.target.checked,
		});

		await mutate("/api/todo/");
	};

	const handleOnLogout = () => setUser(null);

	const handleTodoEdit = (todo: Todo) => () => {
		setEditTodo(todo);
		window.scroll(0, 0);
	};

	const handleTodoEditCancel = () => setEditTodo(undefined);

	const handleFilterChange = (value: Filter) => () => setUser(prev => prev && { ...prev, sorting: value });

	useEffect(() => {
		if (!user || !todos) {
			router.push("/");
			return;
		}
	}, [user, todos, router]);

	if (!user || !todos) {
		return null;
	}

	return (
		<div className="ui-container mb-12 flex flex-col space-y-12">
			<div className="mt-12 flex items-center space-x-4 text-neutral-600 md:mt-24 lg:mt-32">
				<button onClick={handleOnLogout}>
					<svg
						className="h-6 w-6 hover:text-indigo-700"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.8}
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
						/>
					</svg>
				</button>
				<h1 className="text-2xl">Todos ({user.email})</h1>
			</div>
			<div className="flex flex-col space-y-4">
				<NewTodoForm defaultValues={editTodo} resetDefaultValue={handleTodoEditCancel} />
				<FilterRadioButtonGroup handleFilterChange={handleFilterChange} state={user.sorting || Filter.all} />
			</div>
			<div className="flex flex-col space-y-4">
				{sort(todos, user.sorting ?? Filter.all).map(todo => (
					<div
						className={clsx(
							"relative flex items-start rounded-lg border border-gray-300 p-4 pr-12 shadow-sm",
							todo.is_completed && "bg-indigo-50",
						)}
						key={todo.id}
					>
						<div className="flex h-5 items-center">
							<input
								checked={todo.is_completed}
								className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								id={`todo-${todo.id}`}
								onChange={onTodoCompleted(todo)}
								type="checkbox"
							/>
						</div>
						<div className="ml-3">
							<label htmlFor={`todo-${todo.id}`} className="font-medium text-gray-700">
								{todo.title}
							</label>
							<p className="text-gray-500">{todo.note}</p>
							<span className="text-xs font-medium text-gray-500">
								{new Date(todo.date).toLocaleString("cs")}
							</span>
						</div>
						<div className="absolute right-4 top-4 flex flex-col space-y-3">
							<button onClick={handleTodoDeleted(todo)}>
								<svg
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="h-4 w-4 text-gray-400 hover:text-indigo-700"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
									/>
								</svg>
							</button>
							<button onClick={handleTodoEdit(todo)}>
								<svg
									className="h-4 w-4 text-gray-400 hover:text-indigo-700"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
									/>
								</svg>
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

interface Props {
	fallback: {
		"/api/todo/": Todo[];
	};
}

const Page: NextPage<Props> = ({ fallback }) => {
	return (
		<SWRConfig value={{ fallback }}>
			<Todos />
		</SWRConfig>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	const { data: todos } = await axios.get<Todo[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/todo/${params?.email}`);

	return {
		props: {
			fallback: {
				"/api/todo/": JSON.parse(JSON.stringify(todos)),
			},
		},
	};
};

export default Page;
