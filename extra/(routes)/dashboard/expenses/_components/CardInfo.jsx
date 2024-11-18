import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function CardInfo({ budgetList }) {
    const [totalbudget, settotalbudget] = useState();
    const [totalSpend, settotalSpend] = useState();

    useEffect(() => {
        if (budgetList) {
            CalculateCardInfo();
        }
    }, [budgetList]);

    const CalculateCardInfo = () => {
        let totalBudget_ = 0;
        let totalSpend_ = 0;
        budgetList.forEach((element) => {
            totalBudget_ += Number(element.amount);
            totalSpend_ += element.totalSpend;
        });
        settotalbudget(totalBudget_);
        settotalSpend(totalSpend_);
    };

    return (
        <div>
            {budgetList?.length > 0 ? (
                // Actual Data
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <div className='p-7 border rounded-lg bg-gradient-to-r from-blue-200 to-green-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm text-gray-700'>Total Budget</h2>
                            <h2 className='font-semibold text-xl text-gray-900'>{totalbudget ? `₹${totalbudget}` : '--'}</h2>
                        </div>
                        <PiggyBank className='bg-white p-4 h-14 w-14 rounded-full text-blue-700 shadow-lg hover:text-white transition-colors duration-300' />
                    </div>

                    <div className='p-7 border rounded-lg bg-gradient-to-r from-teal-200 to-green-400 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm text-gray-700'>Total Spend</h2>
                            <h2 className='font-semibold text-xl text-gray-900'>{totalSpend ? `₹${totalSpend}` : '--'}</h2>
                        </div>
                        <ReceiptText className='bg-white p-4 h-14 w-14 rounded-full text-teal-700 shadow-lg hover:text-white transition-colors duration-300' />
                    </div>

                    <div className='p-7 border rounded-lg bg-gradient-to-r from-yellow-200 to-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm text-gray-700'>Number of Budgets</h2>
                            <h2 className='font-semibold text-xl text-gray-900'>{budgetList?.length}</h2>
                        </div>
                        <Wallet className='bg-white p-4 h-14 w-14 rounded-full text-yellow-700 shadow-lg hover:text-white transition-colors duration-300' />
                    </div>
                </div>
            ) : (
                // Skeleton Loaders
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[1, 2, 3].map((item, index) => (
                        <div
                            key={index}
                            className='h-[160px] w-full bg-slate-200 animate-pulse rounded-lg shadow-lg'
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CardInfo;