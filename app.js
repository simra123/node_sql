const express = require("express");
const app = express();
const { Client } = require("pg");

const client = new Client({
	host: "localhost",
	user: "postgres",
	password: "password",
	port: 3000,
	database: "pratice1",
});
client.connect();
app.use(express.json());
app.post("/create-job", (req, res) => {
	// console.log(req.body, "req");
	const { company, position, status } = req.body;
	const string = `insert into jobs (company , position , status) values ('${company}' , '${position}' , '${status}')`;
	if (!company || !position || !status) {
		res.status(400).json({
			code: 400,
			message: "please fill all fields",
		});
	} else {
		client.query(string, (err, result) => {
			if (err) {
				res.send(err);
			} else {
				res.json({
					code: 200,
					message: "successfully created a new job",
				});
				console.log(result);
			}
		});
	}
});
app.get("/jobs", (req, res) => {
	// console.log(req.body, "req");
	const string = `select * from jobs `;

	client.query(string, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.status(200).json({
				code: 200,
				data: result.rows,
			});
		}
	});
});
app.get("/jobs/:id", (req, res) => {
	const { id } = req.params;
	const string = `select * from jobs where "Id" ='${id}'`;

	client.query(string, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.status(200).json({
				code: 200,
				data: result.rows,
			});
		}
	});
});
app.post("/jobs/delete", (req, res) => {
	const { id } = req.body;
	const string = `delete from jobs where "Id" ='${id}'`;
	client.query(string, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.status(200).json({
				code: 200,
				message: "successfully deleted the job",
			});
		}
	});
});
app.listen(4000, (req, res) => {
	console.log(`server is up and running`);
});
