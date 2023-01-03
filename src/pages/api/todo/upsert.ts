import { client } from "@databaseClient";
import { NextApiRequest, NextApiResponse } from "next";

interface TodoDto {
	id?: number;
	note?: string;
	title: string;
	user_email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const todo = req.body as TodoDto;

	if (!todo.id) {
		const newTodo = await client.todo.create({
			data: {
				...todo,
			},
		});
		await res.status(200).send(JSON.stringify(newTodo));
		return;
	}

	const updatedTodo = await client.todo.update({
		where: {
			id: todo.id,
		},
		data: {
			...todo,
		},
	});

	await res.status(200).send(JSON.stringify(updatedTodo));
}
