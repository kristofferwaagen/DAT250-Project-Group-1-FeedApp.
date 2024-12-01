import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/Login.vue";
import Dashboard from "@/components/Dashboard.vue";
import Register from "../components/Register.vue";
import { jwtDecode } from "jwt-decode";
window.jwtDecode = jwtDecode;

// Defined routes for the application
const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

//Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");

  if (to.path === "/dashboard") {
    // Allow access to dashboard even without authentication
    next();
  } else if (!token && to.meta.requiresAuth) {
    // Redirect to login if authentication is required
    next("/"); // Redirect unauthenticated users to login
  } else {
    next(); // Allow access for authenticated users
  }
});


export default router;
