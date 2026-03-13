import pool from '../src/config/db.js';
import bcrypt from 'bcrypt';

export const creerUtilisateur = async (nom, courriel, mot_de_passe) => {
    const motDePasseHashe = await bcrypt.hash(mot_de_passe, 12);
    const cleApi = crypto.randomUUID();
    const requete = 'INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES (?, ?, ?, ?)';
    const params = [nom, courriel, motDePasseHashe, cleApi];

    try {
        await pool.query(requete, params);
        return cleApi;
    } catch (erreur) {
        console.error(`Erreur requeteSql, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
};

export const validationCle = async (cle) => {
    const requete = 'SELECT 1 FROM utilisateurs WHERE cle_api = ?';
    const params = [cle];

    try {
        const [resultats] = await pool.query(requete, params);
        return resultats.length > 0;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
};

export const recuperationCleApi = async (courriel, motDePasse, nouvelleCle = false) => {
    const requete = 'SELECT mot_de_passe, cle_api FROM utilisateurs WHERE courriel = ?';
    const params = [courriel];

    try {   
        const [resultats] = await pool.query(requete, params);

        if (resultats.length === 0) {
            throw new Error("Courriel ou mot de passe invalid");
        }

        const mdpValide = await bcrypt.compare(motDePasse, resultats[0].mot_de_passe);
        if (!mdpValide) {
            throw new Error("Courriel ou mot de passe invalide");
        }

        if (nouvelleCle) {
            const nouvelleCleApi = crypto.randomUUID();
            const requeteUpdate = 'UPDATE utilisateurs SET cle_api = ? WHERE courriel = ?';
            const parametresUpdate = [nouvelleCleApi, courriel];
            await pool.execute(requeteUpdate, parametresUpdate);
            return nouvelleCleApi;
        }

        return resultats[0].cle_api;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
};
