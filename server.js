// Define app using express
var express = require("express")
var app = express()
// Require database SCRIPT file
var db = require("./database.js");

// Require md5 MODULE
var md5 = require("md5");

// Make Express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set server port
HTTP_PORT = 5000

// Start server
app.listen(HTTP_PORT, () => {
    //console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
    res.json({ "message": "Your API works! (200)" });
    res.status(200);
});

// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/
app.post("/app/new/user", (req, res) => {
	const stmt = db.prepare("INSERT INFO userinfo (user, pass) VALUES (?, ?)");
	const i = stmt.run(req.body.user, md5(req.body.pass))
	//var v = {message:i.changes +" record created: ID "+i.lastInsertRowid+" (201)"}
	res.status(201).send({message:i.changes +" record created: ID "+i.lastInsertRowid+" (201)"});
});

// READ a list of all users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {	
	const stmt = db.prepare("SELECT * FROM userinfo").all();
	res.status(200).json(stmt);
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/users:id", (req, res) => {	
	const stmt = db.prepare("SELECT user, pass FROM userinfo WHERE id = ?");
	const i = stmt.get(req.params.id)
	var v = {id: parseInt(req.params.id), user: i["user"], pass: i["pass"]}
	res.status(200).json(v)
});

// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {
	const stmt = db.prepare("UPDATE userinfo SET user = COALESCE(?,user), pass = COALESCE(?,pass) WHERE id = ?");
	const i = stmt.run(req.body.user, md5(req.body.pass), req.params.id)
	var v = {message:i.changes+" record updated: ID " + req.params.id+" (200)"}
	res.status(200).send(v);
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
	const stmt = db.prepare("DELETE FROM userinfo WHERE id = ?");
	const fuck = stmt.run(req.params.id)
	var v = {message: fuck.changes + " record deleted: ID " + req.params.id + " (200)"}
	res.status(200).send(v);
});

// Default response for any other request
app.use(function(req, res){
	//res.json({"message":"Endpoint not found. (404)"});
	res.json({"message":"Your API is working!"});
    res.status(404);
});
