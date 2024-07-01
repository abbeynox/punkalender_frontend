// routes.ts
import { createWebHistory, createRouter } from "vue-router";
import Home from "@/pages/HomePage.vue";
import Login from "@/pages/LoginPage.vue";
import CreateEvent from "@/pages/CreateEventPage.vue";
import CreateBand from "@/pages/CreateBandPage.vue";
import EventDetailPage from "@/pages/EventPage.vue";
import About from "@/pages/AboutPage.vue";
import { useAuthStore } from '~/stores/auth';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/about",
    name: "Über uns",
    component: About,
  },
  {
    path: "/create/event",
    name: "Neues Event",
    component: CreateEvent,
    meta: { requiresAuth: true },
  },
  {
    path: "/create/band",
    name: "Neue Band",
    component: CreateBand,
    meta: { requiresAuth: true },
  },
  {
    path: "/event/:id",
    name: "EventDetail",
    component: EventDetailPage,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: { name: "Home" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = String(to.name) + " | " + "Punkalender";
  const loggedIn = localStorage.getItem("jwt");
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
