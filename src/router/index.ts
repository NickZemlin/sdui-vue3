import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InfoView from "@/views/InfoView.vue";
import SampleViewVue from "@/views/SampleView.vue";
import SecondSampleView from "@/views/SecondSampleView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/infroView",
      name: "infoView",
      component: InfoView,
    },
    {
      path: "/samplePage",
      name: "Sample_Page_1",
      component: SampleViewVue,
    },
    {
      path: "/secondSamplePage",
      name: "Sample_Page_2",
      component: SecondSampleView,
    },
  ],
});

export default router;
