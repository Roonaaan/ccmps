import React from 'react';

function HomeDashboard() {

  return (
    <div className='home-parent-frame'>
      <div className='home'>
        <div className='home-header'>
          <h1>Welcome Admin!</h1>
        </div>
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
      </div>
    </div>
  );
}

export default HomeDashboard;
