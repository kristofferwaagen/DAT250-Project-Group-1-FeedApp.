import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/Login.vue";
import Welcome from "../components/Welcome.vue";
import Polls from "../components/Polls.vue";
import Register from "../components/Register.vue";
import { compare } from "bcryptjs";

// Defined routes for the application
const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/home",
    component: Welcome,
  },
  {
    path: "/polls",
    component: Polls,
  },
  {
    path: "/register",
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
