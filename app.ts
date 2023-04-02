import express, { Express, Request, Response } from "express";
import path from "path";

const app: Express = express();

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 8000;

//listen on port 8000
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});
