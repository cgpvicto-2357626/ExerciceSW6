import { creerUtilisateur, recuperationCleApi } from '../models/utilisateur.model.js';

const ajouterUtilisateur = async (req, res) => {
    const nom = req.body.nom;
    const courriel = req.body.courriel;
    const mot_de_passe = req.body.mot_de_passe;

    try {
        const cleApi = await creerUtilisateur(nom, courriel, mot_de_passe);

        res.status(201);
        res.json({
            "message": "L'utilisateur a été créé",
            "cle_api": cleApi
        });

    } catch (erreur) {
        res.status(500);
        res.json({ message: "Echec lors de la création de l'utilisateur" });
    }
};

const recupererCle = async (req, res) => {
    const courriel = req.body.courriel;
    const mot_de_passe = req.body.mot_de_passe;
    const nouvelle = req.query.nouvelle === '1';

    try {
        const cle = await recuperationCleApi(courriel, mot_de_passe, nouvelle);
        res.json({ cle_api: cle });
    } catch (erreur) {
        res.status(401);
        res.json({ message: erreur.message });
    }
};

export {ajouterUtilisateur, recupererCle};