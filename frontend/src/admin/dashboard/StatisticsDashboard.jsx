import React from 'react';

function StatisticsDashboard() {

    return (
        <div className='statistic-parent-frame'>
            <div className='stats'>
                <div className='stat-header'>
                    <h1>Welcome Back</h1>
                </div>
                <div className='stat-table'>
                    <div className='stat-type'>
                        <p>Number of Employee</p>
                    </div>
                    <div className='stat-type'>
                        <p>Roadmap Created</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatisticsDashboard;