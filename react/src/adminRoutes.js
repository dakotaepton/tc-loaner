import Dashboard from "./views/Dashboard";
import Loans from "./views/Loans";

const adminRoutes = [
  {
    path: "/home",
    name: "Home",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/loans",
    name: "Loans",
    component: Loans,
    layout: "/admin"
  },
];

export default adminRoutes;
