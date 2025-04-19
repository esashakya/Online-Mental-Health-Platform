import React from "react";
import AdminPanel from "./AdminPanel";

import Calculation from "./Calculation";
import DashboardChart from "./DashboardChart";
import AgeChart from "./AgeChart";
import TopForumPostsChart from "./TopForumPostsChart";


export default function Dashboard() {
  return (
    <div>
       <div className="dashboard-header text-center mb-4">
        <h2 className="display-5 fw-bold text-primary mb-3">
          <span >
           
            Dashboard Overview
          </span>
        </h2>
        <p className="text-muted">
          Overview of the whole Untangle Chaos system
        </p>
        <div className="header-divider mx-auto"></div>
      </div>
      <div className="admin d-flex flex-col " style={{ height: "100%" }}>
       
        <div className="dashboardAdmin w-100">
        
          <div className="d-flex flex-wrap mt-3 justify-content-evenly">
            <Calculation detail="Doctors" />
            <Calculation detail="Users" />
            <Calculation detail="Appointments" />
          </div>
          <div className="m-3">
            <div className="w-100 ">
            <DashboardChart />
            </div>
           
            <div className="d-flex flex-md-row flex-column  ">
              <div className="col-md-6 shadow rounded m-1">
              <AgeChart />
              </div>
              <div className="col-md-6 shadow rounded m-1">
            <TopForumPostsChart/>
            </div>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
}
