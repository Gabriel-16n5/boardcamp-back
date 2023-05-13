import { Router } from "express"
import { getcustomers, createcustomers } from "../controllers/customersController.js"
// import { creategame, deletegame, editgameById, getgameById, getgames } from "../controllers/gamesController.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { customersSchema } from "../schemas/customers.schema.js"

const customersRouter = Router()

customersRouter.get("/customers", getcustomers)
// gamesRouter.get("/games/:id", getgameById)
customersRouter.post("/customers", validateSchema(customersSchema), createcustomers)
// gamesRouter.delete("/games/:id", deletegame)
// gamesRouter.put("/games/:id", validateSchema(gamesSchema), editgameById)

export default customersRouter;