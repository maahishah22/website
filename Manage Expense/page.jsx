"use client"
import React, { useEffect,useState } from "react"
import { useUser } from "@clerk/nextjs";
import { Budgets,Expenses } from "../../../../utils/schema"
import {db} from "../../../../utils/dbConfig.jsx";
import { desc, eq, getTableColumns,sql    } from "drizzle-orm";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "C:/Users/Admin/Downloads/expense-tracker/expense-tracker/app/(routes)/dashboard/expenses/_components/AddExpense.jsx";
import ExpenseListTable from "../_components/ExpenseListTable.jsx";

function ExpensesScreen({params}){
    const {user}=useUser();
    const [budgetInfo,setbudgetInfo]=useState();
    const [expensesList,setExpensesList]=useState([]);

    useEffect(()=>{
        user&&getBudgetInfo();
        
    },[user])

    const getBudgetInfo=async()=>{
        const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`SUM(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
                totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
            })
            .from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id,params.id))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id))
            setbudgetInfo(result[0]);
            getExpensesList();
    }

    const getExpensesList=async()=>{
        const result=await db.select().from(Expenses)
        .where(eq(Expenses.budgetId,params.id))
        .orderBy(desc(Expenses.id))
        setExpensesList(result);
        console.log(result)
    }

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold">My Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3, mt-6 gap-5">
                    {budgetInfo?<BudgetItem
                    budget={budgetInfo}
                />:
                <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse">
                </div>}
                <AddExpense budgetId={params.id}
                    user={user}
                    refreshData={()=>getBudgetInfo()}
                />
            </div>
            <div className="mt-4">
                <h2 className="font-bold text-lg">Latest Expenses</h2>
                <ExpenseListTable expensesList={expensesList}
                    refreshData={()=>getBudgetInfo()}
                />
            </div>
        </div>  
    )
}

export default ExpensesScreen