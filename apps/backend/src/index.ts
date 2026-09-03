import express, { type Request, type Response, type Express } from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

console.log("Server starting @ port 3000.");
app.listen(3000);