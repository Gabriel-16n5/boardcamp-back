import joi from "joi"

export const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().min(10).max(11),
    cpf: joi.number().required().min(11),
    birthday: joi.date().less('1-12-2022').required()
});