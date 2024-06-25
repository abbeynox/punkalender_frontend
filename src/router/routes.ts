import { createWebHistory, createRouter } from "vue-router";
import Home from "@/pages/HomePage.vue";
import CreateEvent from "@/pages/CreateEventPage.vue";
import CreateBand from "@/pages/CreateBandPage.vue";
import EventDetailPage from "@/pages/EventPage.vue";
import About from "@/pages/AboutPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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
  },
  {
    path: "/create/band",
    name: "Neue Band",
    component: CreateBand,
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
  next();
});

export default router;
