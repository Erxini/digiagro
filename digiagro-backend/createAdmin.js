// createAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./database/db');
const Usuario = require('./database/models/usuarios');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    // Datos del administrador
    const adminData = {
      nombre: 'Sergio Rueda Gonzalez',
      email: 'sergio.ruedagonzalez@riberadeltajo.es',
      password: '200609',
      telefono: '637882741',
      rol: 'Admin'
    };

    // Verificar si el usuario ya existe
    const adminExists = await Usuario.findOne({ 
      where: { email: adminData.email } 
    });

    if (adminExists) {
      console.log('───────────────────────────────────────────');
      console.log('El usuario ya existe en el sistema.');
      console.log('Actualizando la contraseña para asegurar que funciona...');
      
      // Crear hash de contraseña con la configuración de salt específica
      const salt = await bcrypt.genSalt(10); // Usa un salt de 10 rondas que es estándar
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      // Actualizar contraseña
      await adminExists.update({ 
        password: hashedPassword 
      });
      
      console.log('───────────────────────────────────────────');
      console.log('Contraseña actualizada correctamente.');
      console.log('Datos de acceso:');
      console.log(`Email: ${adminData.email}`);
      console.log(`Contraseña: ${adminData.password}`);
      console.log('───────────────────────────────────────────');
      process.exit(0);
    }

    // Si no existe, creamos el usuario administrador
    console.log('Creando nuevo usuario administrador...');
    
    // Crear hash de contraseña con la configuración de salt específica
    const salt = await bcrypt.genSalt(10); // Usa un salt de 10 rondas que es estándar
    const hashedPassword = await bcrypt.hash(adminData.password, salt);
    
    // Crear administrador
    const admin = await Usuario.create({
      nombre: adminData.nombre,
      email: adminData.email,
      password: hashedPassword,
      telefono: adminData.telefono,
      rol: adminData.rol
    });

    console.log('────────────────────────────────────────────');
    console.log('Administrador creado con éxito:');
    console.log('────────────────────────────────────────────');
    console.log(`Nombre: ${admin.nombre}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Teléfono: ${admin.telefono}`);
    console.log(`Rol: ${admin.rol}`);
    console.log('────────────────────────────────────────────');
    console.log('Datos de acceso:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Contraseña: ${adminData.password}`);
    console.log('────────────────────────────────────────────');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createAdmin();