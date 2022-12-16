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
app.get("/", (req, res) => {
	const string = "insert into jobs (company) values ('from node')";
	client.query(string, (err, result) => {
		if (err) {
			console.log(err);
		}
	});
});
app.listen(4000, (req, res) => {
	console.log(`server up and running`);
});
