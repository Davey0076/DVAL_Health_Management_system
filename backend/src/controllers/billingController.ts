import { Request, Response } from 'express';
import pool from '../config/db';


interface BillRequestBody {
    patient_id: number;
    doctor_id: number;
    service_type: string;
    service_id: number;
    amount_due: number;
}

interface UpdateBillStatusBody {
    status: string;
}

interface BillQueryParams {
    patient_id?: number;
    doctor_id?: number;
    hospital_id?: number;
    status?: string;
    billing_date?: string;
}

// Create Bill
export const createBill = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, doctor_id, service_type, service_id, amount_due }: BillRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;

    if (!patient_id || !doctor_id || !service_type || !service_id || !amount_due) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const query = `
            INSERT INTO Billing 
            (patient_id, doctor_id, hospital_id, service_type, service_id, amount_due, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
            RETURNING billing_id, patient_id, doctor_id, hospital_id, service_type, service_id, amount_due, status, billing_date;
        `;
        
        const values = [patient_id, doctor_id, hospital_id, service_type, service_id, amount_due];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Bill created successfully',
            bill: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating bill:', error.message);
        } else {
            console.error('Error creating bill:', error);
        }
        res.status(500).json({ message: 'Server error encountered' });
    }
};

// Get All Bills
export const getAllBills = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, doctor_id, hospital_id, status, billing_date }: BillQueryParams = req.query;

    try {
        let query = `SELECT * FROM Billing WHERE 1=1`;
        const values: (string | number)[] = [];

        if (patient_id) {
            query += ` AND patient_id = $${values.length + 1}`;
            values.push(patient_id);
        }
        if (doctor_id) {
            query += ` AND doctor_id = $${values.length + 1}`;
            values.push(doctor_id);
        }
        if (hospital_id) {
            query += ` AND hospital_id = $${values.length + 1}`;
            values.push(hospital_id);
        }
        if (status) {
            query += ` AND status = $${values.length + 1}`;
            values.push(status);
        }
        if (billing_date) {
            query += ` AND DATE(billing_date) = $${values.length + 1}`;
            values.push(billing_date);
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving bills:', error.message);
        } else {
            console.error('Error retrieving bills:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Get a given bill by ID
export const getBillById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM Billing WHERE billing_id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Bill not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving bill:', error.message);
        } else {
            console.error('Error retrieving bill:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Update Bill Status ie when a given patient has paid
export const updateBillStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status }: UpdateBillStatusBody = req.body;

    if (!status) {
        res.status(400).json({ message: 'Missing status field' });
        return;
    }

    try {
        const query = `
            UPDATE Billing
            SET status = $1
            WHERE billing_id = $2
            RETURNING billing_id, patient_id, doctor_id, hospital_id, service_type, service_id, amount_due, status, billing_date;
        `;

        const values = [status, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Bill not found' });
            return;
        }

        res.status(200).json({
            message: 'Bill status updated successfully',
            bill: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating bill status:', error.message);
        } else {
            console.error('Error updating bill status:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// delete Bill
export const deleteBill = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM Billing WHERE billing_id = $1 RETURNING billing_id`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Bill not found' });
            return;
        }

        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting bill:', error.message);
        } else {
            console.error('Error deleting bill:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    createBill,
    getAllBills,
    getBillById,
    updateBillStatus,
    deleteBill,
};
