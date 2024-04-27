import React from 'react';

function HomeDashboard() {

  return (
    <div className='home-parent-frame'>
      <div className='home'>
        <div className='home-header'>
          <h1>Welcome Admin!</h1>
          <p>Dashboard</p>
        </div>

      <div className='stats-parent'>
        <div className='upper-row-stats'>
          <div className='row-box'>1</div>
          <div className='row-box'>2</div>
          <div className='row-box'>3</div>
          <div className='row-box'>4</div>
        </div>

        <div className='middle-row-graphs'>
          <div className='graph-box'>1</div>
          <div className='graph-box'>2</div>

        </div>

        <div className='lower-row-stats'>
          <div className='low-row-box'>1</div>
          <div className='low-row-box'>2</div>
          <div className='low-row-box'>3</div>
          <div className='low-row-box'>4</div>
        </div>

        <div className='statistic-group'>
          <div className='statistic-chuchu'>1</div>
          <div className='statistic-chuchu'>2</div>
          <div className='statistic-chuchu'>3</div>
          
        </div>
        </div>
        
        {/* 
        <div className='home-table-row'>
          <div className='home-type-employee'>
            <p>Number of Employee</p>
          </div>
          <div className='home-type-roadmap'>
            <p>Roadmap Created</p>
          </div>
        </div>

        
        <div className='home-graph-row'>
          <div className="home-graph-employee">
            <div className="home-graph-card">
              <div className="home-graph-body">

              </div>
            </div>
          </div>
          <div className="home-graph-employee">
            <div className="home-graph-card">
              <div className="home-graph-body">

              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}

export default HomeDashboard;
