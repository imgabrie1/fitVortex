import app from "./app";
import { AppDataSource } from "./data-source";

const PORT: number = Number(process.env.PORT) || 3000;
AppDataSource.initialize().then(() => {
    console.log("Database connected!")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch(err => {
    console.log(err)
})