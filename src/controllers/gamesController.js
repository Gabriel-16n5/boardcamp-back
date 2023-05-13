import { db } from "../database/database.connection.js";

export async function getgames(req, res) {
    try{
        const games = await db.query('SELECT * FROM games;');
        res.send(games.rows);
    } catch (erro){
        res.send(erro.message)
    }
}

// export async function getgameById(req, res) {
//     const {id} = req.params;
//     try{
//         const gameId = await db.query(`
//         SELECT *
// 	    FROM games
//               WHERE games.id=$1;`, [id]);

//         // se precisar que seja apenas 1 registro com algumas infos \/
//         // const gameIdAll = {
//         //     ...gameId.rows[0],
//         //     categorias: gameId.rows.map(gm => gm.categoria)
//         // }
//         // delete gameIdAll.categoria;
//         // res.send(gameIdAll);
//         // res.send(gameId);
//         // res.send(gameId.rows);
//         // res.send(gameId.rows[0]); // esse [0] é para tirar ele de dentro do array, vir só objeto
//     } catch (erro){
//         res.send(erro.message)
//     }
// }

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
        const gameId = await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay")
                VALUES ($1, $2, $3, $4);
        `, [name, image, stockTotal, pricePerDay])
        return res.sendStatus(201);
    }catch(erro) {
        return res.send(erro.message)
    }
    
}

// export async function deletegame(req, res) {
//     res.send("deletegame")
// }

// export async function editgameById(req, res) {
//     res.send("editgameById")
// }