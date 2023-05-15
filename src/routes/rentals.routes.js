import { Router } from "express"
import { createrentals, deleterentals, editrentalsById, getrentals } from "../controllers/rentalsController.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getrentals)
rentalsRouter.post("/rentals", createrentals)
rentalsRouter.delete("/rentals/:id", deleterentals)
rentalsRouter.post("/rentals/:id/return", editrentalsById)

export default rentalsRouter;