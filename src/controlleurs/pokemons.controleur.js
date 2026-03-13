import pokemonsModel from "../models/pokemons.model.js";

const trouverUnPokemon = async (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        res.status(400);
        res.send({ erreur: "L'id du pokemon est obligatoire" });
        return;
    }
    
    if (parseInt(id) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }

    try {
        const pokemon = await pokemonsModel.getPokemonById(id);

        if (pokemon === null) {
            res.status(404);
            res.send({ erreur: `Pokemon introuvable avec l'id ${id}` });
            return;
        }

        res.send(pokemon);

    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la récupération du pokemon avec l'id ${id}` });
    }
};

const listerPokemons = async (req, res) => {
    let page = req.query.page;
    let type = req.query.type;
    
    if (!page) {
        page = 1;
    } else {
        page = parseInt(page);
    }
    
    if (!type) {
        type = '';
    }

    try {
        const result = await pokemonsModel.getPokemonsList(page, type);
        
        const total = result.total;
        const totalPages = Math.ceil(total / 25);

        res.send({
            pokemons: result.pokemons,
            type: type,
            nombrePokemonTotal: total,
            page: page,
            totalPage: totalPages
        });

    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: "Echec lors de la récupération de la liste des pokemons" });
    }
};

const ajouterPokemon = async (req, res) => {
    const nom = req.body.nom;
    const type_primaire = req.body.type_primaire;
    const type_secondaire = req.body.type_secondaire;
    const pv = req.body.pv;
    const attaque = req.body.attaque;
    const defense = req.body.defense;
    
    const champsManquants = [];
    
    if (nom === undefined || nom === null) {
        champsManquants.push('nom');
    }
    if (type_primaire === undefined || type_primaire === null) {
        champsManquants.push('type_primaire');
    }
    if (type_secondaire === undefined || type_secondaire === null) {
        champsManquants.push('type_secondaire');
    }
    if (pv === undefined || pv === null) {
        champsManquants.push('pv');
    }
    if (attaque === undefined || attaque === null) {
        champsManquants.push('attaque');
    }
    if (defense === undefined || defense === null) {
        champsManquants.push('defense');
    }

    if (champsManquants.length > 0) {
        res.status(400);
        res.send({
            erreur: "Le format des données est invalide",
            champ_manquant: champsManquants
        });
        return;
    }

    try {
        const nouveauId = await pokemonsModel.createPokemon(nom, type_primaire, type_secondaire, pv, attaque, defense);

        res.status(201);
        res.send({
            message: `Le pokemon ${nom} a été ajouté avec succès`,
            pokemon: {
                id: nouveauId,
                nom: nom,
                type_primaire: type_primaire,
                type_secondaire: type_secondaire,
                pv: pv,
                attaque: attaque,
                defense: defense
            }
        });

    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la création du pokemon ${nom}` });
    }
};

const modifierPokemon = async (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        res.status(400);
        res.send({ erreur: "L'id du pokemon est obligatoire" });
        return;
    }
    
    if (parseInt(id) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }
    
    const nom = req.body.nom;
    const type_primaire = req.body.type_primaire;
    const type_secondaire = req.body.type_secondaire;
    const pv = req.body.pv;
    const attaque = req.body.attaque;
    const defense = req.body.defense;
    
    const champsManquants = [];
    
    if (nom === undefined || nom === null) {
        champsManquants.push('nom');
    }
    if (type_primaire === undefined || type_primaire === null) {
        champsManquants.push('type_primaire');
    }
    if (type_secondaire === undefined || type_secondaire === null) {
        champsManquants.push('type_secondaire');
    }
    if (pv === undefined || pv === null) {
        champsManquants.push('pv');
    }
    if (attaque === undefined || attaque === null) {
        champsManquants.push('attaque');
    }
    if (defense === undefined || defense === null) {
        champsManquants.push('defense');
    }

    if (champsManquants.length > 0) {
        res.status(400);
        res.send({
            erreur: "Le format des données est invalide",
            champ_manquant: champsManquants
        });
        return;
    }

    try {
        const modifie = await pokemonsModel.updatePokemon(id, nom, type_primaire, type_secondaire, pv, attaque, defense);

        if (modifie === false) {
            res.status(404);
            res.send({ erreur: `Le pokemon id ${id} n'existe pas dans la base de données` });
            return;
        }

        res.send({ message: `Le pokemon id ${id} a été modifié avec succès` });

    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la modification du pokemon ${nom}` });
    }
};

const supprimerPokemon = async (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        res.status(400);
        res.send({ erreur: "L'id du pokemon est obligatoire" });
        return;
    }
    
    if (parseInt(id) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }

    try {
        const supprime = await pokemonsModel.deletePokemon(id);

        if (supprime === false) {
            res.status(404);
            res.send({ erreur: `Le pokemon id ${id} n'existe pas dans la base de données` });
            return;
        }

        res.send({ message: `Le pokemon id ${id} a été supprimé avec succès` });

    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la suppression du pokemon` });
    }
};

export {
    trouverUnPokemon,
    listerPokemons,
    ajouterPokemon,
    modifierPokemon,
    supprimerPokemon
};