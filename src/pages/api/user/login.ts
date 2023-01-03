import { client } from "@databaseClient";
import { compare, hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { email, password } = req.body;

	let user = await client.user.findFirst({
		where: {
			email,
		},
	});

	if (!user) {
		user = await client.user.create({
			data: { email, password: await hash(password, 10) },
		});
	}

	if (!user) {
		res.status(500).send("Something went wrong");
		return;
	}

	const passwordMatch = await compare(password, user.password);
	if (!passwordMatch) {
		res.status(401).send("Invalid email or password");
		return;
	}

	await res.status(200).send(JSON.stringify(user));
}
