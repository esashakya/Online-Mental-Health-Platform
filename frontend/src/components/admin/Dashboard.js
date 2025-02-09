import React from "react";
import AdminPanel from "./AdminPanel";
import SearchBar from "../user/SearchBar";
import Calculation from "./Calculation";
import DashboardChart from "./DashboardChart";
import AgeChart from "./AgeChart";
export default function Dashboard() {
  return (
    <div>
      <div className="admin d-flex flex-row" style={{ height: "100vh" }}>
        <AdminPanel />
        <div className="dashboardAdmin w-100">
          <SearchBar />
          <div className="d-flex flex-wrap mt-3 justify-content-evenly">
            <Calculation detail="Doctors" />
            <Calculation detail="Users" />
            <Calculation detail="Appoitments" />
          </div>
          <div className="d-flex flex-row flex-sm-col justify-content-center">
            <DashboardChart />
            <AgeChart />
          </div>
        </div>
      </div>
    </div>
  );
}
