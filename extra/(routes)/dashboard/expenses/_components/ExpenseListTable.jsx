import { Trash } from "lucide-react";
import React from "react";
import { db } from "../../../../utils/dbConfig";
import { Expenses } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import moment from "moment"; // Import moment for date formatting

function ExpenseListTable({ expensesList = [], refreshData }) {
    const deleteExpense = async (expense) => {
      const result = await db.delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();
  
      if (result) {
        toast('Expense Deleted Successfully!');
        refreshData();
      }
    };
  
    return (
      <div className='mt-3 bg-gradient-to-b from-black via-gray-800 to-gray-950 p-3 rounded-md'>
        <div className='grid grid-cols-4 bg-gray-800 p-2 rounded-t-md border-none'>
          <h2 className='font-bold text-white'>Name</h2>
          <h2 className='font-bold text-white'>Amount</h2>
          <h2 className='font-bold text-white'>Date</h2>
          <h2 className='font-bold text-white'>Action</h2>
        </div>
        {expensesList && expensesList.length > 0 ? (
          expensesList.map((expense, index) => (
            <div key={expense.id} className='grid grid-cols-4 bg-gray-700 p-2 border-none'>
              <h2 className='text-white'>{expense.name}</h2>
              <h2 className='text-white'>{expense.amount}</h2>
              <h2 className='text-white'>{expense.createdAt}</h2>
              <h2>
                <Trash
                  className='text-red-600 cursor-pointer'
                  onClick={() => deleteExpense(expense)}
                />
              </h2>
            </div>
          ))
        ) : (
          <div className='col-span-4 text-center text-white'>No expenses found.</div>
        )}
      </div>
    );
  }
  
  export default ExpenseListTable;