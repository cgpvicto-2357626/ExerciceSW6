import { trouverUnPokemon, listerPokemons, ajouterPokemon, modifierPokemon, supprimerPokemon} from '../controlleurs/pokemons.controleur.js';

import express from 'express';
const router = express.Router();


router.get('/liste', listerPokemons);
router.get('/:id', trouverUnPokemon);
router.post('/', ajouterPokemon);
router.put('/:id', modifierPokemon);
router.delete('/:id', supprimerPokemon);

export default router;