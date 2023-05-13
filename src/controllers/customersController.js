import { db } from "../database/database.connection.js";

export async function getcustomers(req, res) {
    try{
        const customers = await db.query('SELECT * FROM customers;');
        res.send(customers.rows);
    } catch (erro){
        res.send(erro.message)
    }
}

export async function getcustomersById(req, res) {
    const {id} = req.params;
    try{
        const customersId = await db.query(`
        SELECT *
	    FROM customers
              WHERE customers.id=$1;`, [id]);

        // se precisar que seja apenas 1 registro com algumas infos \/
        // const gameIdAll = {
        //     ...gameId.rows[0],
        //     categorias: gameId.rows.map(gm => gm.categoria)
        // }
        // delete gameIdAll.categoria;
        // res.send(gameIdAll);
        // res.send(gameId);
        // res.send(gameId.rows);
        return res.send(customersId.rows[0]); // esse [0] é para tirar ele de dentro do array, vir só objeto
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
        const customersid = await db.query(`
            INSERT INTO customers (name, phone, "cpf", "birthday")
                VALUES ($1, $2, $3, $4);
        `, [name, phone, cpf, birthday])
        console.log(customersid.rows[0])
        return res.sendStatus(201);
    }catch(erro) {
        return res.send(erro.message)
    }
    
}

// export async function deletegame(req, res) {
//     res.send("deletegame")
// }

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
        const customersId = await db.query(`
        UPDATE customers
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