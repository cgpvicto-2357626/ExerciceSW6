import { ajouterUtilisateur, recupererCle } from '../controlleurs/utilisateur.controleur.js';
import express from 'express';
const router = express.Router();

router.post('/', ajouterUtilisateur);
router.get('/cle', recupererCle);

export default router;