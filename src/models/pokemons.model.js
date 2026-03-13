import pool from '../config/db_pg.js';

const getPokemonById = async (id) => {
    const requete = `SELECT * FROM pokemon WHERE id = $1 LIMIT 1`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        
        if (resultat.rows.length === 0) {
            return null;
        }
        
        return resultat.rows[0];
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const getPokemonsList = async (page, type) => {
    const limit = 25;
    const offset = (page - 1) * limit;
    
    let requete = 'SELECT * FROM pokemon';
    let requeteCount = 'SELECT COUNT(*) as total FROM pokemon';
    let params = [];
    let paramsCount = [];

    if (type !== '') {
        requete = requete + ' WHERE type_primaire = $1';
        requeteCount = requeteCount + ' WHERE type_primaire = $1';
        params.push(type);
        paramsCount.push(type);
    }

    const limitIndex = params.length + 1;
    const offsetIndex = params.length + 2;
    requete = requete + ` LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
    params.push(limit);
    params.push(offset);

    try {
        const resultPokemons = await pool.query(requete, params);
        const resultCount = await pool.query(requeteCount, paramsCount);
        
        return {
            pokemons: resultPokemons.rows,
            total: resultCount.rows[0].total
        };
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const createPokemon = async (nom, type_primaire, type_secondaire, pv, attaque, defense) => {
    const requete = `INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const params = [nom, type_primaire, type_secondaire, pv, attaque, defense];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0].id;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const updatePokemon = async (id, nom, type_primaire, type_secondaire, pv, attaque, defense) => {
    const requete = `UPDATE pokemon SET nom = $1, type_primaire = $2, type_secondaire = $3, pv = $4, attaque = $5, defense = $6 WHERE id = $7`;
    const params = [nom, type_primaire, type_secondaire, pv, attaque, defense, id];

    try {
        const resultat = await pool.query(requete, params);
        
        if (resultat.rowCount === 0) {
            return false;
        }
        
        return true;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const deletePokemon = async (id) => {
    const requete = `DELETE FROM pokemon WHERE id = $1`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        
        if (resultat.rowCount === 0) {
            return false;
        }
        
        return true;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export default {
    getPokemonById,
    getPokemonsList,
    createPokemon,
    updatePokemon,
    deletePokemon
};