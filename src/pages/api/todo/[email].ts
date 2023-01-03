import { client } from "@databaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const todos = await client.todo.findMany({
		where: {
			user_email: req.query.email as string,
		},
	});
	res.status(200).send(JSON.stringify(todos));
}
