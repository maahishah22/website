"use client"
import React, { useEffect } from 'react'; 
import SideNav from './_components/SideNav.jsx'
import DashBoardHeader from './_components/dashBoardHeader.jsx'
import {useUser} from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';

function DashboardLayout({ children }) {

    const { user } = useUser(); 
    const router = useRouter();
    useEffect(() => {
        if (user) {
            checkUserBudgets();
        }
    }, [user]);

    const checkUserBudgets = async () => {
        const result = await db.select()
            .from(Budgets)
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

        console.log(result);
        if(result?.length==0)
        {
            router.replace('/dahsboard/budgets')
        }

    }

    return (
        <div>
            <div className='fixed md:w-64 hidden md:block'>
                <SideNav />
            </div>
            <div className='md:ml-64'>
                <DashBoardHeader />
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;
