import { db } from "../database/database.connection.js";
import dayjs from 'dayjs'
export async function getrentals(req, res) {
    try{
        const holder = await db.query(`
        SELECT rentals.*, u1.name AS pessoa, u2.name AS jogo
        FROM rentals
           JOIN customers u1 ON u1.id = rentals."customerId"
           JOIN games u2 ON u2.id = rentals."gameId"
        ;`);
        const rentalsList = [];
        for(let i = 0; i < holder.rowCount; i++){
            const rentals = [{
                id: holder.rows[i].id,
                customerId: holder.rows[i].customerId,
                gameId: holder.rows[i].gameId,
                rentDate: holder.rows[i].rentDate.toLocaleDateString('en-US'),
                daysRented: holder.rows[i].daysRented,
                returnDate: holder.rows[i].returnDate,
                originalPrice: holder.rows[i].originalPrice,
                delayFee: holder.rows[i].delayFee,
                customer: {
                    id: holder.rows[i].customerId,
                    name: holder.rows[i].pessoa
                },
                game: {
                    id: holder.rows[i].gameId,
                    name: holder.rows[i].jogo
                }
            }
        ]
        rentalsList.push(rentals[0])
        }
        res.send(rentalsList);
    } catch (erro){
        res.send([])
    }
}

export async function createrentals(req, res) {
    const {customerId, gameId, daysRented} = req.body;
    const validation = await db.query(`
        SELECT games.id, games."pricePerDay", customers.id, games."stockTotal"
            FROM games, customers
                WHERE games.id = $1 AND customers.id = $2;
        `, [gameId, customerId])
    const verify = validation.rows[0];
    if(!verify) return res.sendStatus(400);
    if(daysRented <= 0) return res.sendStatus(400);
    if(verify.stockTotal <= 0) return res.sendStatus(400);
    const updateStock = verify.stockTotal - 1;
    const rentPrice = verify.pricePerDay * daysRented;
    try{
        const now = dayjs().format('YYYY/MM/DD');
        const rentalsid = await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, daysRented, now, rentPrice, null, null])
        await db.query(`
        UPDATE games
            SET "stockTotal" = $1
                WHERE id = $2
        ;`, [updateStock, gameId])
        return res.sendStatus(201);
    }catch(erro) {
        return res.send(erro.message)
    }
    
}

export async function deleterentals(req, res) {
    const {id} = req.params;
    const validation = await db.query(`
        SELECT rentals.id, rentals."returnDate"
            FROM rentals
                WHERE rentals.id = $1
        `, [id])
    const verify = validation.rows[0];
    if(!verify) return res.sendStatus(404);
    if(verify.returnDate === null) return res.sendStatus(400);
    try{
        const del = await db.query(`
        DELETE 
            FROM rentals
                WHERE rentals.id = $1;
        `, [id]);
    return res.sendStatus(200);
    }catch(erro) {
        return res.send(erro.message)
    }
}

export async function editrentalsById(req, res) {
    let fee = 0;
    const {id} = req.params;
    try{
        const validation = await db.query(`
        SELECT rentals.id, rentals."returnDate", to_char("returnDate", 'YYYY-MM-DD') AS "returnDate" 
            FROM rentals
               WHERE rentals.id = $1;
        `, [id])
        const verify = validation.rows[0];
        if(!verify) return res.sendStatus(404);
        if(verify.returnDate !== null) return res.sendStatus(400);
        const rentalsId = await db.query(`
        SELECT *, to_char("rentDate", 'YYYY-MM-DD') AS "rentDate"
            FROM rentals
                WHERE rentals.id = $1
        `, [id]);
        const now = dayjs().format('YYYY/MM/DD');
        const holder = (rentalsId.rows[0].rentDate.replace(/[-/"]/g, '')) - (now.replace(/[/"]/g, '')) + rentalsId.rows[0].daysRented;
        if(holder >= 0){
            fee = 0;
            fee = fee * rentalsId.rows[0].originalPrice;
        }else{
            fee = holder * -1;
            fee = fee * rentalsId.rows[0].originalPrice;
        }
        await db.query(`
        UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
                WHERE id = $3
        ;`, [now, fee, id])
        return res.sendStatus(200);
    } catch (erro){
       return res.send(erro.message)
    }
}