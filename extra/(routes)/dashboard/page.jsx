"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "C:/Users/Admin/Downloads/expense-tracker/expense-tracker/app/utils/dbConfig.jsx";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "../../utils/schema";
import CardInfo from "./expenses/_components/CardInfo";
import BarChartDashBoard from "./expenses/_components/BarChartDashboard";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { toast } from "sonner";
import Link from "next/link";

function DashBoard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [threshold, setThreshold] = useState(40); // Threshold set to 40%

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`SUM(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
        totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(Budgets.id);

    setBudgetList(result);
    getAllExpenses(); // Fetch all expenses
  };

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress));

    setExpensesList(result);
    analyzeSpending(result); // Analyze spending and show recommendations
  };

  const analyzeSpending = (expenses) => {
    const categorySpend = {}; // Track spending per category

    expenses.forEach((expense) => {
      const category = expense.name; // Replace with expense category if available
      if (!categorySpend[category]) {
        categorySpend[category] = 0;
      }
      categorySpend[category] += expense.amount;
    });

    for (const category in categorySpend) {
      const spending = categorySpend[category];
      if (spending > 10000) { // Warn if spending in a category exceeds 10,000
        toast(`You're spending a lot on ${category}. Consider reducing it to stay within your budget!`);
      }
    }
  };

  return (
    <div className="p-10 bg-gradient-to-b from-black via-gray-900 to-gray-950 min-h-screen">
      <h2 className="font-bold text-4xl text-white mb-2">Hi, {user?.fullName} ✌️</h2>
      <p className="text-gray-400 mb-8">
        Here's what's happening with your money. Let's manage your expense.
      </p>

      <CardInfo budgetList={budgetList} />

      <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-8">
        {/* Chart and Table */}
        <div className="md:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <BarChartDashBoard budgetList={budgetList} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetList()} />
          </div>
        </div>

        {/* Latest Budgets */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="font-extrabold text-2xl text-white mb-6 text-center uppercase tracking-wide">
            Latest Budgets
          </h2>
          <div className="space-y-4">
            {budgetList.map((budget, index) => {
              const remainingMoney = budget.amount - (budget.totalSpend || 0);
              return (
                <Link href={`/dashboard/expenses/${budget.id}`} key={index}>
                  <div className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition-all rounded-lg flex justify-between items-center text-white">
                    <div>
                      <h3 className="text-lg font-semibold">{budget.name}</h3>
                      <p className="text-sm">Total: ₹{budget.amount}</p>
                      <p className="text-sm text-green-300 font-medium">
                        Remaining: ₹{remainingMoney}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-300">Spent: ₹{budget.totalSpend || 0}</p>
                      <p className="text-sm text-gray-300">{budget.totalItem} Items</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
