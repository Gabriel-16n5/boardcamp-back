import { Router } from "express"
import { getgames, creategame } from "../controllers/gamesController.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { gamesSchema } from "../schemas/games.schema.js"

const gamesRouter = Router()

gamesRouter.get("/games", getgames)
gamesRouter.post("/games", validateSchema(gamesSchema), creategame)

export default gamesRouter