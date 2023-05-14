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

export async function getrentalsById(req, res) {
    const {id} = req.params;
    try{
        const rentalsId = await db.query(`
        SELECT *, to_char(birthday, 'YYYY-MM-DD') AS birthday 
            FROM rentals WHERE id = $1;
        `, [id]);
        if(rentalsId.rows[0] === null || rentalsId.rows[0] === undefined || rentalsId.rows[0] === "") return res.sendStatus(404);
        // se precisar que seja apenas 1 registro com algumas infos \/
        // const gameIdAll = {
        //     ...gameId.rows[0],
        //     categorias: gameId.rows.map(gm => gm.categoria)
        // }
        // delete gameIdAll.categoria;
        // res.send(gameIdAll);
        // res.send(gameId);
        // res.send(gameId.rows);
        console.log(rentalsId.rows[0])
        return res.send(rentalsId.rows[0]); // esse [0] é para tirar ele de dentro do array, vir só objeto
    } catch (erro){
       return res.send(erro.message)
    }
}

// export async function getgameById(req, res) {
//     const {id} = req.params;
//     try{
//         const gameId = await db.query(`
//         SELECT games.*, categorias.nome AS categoria
// 	    FROM games JOIN "games_Categorias"
// 		    ON games.id = "games_Categorias".id_game
// 	    JOIN categorias
// 		    ON categorias.id = "games_Categorias".id_categoria
//               WHERE games.id=$1;`, [id]);

//         // se precisar que seja apenas 1 registro com algumas infos \/
//         const gameIdAll = {
//             ...gameId.rows[0],
//             categorias: gameId.rows.map(rec => rec.categoria)
//         }
//         delete gameIdAll.categoria;
//         res.send(gameIdAll);
//         // res.send(gameId.rows);
//         // res.send(gameId.rows[0]); // esse [0] é para tirar ele de dentro do array, vir só objeto
//     } catch (erro){
//         res.send(erro.message)
//     }
// }

export async function createrentals(req, res) {
    const {customerId, gameId, daysRented} = req.body;
    const validation = await db.query(`
        SELECT games.id, games."pricePerDay", customers.id, games."stockTotal"
            FROM games, customers
                WHERE games.id = $1 AND customers.id = $2;
        `, [gameId, customerId])
    const verify = validation.rows[0];
    const updateStock = verify.stockTotal - 1;
    console.log(verify)
    if(!verify) return res.sendStatus(400);
    if(daysRented <= 0) return res.sendStatus(400);
    if(verify.stockTotal <= 0) return res.sendStatus(400);

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
    res.send("deleterentals")
}

export async function editrentalsById(req, res) {
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;
    try{
        const validation = await db.query(`
        SELECT rentals.cpf, rentals.id
            FROM rentals
                WHERE rentals.cpf = $1 AND NOT rentals.id = $2;
        `, [cpf, id])
        const verify = validation.rows[0];
        if(verify) return res.sendStatus(409);
        const rentalsId = await db.query(`
        UPDATE rentals
            SET "name" = $1, phone = $2, cpf = $3, birthday = $4
                WHERE id=$5;`, [name, phone, cpf, birthday ,id]);
        // se precisar que seja apenas 1 registro com algumas infos \/
        // const gameIdAll = {
        //     ...gameId.rows[0],
        //     categorias: gameId.rows.map(gm => gm.categoria)
        // }
        // delete gameIdAll.categoria;
        // res.send(gameIdAll);
        // res.send(gameId);
        // res.send(gameId.rows);
        return res.sendStatus(200); // esse [0] é para tirar ele de dentro do array, vir só objeto
    } catch (erro){
       return res.send(erro.message)
    }
}