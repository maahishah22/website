import React, { useEffect, useState } from "react";
import { db } from "../../../utils/dbConfig";
import { eq } from "drizzle-orm";
import { Budgets, Expenses } from "../../../utils/schema";
import { useRouter } from "next/router";

function ExpenseDetail() {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();
  const { budgetId } = router.query;

  useEffect(() => {
    if (budgetId) {
      fetchBudgetDetails(budgetId);
    }
  }, [budgetId]);

  const fetchBudgetDetails = async (budgetId) => {
    const budgetResult = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.id, budgetId))
      .limit(1);

    const expensesResult = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, budgetId));

    setBudget(budgetResult[0]);
    setExpenses(expensesResult);
  };

  if (!budget) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold">{budget.name} Details</h2>
      <p>Total Budget: ₹{budget.amount}</p>
      <p>Spent: ₹{budget.totalSpend || 0}</p>
      <p>Remaining: ₹{budget.amount - (budget.totalSpend || 0)}</p>

      <h3 className="mt-5 text-xl">Expenses</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="mb-3">
            <p>Name: {expense.name}</p>
            <p>Amount: ₹{expense.amount}</p>
            <p>Date: {new Date(expense.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseDetail;
