import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/Login.vue";
import Welcome from "../components/Welcome.vue";
import Polls from "../components/Polls.vue";
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
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
