import { authoritiesModel } from "../models/authoritiesModel.js";

const getRanks = async (req, res) => {
    try {
        const ranks = await authoritiesModel.getRanksModel();
        res.json(ranks);
    } catch (error) {
        console.error('Error al Recuperar los Rangos', error);
        res.status(500).json({ message: 'Error al Recuperar los Rangos' });
    }
};

const getRank = async (req, res) => {
    const { cod_ran } = req.params;
    try {
        const rank = await authoritiesModel.getRankModel({ cod_ran });
        if (!rank) return res.status(404).json({ message: 'Rango no Encontrado' });
        res.json(rank);
    } catch (error) {
        console.error('Error al Recuperar el Rango', error);
        res.status(500).json({ message: 'Error al Recuperar el Rango' });
    }
};

const createRank = async (req, res) => {
    let { nom_ran, abr_ran } = req.body;

    if (typeof nom_ran === 'string') nom_ran = nom_ran.toUpperCase();
    if (typeof abr_ran === 'string') abr_ran = abr_ran.toUpperCase();

    try {
        const newRank = await authoritiesModel.createRankModel({
            nom_ran, abr_ran
        });
        res.status(201).json(newRank);
    } catch (error) {
        console.error('Error al Crear el Rango', error);
        res.status(500).json({ message: 'Error al Crear el Rango' });
    }
};

const updateRank = async (req, res) => {
    const { cod_ran } = req.params;
    let { nom_ran, abr_ran } = req.body;

    if (typeof nom_ran === 'string') nom_ran = nom_ran.toUpperCase();
    if (typeof abr_ran === 'string') abr_ran = abr_ran.toUpperCase();

    try {
        const updated = await authoritiesModel.updateRankModel(cod_ran, {
            nom_ran, abr_ran
        });
        if (!updated) return res.status(404).json({ message: 'Rango no encontrado o sin cambios' });
        res.json({ message: 'Rango actualizado con éxito', data: updated });
    } catch (error) {
        console.error('Error al Editar el Rango', error);
        res.status(500).json({ message: 'Error al Editar el Rango' });
    }
};

const deleteRank = async (req, res) => {
    const { cod_ran } = req.params;
    try {
        const result = await authoritiesModel.deleteRankModel({ cod_ran });
        if (!result) return res.status(404).json({ message: 'Rango no encontrado' });
        res.json({ message: 'Rango eliminado con éxito' });
    } catch (error) {
        console.error('Error al Eliminar el Rango', error);
        res.status(500).json({ message: 'Error al Eliminar el Rango' });
    }
};  

const getAuthorities = async (req, res) => {
    try {
        const authorities = await authoritiesModel.getAuthoritiesModel();
        res.json(authorities);
    } catch (error) {
        console.error('Error al Recuperar las Autoridades', error);
        res.status(500).json({ message: 'Error al Recuperar las Autoridades' });
    }
};

const getAuthority = async (req, res) => {
    const { cod_aut } = req.params;
    try {
        const authority = await authoritiesModel.getAuthorityModel({ cod_aut });
        if (!authority) return res.status(404).json({ message: 'Autoridad no Encontrada' });
        res.json(authority);
    } catch (error) {
        console.error('Error al Recuperar la Autoridad', error);
        res.status(500).json({ message: 'Error al Recuperar la Autoridad' });
    }
};

const createAuthority = async (req, res) => {
    let { nom_aut, ape_aut, pro_aut, dec_aut, ran_aut, ced_aut } = req.body;

    if (typeof nom_aut === 'string') nom_aut = nom_aut.toUpperCase();
    if (typeof ape_aut === 'string') ape_aut = ape_aut.toUpperCase();
    if (typeof dec_aut === 'string') dec_aut = dec_aut.toUpperCase();
    if (typeof ran_aut === 'string') ran_aut = ran_aut.toUpperCase();
    if (typeof ced_aut === 'string') ced_aut = ced_aut.toUpperCase();

    try {
        const newAuthority = await authoritiesModel.createAuthorityModel({
            nom_aut,
            ape_aut,
            pro_aut,
            dec_aut,
            ran_aut,
            ced_aut
        });
        res.status(201).json(newAuthority);
    } catch (error) {
        console.error('Error al Crear la Autoridad', error);
        res.status(500).json({ message: 'Error al Crear la Autoridad' });
    }
};

const updateAuthority = async (req, res) => {
    const { cod_aut } = req.params;
    let { nom_aut, ape_aut, pro_aut, dec_aut, ran_aut, ced_aut } = req.body;

    if (typeof nom_aut === 'string') nom_aut = nom_aut.toUpperCase();
    if (typeof ape_aut === 'string') ape_aut = ape_aut.toUpperCase();
    if (typeof dec_aut === 'string') dec_aut = dec_aut.toUpperCase();
    if (typeof ran_aut === 'string') ran_aut = ran_aut.toUpperCase();
    if (typeof ced_aut === 'string') ced_aut = ced_aut.toUpperCase();

    try {
        const updated = await authoritiesModel.updateAuthorityModel(cod_aut, {
            nom_aut,
            ape_aut,
            pro_aut,
            dec_aut,
            ran_aut,
            ced_aut
        });
        if (!updated) return res.status(404).json({ message: 'Autoridad no encontrada o sin cambios' });
        res.json({ message: 'Autoridad actualizada con éxito', data: updated });
    } catch (error) {
        console.error('Error al Editar la Autoridad', error);
        res.status(500).json({ message: 'Error al Editar la Autoridad' });
    }
};

const deleteAuthority = async (req, res) => {
    const { cod_aut } = req.params;
    try {
        const result = await authoritiesModel.deleteAuthorityModel({ cod_aut });
        if (!result) return res.status(404).json({ message: 'Autoridad no encontrada' });
        res.json({ message: 'Autoridad eliminada con éxito' });
    } catch (error) {
        console.error('Error al Eliminar la Autoridad', error);
        res.status(500).json({ message: 'Error al Eliminar la Autoridad' });
    }
};

export const authoritiesController = {
    getRanks,
    getRank,
    getAuthorities,
    getAuthority,
    createAuthority,
    updateAuthority,
    deleteAuthority,
    createRank,
    updateRank,
    deleteRank
};
