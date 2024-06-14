// testDaoUsers.mjs

import { describe, it } from 'mocha';
import { expect } from 'chai';
import UserDAO from '../src/dao/daoUsers.mjs'; // Asegúrate de que la ruta sea correcta

describe('UserDAO', () => {
  it('should return an array of users', async () => {
    const users = await UserDAO.getAllUsers();
    expect(users).to.be.an('array');
    // Puedes agregar más expectativas específicas aquí según tu lógica de negocio
  });

  it('should return a specific user by ID', async () => {
    // Supongamos que tienes una función en UserDAO para obtener un usuario por ID
    const userId = '609a64c0d8ebe44c9426e3ae'; // Reemplaza con un ID válido de usuario en tu base de datos
    const user = await UserDAO.getUserById(userId);

    expect(user).to.exist; // Verifica que el usuario no sea null o undefined
    expect(user).to.have.property('_id').to.eql(userId); // Verifica que el ID del usuario coincida con el solicitado
    // Agrega más expectativas según sea necesario para validar la información del usuario
  });

  // Puedes añadir más pruebas aquí según tu lógica de DAO de usuarios

});
