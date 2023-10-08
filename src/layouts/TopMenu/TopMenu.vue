<script setup lang="ts">
import { useRoute } from "vue-router";
import MenuLink from "./MenuLink.vue";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import TopBar from "../../components/TopBar";
import MobileMenu from "../../components/MobileMenu";
import _ from "lodash";
import { useTopMenuStore } from "../../stores/top-menu";
import {
  ProvideForceActiveMenu,
  forceActiveMenu,
  Route,
  FormattedMenu,
  nestedMenu,
} from "./top-menu";
import { watch, reactive, computed, onMounted, provide } from "vue";

const route: Route = useRoute();
let formattedMenu = reactive<Array<FormattedMenu>>([]);
const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu>) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const topMenuStore = useTopMenuStore();
const topMenu = computed(() => nestedMenu(topMenuStore.menu, route));

provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
  forceActiveMenu(route, pageName);
  setFormattedMenu(topMenu.value);
});

watch(topMenu, () => {
  setFormattedMenu(topMenu.value);
});

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu;
  }
);

onMounted(() => {
  setFormattedMenu(topMenu.value);
});
</script>

<template>
  <div
    class="pt-2 pb-7 before:content-[''] before:absolute before:inset-0 before:bg-fixed before:bg-no-repeat before:bg-skew-pattern dark:before:bg-skew-pattern-dark"
  >
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <MobileMenu />
    <TopBar />
    <!-- BEGIN: Top Menu -->
    <nav
      :class="[
        'hidden md:block xl:pt-[12px] z-50 relative xl:px-6 -mt-2 xl:-mt-[3px]',

        // Animation
        'animate-[0.4s_ease-in-out_0.3s_intro-top-menu] animate-fill-mode-forwards opacity-0 translate-y-[35px]',
      ]"
    >
      <ul class="h-[50px] flex flex-wrap">
        <li
          v-for="(menu, menuKey) in formattedMenu"
          :class="[
            'relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:rotate-180',
            !menu.active &&
              '[&:hover>a]:bg-primary/60 [&:hover>a]:dark:bg-transparent',
            !menu.active &&
              '[&:hover>a]:before:content-[\'\'] [&:hover>a]:before:block [&:hover>a]:before:inset-0 [&:hover>a]:before:bg-white/[0.04] [&:hover>a]:xl:before:bg-white/10 [&:hover>a]:before:rounded-full [&:hover>a]:xl:before:rounded-lg [&:hover>a]:before:absolute [&:hover>a]:before:z-[-1] [&:hover>a]:before:dark:bg-darkmode-700',
          ]"
          :key="menuKey"
        >
          <MenuLink
            :class="{
              [`opacity-0 translate-y-[50px] animate-[0.4s_ease-in-out_0.3s_intro-menu] animate-fill-mode-forwards animate-delay-${
                (menuKey + 1) * 10
              }`]: !menu.active,
            }"
            :menu="menu"
            level="first"
          ></MenuLink>
          <!-- BEGIN: Second Child -->
          <ul
            v-if="menu.subMenu"
            :class="[
              'shadow-[0px_3px_20px_#0000000b] bg-primary hidden w-56 absolute rounded-md z-20 px-0 mt-1 dark:bg-darkmode-600 dark:shadow-[0px_3px_7px_#0000001c]',
              'before:block before:absolute before:w-full before:h-full before:bg-white/[0.04] before:inset-0 before:rounded-md before:z-[-1] dark:before:bg-black/10',
              'after:w-full after:h-1 after:absolute after:top-0 after:left-0 after:-mt-1 after:cursor-pointer',
            ]"
          >
            <li
              v-for="(subMenu, subMenuKey) in menu.subMenu"
              class="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90"
              :key="subMenuKey"
            >
              <MenuLink :menu="subMenu" level="second"></MenuLink>
              <!-- BEGIN: Third Child -->
              <ul
                v-if="subMenu.subMenu"
                :class="[
                  'shadow-[0px_3px_20px_#0000000b] left-[100%] bg-primary hidden rounded-md mt-0 ml-0 top-0 w-56 absolute z-20 px-0 dark:bg-darkmode-600 dark:shadow-[0px_3px_7px_#0000001c]',
                  'before:block before:absolute before:w-full before:h-full before:bg-white/[0.04] before:inset-0 before:rounded-md before:z-[-1] dark:before:bg-black/10',
                ]"
              >
                <li
                  v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                  class="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90"
                  :key="lastSubMenuKey"
                >
                  <MenuLink :menu="lastSubMenu" level="third"></MenuLink>
                </li>
              </ul>
              <!-- END: Third Child -->
            </li>
          </ul>
          <!-- END: Second Child -->
        </li>
      </ul>
    </nav>
    <!-- END: Top Menu -->
    <!-- BEGIN: Content -->
    <div
      :class="[
        'relative',
        'before:content-[\'\'] before:w-[95%] before:z-[-1] before:rounded-[1.3rem] before:bg-transparent xl:before:bg-white/10 before:h-full before:-mt-4 before:absolute before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/50',

        // Animation
        'before:translate-y-[35px] before:opacity-0 before:animate-[0.4s_ease-in-out_0.1s_intro-wrapper] before:animate-fill-mode-forwards',
      ]"
    >
      <div
        :class="[
          'translate-y-0 bg-transparent xl:bg-primary flex rounded-[1.3rem] md:pt-[80px] -mt-[7px] md:-mt-[67px] xl:-mt-[62px] dark:bg-transparent xl:dark:bg-darkmode-400',
          'before:hidden xl:before:block before:absolute before:inset-0 before:bg-black/[0.15] before:rounded-[1.3rem] before:z-[-1]',

          // Animation
          'animate-[0.4s_ease-in-out_0.2s_intro-wrapper] animate-fill-mode-forwards translate-y-[35px]',
        ]"
      >
        <!-- BEGIN: Content -->
        <div
          class="px-4 md:px-[22px] max-w-full md:max-w-auto rounded-[1.3rem] flex-1 min-w-0 min-h-screen pb-10 shadow-sm bg-slate-100 dark:bg-darkmode-700 before:content-[''] before:w-full before:h-px before:block"
        >
          <RouterView />
        </div>
        <!-- END: Content -->
      </div>
    </div>
    <!-- END: Content -->
  </div>
</template>
