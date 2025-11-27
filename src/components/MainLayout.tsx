import { Outlet } from "react-router-dom";
import Header from "./Header";
import NetworkStatusBanner from "./NetworkStatusBanner";
import { useEffect } from "react";

function MainLayout() {
  useEffect(() => {
    console.log('[DEBUG] MainLayout mounted');
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <NetworkStatusBanner />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
