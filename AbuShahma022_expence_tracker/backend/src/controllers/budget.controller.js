import {
  createBudgetValidation,
} from "../validation/budget.validation.js";

import {
  createBudgetService,
  getCurrentBudgetService,
} from "../services/budget/budget.service.js";


// Create Budget
export const createBudget =
  async (
    req,
    res,
    next
  ) => {

    try {

      const validatedData =
        createBudgetValidation.parse(
          req.body
        );


      const budget =
        await createBudgetService(
          req.user.id,
          validatedData
        );


      res.status(201).json({
        success: true,
        message:
          "Budget saved successfully",
        data: budget,
      });

    } catch (error) {

      next(error);

    }

};



// Get Current Budget
export const getCurrentBudget =
  async (
    req,
    res,
    next
  ) => {

    try {

      const month =
        Number(req.query.month);

      const year =
        Number(req.query.year);


      const budget =
        await getCurrentBudgetService(
          req.user.id,
          month,
          year
        );


      res.status(200).json({
        success: true,
        data: budget,
      });

    } catch (error) {

      next(error);

    }

};