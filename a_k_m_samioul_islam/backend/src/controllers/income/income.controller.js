import { createIncomeService, deleteIncomeService, getIncomeDetailsService, getIncomesService, updateIncomeDetailsService } from "../../services/income/income.service.js";

// Income creation

export const createIncome = async (req, res) => {
    try {
        const income = await createIncomeService(req.body, req.dbUser);

        return res.status(201).json({
            success: true,
            message: "Income created successfully",
            data: income
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// User incomes

export const getIncomes = async (req, res) => {
    try {
        const incomes = await getIncomesService({
            dbUser: req.dbUser,
            ...req.query
        });

        return res.status(200).json({
            success: true,
            message: "Incomes fetched successfully",
            data:incomes
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Income fetch

export const getIncomeDetails = async (req, res) => {
    try {
        const income = await getIncomeDetailsService(req.params.id, req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Income details fetched successfully",
            data: income
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Income update

export const updateIncomeDetails = async (req, res) => {
    try {
        const income = await updateIncomeDetailsService({
            ...req.body, 
            id: req.params.id
        }, req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Income details updated successfully",
            data: income
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Income deletion

export const deleteIncome = async (req, res) => {
    try {
        const income = await deleteIncomeService(req.params.id, req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};