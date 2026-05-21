import {
  createExpenseValidation,
  updateExpenseValidation
} from "../validation/expense.validation.js";

import {
  createExpenseService,
  getExpensesService,
  updateExpenseService,
  deleteExpenseService,
  getExpenseSummaryService,
  getCategorySummaryService,
  getMonthlySummaryService,
  getSingleExpenseService
} from "../services/expense/expense.service.js";


// Create Expense
export const createExpense =
  async (
    req,
    res,
    next
  ) => {

    try {

      const validatedData =
        createExpenseValidation.parse(
          req.body
        );


      const expense =
        await createExpenseService(
          req.user.id,
          validatedData
        );


      res.status(201).json({
        success: true,
        message:
          "Expense created successfully",
        data: expense,
      });

    } catch (error) {

      next(error);

    }

};

export const getExpenses =
  async (
    req,
    res,
    next
  ) => {

    try {

      const result =
        await getExpensesService(
          req.user.id,
          req.query
        );


      res.status(200).json({
        success: true,

        currentPage:
          result.currentPage,

        totalPages:
          result.totalPages,

        totalExpenses:
          result.totalExpenses,

        data:
          result.expenses,
      });

    } catch (error) {

      next(error);

    }

};

export const updateExpense =
  async (
    req,
    res,
    next
  ) => {

    try {

      const validatedData =
        updateExpenseValidation.parse(
          req.body
        );


      const updatedExpense =
        await updateExpenseService(
          req.params.id,
          req.user.id,
          validatedData
        );


      res.status(200).json({
        success: true,
        message:
          "Expense updated successfully",
        data: updatedExpense,
      });

    } catch (error) {

      next(error);

    }

};


export const deleteExpense =
  async (
    req,
    res,
    next
  ) => {

    try {

      await deleteExpenseService(
        req.params.id,
        req.user.id
      );


      res.status(200).json({
        success: true,
        message:
          "Expense deleted successfully",
      });

    } catch (error) {

      next(error);

    }

};


export const getExpenseSummary =
  async (
    req,
    res,
    next
  ) => {

    try {

      const summary =
        await getExpenseSummaryService(
          req.user.id
        );


      res.status(200).json({
        success: true,
        data: summary,
      });

    } catch (error) {

      next(error);

    }

};

export const getCategorySummary =
  async (
    req,
    res,
    next
  ) => {

    try {

      const summary =
        await getCategorySummaryService(
          req.user.id
        );


      res.status(200).json({
        success: true,
        data: summary,
      });

    } catch (error) {

      next(error);

    }

};

export const getMonthlySummary =
  async (
    req,
    res,
    next
  ) => {

    try {

      const summary =
        await getMonthlySummaryService(
          req.user.id
        );


      res.status(200).json({
        success: true,
        data: summary,
      });

    } catch (error) {

      next(error);

    }

};

export const getSingleExpense =
  async (
    req,
    res,
    next
  ) => {

    try {

      const expense =
        await getSingleExpenseService(
          req.params.id,
          req.user.id
        );


      res.status(200).json({
        success: true,
        data: expense,
      });

    } catch (error) {

      next(error);

    }

};