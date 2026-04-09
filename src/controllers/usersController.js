import { userModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsersModel();
        res.json(users);
    } catch (error) {
        console.error('Error al Recuperar los Usuarios', error);
        res.status(500).json({ message: 'Error al Recuperar los Usuarios' });
    }
};

// Obtener un solo usuario por cédula
const getUser = async (req, res) => {
    const { ced_usu } = req.params;
    try {
        // Se pasa la cédula como objeto para que coincida con el modelo
        const user = await userModel.getUserModel({ ced_usu });
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no Encontrado' });
        }  
        res.json(user);
    } catch (error) {
        console.error('Error al Recuperar el Usuario:', error);
        res.status(500).json({ message: 'Error al Recuperar el Usuario' });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { cla_usu, ...otherData } = req.body;
    
    // Validación básica para evitar el error de 'undefined'
    if (!cla_usu) {
        return res.status(400).json({ message: 'La contraseña es obligatoria' });
    }

    try {
        const hashedPassword = await bcrypt.hash(cla_usu, 10);
        const newUser = await userModel.createUserModel({ 
            ...otherData, 
            cla_usu: hashedPassword 
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al Crear el Usuario:', error);
        res.status(500).json({ message: 'Error al Crear el Usuario' });
    }
};

// Editar un usuario existente
const updateUser = async (req, res) => {
    const { ced_usu } = req.params;
    const { cla_usu, ...otherData } = req.body;

    try {
        let updatedUser;
        if (cla_usu) {
            const hashedPassword = await bcrypt.hash(cla_usu, 10);
            updatedUser = await userModel.updateUserModel(ced_usu, { 
                ...otherData, 
                cla_usu: hashedPassword 
            });
        } else {
            updatedUser = await userModel.updateUserModel(ced_usu, otherData);
        }

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no Encontrado o no se realizaron cambios' });
        }
        res.json({ message: 'Usuario actualizado con éxito', data: updatedUser });
    } catch (error) {
        console.error('Error al Editar el Usuario:', error);
        res.status(500).json({ message: 'Error al Editar el Usuario' });
    }
};

// Eliminar un usuario
const deleteUsers = async (req, res) => {
    const { ced_usu } = req.params;
    try {
        const isDeleted = await userModel.deleteUserModel({ ced_usu });
        
        if (!isDeleted) {
            return res.status(404).json({ message: 'Usuario no Encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al Eliminar el Usuario:', error);
        res.status(500).json({ message: 'Error al Eliminar el Usuario' });
    }
};

export const UsersControllers = {
    getUser,
    getUsers,
    createUser,
    deleteUsers,
    updateUser,
};