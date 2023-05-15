import { db } from "../database/database.connection.js";

export async function getgames(req, res) {
    try{
        const games = await db.query('SELECT * FROM games;');
        res.send(games.rows);
    } catch (erro){
        res.send(erro.message)
    }
}

export async function creategame(req, res) {
    const {name, image, stockTotal, pricePerDay} = req.body;
    const validation = await db.query(`
        SELECT games.name
            FROM games
                WHERE games.name = $1;
        `, [name])
        const verify = validation.rows[0];
    if(verify) return res.sendStatus(409);
    try{
        await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay")
                VALUES ($1, $2, $3, $4);
        `, [name, image, stockTotal, pricePerDay])
        return res.sendStatus(201);
    }catch(erro) {
        return res.send(erro.message)
    }
    
}