import ExpenseType from "../../models/expenseType.model.js";

import CustomError from "../../utils/customError.js";


// Create Expense Type
export const createExpenseTypeService =
  async (
    userId,
    validatedData
  ) => {

    const { name } =
      validatedData;


    // Check Existing Type
    const existingType =
      await ExpenseType.findOne({
        name,
        user: userId,
      });


    if (existingType) {

      throw new CustomError(
        "Expense type already exists",
        409
      );

    }


    const expenseType =
      await ExpenseType.create({
        name,
        user: userId,
      });


    return expenseType;

};



// Get Expense Types
export const getExpenseTypesService =
  async (userId) => {

    const expenseTypes =
      await ExpenseType.find({
        $or: [
          { isDefault: true },
          { user: userId },
        ],
      });


    return expenseTypes;

};