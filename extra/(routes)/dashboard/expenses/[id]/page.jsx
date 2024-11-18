"use client"
import { Trash } from "lucide-react"
import React, { useEffect,useState } from "react"
import { useUser } from "@clerk/nextjs";
import { Budgets,Expenses } from "../../../../utils/schema"
import {db} from "../../../../utils/dbConfig.jsx";
import { desc, eq, getTableColumns,sql } from "drizzle-orm";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "C:/Users/Admin/Downloads/expense-tracker/expense-tracker/app/(routes)/dashboard/expenses/_components/AddExpense.jsx";
import ExpenseListTable from "../_components/ExpenseListTable.jsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "C:/Users/Admin/Downloads/expense-tracker/expense-tracker/@/components/ui/alert-dialog.jsx"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../@/components/ui/button";
import EditBudget from "C:/Users/Admin/Downloads/expense-tracker/expense-tracker/app/(routes)/dashboard/expenses/_components/EditBudget.jsx"


function ExpensesScreen({params}){
    const {user}=useUser();
    const [budgetInfo,setbudgetInfo]=useState([]);
    const [expensesList,setExpensesList]=useState([]);
    const route = useRouter();

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
    
    const deleteBudget=async()=>{

        const deleteExpenseResult=await db.delete(Expenses)
        .where(eq(Expenses.budgetId,params.id))
        .returning()
        if(deleteExpenseResult)
        {
        const result = await db.delete(Budgets)
        .where(eq(Budgets.id,params.id))
        .returning();
        }
        toast('Budget Deleted!');
        route.replace('/dashboard/budgets');

    }

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold flex justify-between items-center">My Expenses
            
            <div className="flex gap-2 items-center">
            <EditBudget budgetInfo={budgetInfo}
                  refreshData={()=>getBudgetInfo()}
            />

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="flex gap-2" variant="destructive">
                    <Trash /> Delete
                    </Button> 
        </AlertDialogTrigger>
        <AlertDialogContent className="fixed inset-0 flex items-center justify-center z-50">
    <div className="fixed inset-0 bg-black bg-opacity-30"></div>

    <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg z-10">
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your current budget
                along with expenses and remove your data from our servers.
            </AlertDialogDescription>
        </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col space-y-4 mt-4">
                <AlertDialogCancel className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={()=>deleteBudget()} className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>


    </div>
</AlertDialogContent>

        </AlertDialog>

</div>


            </h2>
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