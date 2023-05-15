import { db } from "../database/database.connection.js";

export async function getcustomers(req, res) {
    try{
        const customers = await db.query(`
        SELECT *, to_char(birthday, 'YYYY-MM-DD') AS birthday 
            FROM customers;
        `);
        res.send(customers.rows);
    } catch (erro){
        res.send(erro.message)
    }
}

export async function getcustomersById(req, res) {
    const {id} = req.params;
    try{
        const customersId = await db.query(`
        SELECT *, to_char(birthday, 'YYYY-MM-DD') AS birthday 
            FROM customers WHERE id = $1;
        `, [id]);
        if(customersId.rows[0] === null || customersId.rows[0] === undefined || customersId.rows[0] === "") return res.sendStatus(404);
        return res.send(customersId.rows[0]);
    } catch (erro){
       return res.send(erro.message)
    }
}

export async function createcustomers(req, res) {
    const {name, phone, cpf, birthday} = req.body;
    const validation = await db.query(`
        SELECT customers.cpf
            FROM customers
                WHERE customers.cpf = $1;
        `, [cpf])
        const verify = validation.rows[0];
    if(verify) return res.sendStatus(409);
    try{
        await db.query(`
            INSERT INTO customers (name, phone, "cpf", "birthday")
                VALUES ($1, $2, $3, $4);
        `, [name, phone, cpf, birthday])
        return res.sendStatus(201);
    }catch(erro) {
        return res.send(erro.message)
    }
    
}

export async function editcustomersById(req, res) {
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;
    try{
        const validation = await db.query(`
        SELECT customers.cpf, customers.id
            FROM customers
                WHERE customers.cpf = $1 AND NOT customers.id = $2;
        `, [cpf, id])
        const verify = validation.rows[0];
        if(verify) return res.sendStatus(409);
        await db.query(`
        UPDATE customers
            SET "name" = $1, phone = $2, cpf = $3, birthday = $4
                WHERE id=$5;`, [name, phone, cpf, birthday ,id]);
        return res.sendStatus(200);
    } catch (erro){
       return res.send(erro.message)
    }
}