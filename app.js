// const express = require("express");
// const app = express();
import pkg from "pg";
const { Client } = pkg;
// const bcrypt = require("bcryptjs");
// const saltRounds = 10;
// const jwt = require("jsonwebtoken");

const client = new Client({
	host: "localhost",
	user: "postgres",
	password: "password",
	port: 3000,
	database: "pratice1",
});
client.connect();
// app.use(express.json());

// const getToken = (id, username) => {
// 	const token = jwt.sign(
// 		{ userId: id, name: username },
// 		"MzEfYyjiWA4R4/M2bS1GB4t7NXp9",
// 		{
// 			expiresIn: "60",
// 		}
// 	);
// 	return token;
// };

// app.post("/create-job", (req, res) => {
// 	const { company, position, status } = req.body;
// 	const string = `insert into jobs (company , position , status) values ($1 , $2 , $3)`;
// 	if (!company || !position || !status) {
// 		res.status(400).json({
// 			code: 400,
// 			message: "please fill all fields",
// 		});
// 	} else {
// 		client.query(string, [company, position, status], (err, result) => {
// 			if (err) {
// 				res.send(err);
// 			} else {
// 				res.json({
// 					code: 200,
// 					message: "successfully created a new job",
// 				});
// 				console.log(result);
// 			}
// 		});
// 	}
// });
// app.get("/jobs", (req, res) => {
// 	const string = `select * from jobs `;
// 	client.query(string, (err, result) => {
// 		if (err) {
// 			res.send(err);
// 		} else {
// 			res.status(200).json({
// 				code: 200,
// 				data: result.rows,
// 			});
// 		}
// 	});
// });
// app.get("/jobs/:id", (req, res) => {
// 	const { id } = req.params;
// 	const string = `select * from jobs where id ='${id}'`;

// 	client.query(string, (err, result) => {
// 		if (err) {
// 			res.send(err);
// 		} else {
// 			res.status(200).json({
// 				code: 200,
// 				data: result.rows,
// 			});
// 		}
// 	});
// });
// app.post("/jobs/delete", (req, res) => {
// 	const { id } = req.body;
// 	const string = `delete from jobs where id ='${id}'`;
// 	client.query(string, (err, result) => {
// 		if (err) {
// 			res.send(err);
// 		} else {
// 			res.status(200).json({
// 				code: 200,
// 				message: "successfully deleted the job",
// 			});
// 		}
// 	});
// });
// app.post("/register", (req, res) => {
// 	const { name, email, password } = req.body;
// 	const string = `insert into register (name , email , password) values ($1 , $2 , $3)`;
// 	if (!name || !email || !password) {
// 		res.status(400).json({
// 			code: 400,
// 			message: "please fill all fields",
// 		});
// 	} else {
// 		bcrypt.hash(password, saltRounds, (err, hash) => {
// 			client.query(string, [name, email, hash], (err, result) => {
// 				if (err) {
// 					res.send(err?.detail);
// 				} else {
// 					res.json({
// 						code: 200,
// 						message: "successfully registered",
// 					});
// 					console.log(result);
// 				}
// 			});
// 		});
// 	}
// });

// app.post("/login", (req, res) => {
// 	const { email, password } = req.body;
// 	const query = "select * from register where email = $1";
// 	client.query(query, [email], (err, result) => {
// 		if (result?.rows.length > 0) {
// 			bcrypt.compare(password, result.rows[0].password, (error, response) => {
// 				if (response) {
// 					const token = getToken(result.rows[0].user_id, result.rows[0].name);
// 					res.json({
// 						code: 200,
// 						message: "Login successfully",
// 						token: token,
// 					});
// 				} else {
// 					res.status(400).json({
// 						code: 400,
// 						message: "provided password is incorrect",
// 					});
// 				}
// 			});
// 		} else {
// 			res.status(404).json({
// 				code: 404,
// 				message: "User doesnt exist",
// 			});
// 		}
// 	});
// });
// app.listen(4000, (req, res) => {
// 	console.log(`server is up and running`);
// });
import Fatisfy from "fastify";
const fatisfy = Fatisfy();

fatisfy.get("/", async (request, reply) => {
	// const string = `select * from jobs `;
	// await client.query(string, (err, result) => {
	// 	if (err) {
	// 		reply.send(err);
	// 	} else {
	// 		console.log(result.rows);
	// 		return "hi";
	// 	}
	// });
	reply.send([
		{ name: 234 },
		{ name: 234 },
		{ name: 234 },
		{ name: 234 },
		{ name: 234 },
	]);
});
fatisfy.listen(4000, () => {
	console.log("server is running on fatisfy");
});
