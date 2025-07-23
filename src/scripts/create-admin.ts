const AppDataSource = require('../config/data-source');
const { User, UserRole } = require('../entities/user.entity');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established.');

    const existingAdmin = await AppDataSource.getRepository(User).findOne({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const admin = new User();
    admin.nationalId = '2007123419982345';
    admin.fullName = 'Mahinga Rodin';
    admin.email = 'mahingarodin@gmail.com';
    admin.password = await bcrypt.hash('rodin@123', 10);
    admin.role = UserRole.ADMIN;

    await AppDataSource.getRepository(User).save(admin);
    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  }
}

createAdmin();
