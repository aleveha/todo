import { client } from "@databaseClient";
import { todo as Todo } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const todo = req.body as Todo;
	const deletedTodo = await client.todo.delete({
		where: {
			id: todo.id,
		},
	});
	await res.status(200).send(JSON.stringify(deletedTodo));
}
