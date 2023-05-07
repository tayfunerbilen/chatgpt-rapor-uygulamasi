import 'dotenv/config'
import express from "express"
import cors from "cors"
import connection, {dumpCommand, execAsync} from "./db.js";
import openai from "./openai.js";
import {systemPrompt} from "./utils.js";

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

app.post('/', async (req, res) => {

	const {query} = req.body
	const { stdout, stderr } = await execAsync(dumpCommand);

	console.log(stdout)

	const completion = await openai.createChatCompletion({
		model: "gpt-4",
		messages: [
			{
				role: "system",
				content: stdout + "\n\n" + systemPrompt
			},
			{
				role: "user",
				content: query
			}
		],
	});
	try {
		const response = JSON.parse(completion.data.choices[0].message.content);

		connection.query(
			response.query,
			function(err, results, fields) {
				res.send({
					results,
					query: response.query,
					fields: response.fields
				})
			}
		);
	} catch (e) {
		res.send({
			error: completion.data.choices[0].message.content
		})
	}
})

app.listen(PORT, () => console.log(`${PORT} portundan dinleniyor`))
