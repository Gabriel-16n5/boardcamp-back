import { Router } from "express"
import { createrentals, deleterentals, editrentalsById, getrentalsById, getrentals } from "../controllers/rentalsController.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { rentalsSchema } from "../schemas/rentals.schema.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getrentals)
rentalsRouter.get("/rentals/:id", getrentalsById)
rentalsRouter.post("/rentals", validateSchema(rentalsSchema), createrentals)
rentalsRouter.delete("/rentals/:id", deleterentals)
rentalsRouter.put("/rentals/:id", validateSchema(rentalsSchema), editrentalsById)

export default rentalsRouter;