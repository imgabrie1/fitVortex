import "express-async-errors";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import { handleErrors } from "./errors";
import loginRoutes from "./routers/login.routes";
import userRoutes from "./routers/users.routes";
import exerciseRoutes from "./routers/exercise.routes";

const app: Application = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use("/login", loginRoutes)
app.use("/user", userRoutes)
app.use("/exercise", exerciseRoutes)

app.use(handleErrors)
export default app