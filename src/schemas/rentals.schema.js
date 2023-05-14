import joi from "joi"

export const rentalsSchema = joi.object({
    customerId: joi.string().required(),
    gameId: joi.string().required(),
    dayRented: joi.string().required()
});