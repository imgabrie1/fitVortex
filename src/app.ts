import "express-async-errors";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import { handleErrors } from "./errors";

const app: Application = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use(handleErrors)
export default app