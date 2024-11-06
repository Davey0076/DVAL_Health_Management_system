import pool from './config/db';
import { PoolClient } from 'pg';

async function addAdminAndHospital(): Promise<void> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Insert into Admin
    const adminQuery = `
      INSERT INTO Admin (
        hospital_id, full_name, email, password_hash, national_id, kra_pin, contact_number, role, registration_date
      ) VALUES (
        NULL, 'John Doe', 'johndoe@example.com', 'samplepasswordhash', 123456789, 'A1B2C3D4E5', '012-345-6789', 'Admin', CURRENT_TIMESTAMP
      ) RETURNING admin_id;
    `;
    const adminResult = await client.query(adminQuery);
    const adminId: number = adminResult.rows[0].admin_id;

    // Step 2: Insert into Hospital
    const hospitalQuery = `
      INSERT INTO Hospital (
        hospital_name, registration_number, location, contact_info, type, admin_id
      ) VALUES (
        'City Health Hospital', 'CHH-12345', '123 Main St, Nairobi', '012-345-6789', 'public', $1
      ) RETURNING hospital_id;
    `;
    const hospitalResult = await client.query(hospitalQuery, [adminId]);
    const hospitalId: number = hospitalResult.rows[0].hospital_id;

    // Step 3: Update Admin to set hospital_id
    const updateAdminQuery = `
      UPDATE Admin
      SET hospital_id = $1
      WHERE admin_id = $2;
    `;
    await client.query(updateAdminQuery, [hospitalId, adminId]);

    await client.query('COMMIT');
    console.log('Admin and Hospital added successfully');
  } catch (err: unknown) {
    await client.query('ROLLBACK');
    const error = err as Error;
    console.error('Error adding Admin and Hospital:', error.message);
  } finally {
    client.release();
  }
}

addAdminAndHospital();
