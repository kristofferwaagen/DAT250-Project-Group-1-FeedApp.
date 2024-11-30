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
  const userRole = localStorage.getItem("userRole");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next("/"); // Redirect to login if no token is found
    } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      next("/"); // Redirect if the user's role is not authorized
    } else {
      next(); // Authorized
    }
  } else {
    next(); // No auth required
  }
});


export default router;
