import { Router } from "express"
import { getgames } from "../controllers/gamesController.js"
// import { creategame, deletegame, editgameById, getgameById, getgames } from "../controllers/gamesController.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { gamesSchema } from "../schemas/games.schema.js"

const gamesRouter = Router()

gamesRouter.get("/games", getgames)
// gamesRouter.get("/games/:id", getgameById)
// gamesRouter.post("/games", validateSchema(gamesSchema), creategame)
// gamesRouter.delete("/games/:id", deletegame)
// gamesRouter.put("/games/:id", validateSchema(gamesSchema), editgameById)

export default gamesRouter