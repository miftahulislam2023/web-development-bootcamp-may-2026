import {
  createExpenseTypeValidation,
} from "../validation/expenseType.validation.js";

import {
  createExpenseTypeService,
  getExpenseTypesService,
} from "../services/expenseType/expenseType.service.js";


// Create Expense Type
export const createExpenseType =
  async (
    req,
    res,
    next
  ) => {

    try {

      const validatedData =
        createExpenseTypeValidation.parse(
          req.body
        );


      const expenseType =
        await createExpenseTypeService(
          req.user.id,
          validatedData
        );


      res.status(201).json({
        success: true,
        message:
          "Expense type created successfully",
        data: expenseType,
      });

    } catch (error) {

      next(error);

    }

};


// Get Expense Types
export const getExpenseTypes =
  async (
    req,
    res,
    next
  ) => {

    try {

      const expenseTypes =
        await getExpenseTypesService(
          req.user.id
        );


      res.status(200).json({
        success: true,
        data: expenseTypes,
      });

    } catch (error) {

      next(error);

    }

};