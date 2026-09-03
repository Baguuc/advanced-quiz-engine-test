import express, {type Express, type Request, type Response} from 'express';
import cors from 'cors';

const app: Express = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

console.log("Server starting @ port 3000.");
app.listen(3000);