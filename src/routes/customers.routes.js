import { Router } from "express"
import { getcustomers, createcustomers, getcustomersById, editcustomersById } from "../controllers/customersController.js"
// import { creategame, deletegame, editgameById, getgameById, getgames } from "../controllers/gamesController.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { customersSchema } from "../schemas/customers.schema.js"

const customersRouter = Router()

customersRouter.get("/customers", getcustomers)
customersRouter.get("/customers/:id", getcustomersById)
customersRouter.post("/customers", validateSchema(customersSchema), createcustomers)
// gamesRouter.delete("/games/:id", deletegame)
customersRouter.put("/customers/:id", validateSchema(customersSchema), editcustomersById)

export default customersRouter;