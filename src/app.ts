import "express-async-errors";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser"
import { handleErrors } from "./errors";
import loginRoutes from "./routers/login.routes";
import userRoutes from "./routers/users.routes";
import exerciseRoutes from "./routers/exercise.routes";
import workoutRoutes from "./routers/workout.routes";
import microCycleRoutes from "./routers/microCycle.routes";
import macroCycleRoutes from "./routers/macroCycle.routes";

const app: Application = express()

app.use(helmet())
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use("/login", loginRoutes)
app.use("/user", userRoutes)
app.use("/exercise", exerciseRoutes)
app.use("/workout", workoutRoutes)
app.use("/microcycle", microCycleRoutes)
app.use("/macrocycle", macroCycleRoutes)

app.use(handleErrors)
export default app