import React from "react";
import AdminPanel from "./AdminPanel";
import SearchBar from "../user/SearchBar";
import Calculation from "./Calculation";
import DashboardChart from "./DashboardChart";
import AgeChart from "./AgeChart";


export default function Dashboard() {
  return (
    <div>
      <div className="admin d-flex flex-col " style={{ height: "100%" }}>
        
        <div className="dashboardAdmin w-100">
          <SearchBar />
          <div className="d-flex flex-wrap mt-3 justify-content-evenly">
            <Calculation detail="Doctors" />
            <Calculation detail="Users" />
            <Calculation detail="Forum" />
          </div>
          <div className="charts d-flex flex-col flex-lg-row flex-wrap justify-content-center m-3">
            <DashboardChart />
            <AgeChart />
          </div>
        </div>
        
        
      </div>
    </div>
  );
}
