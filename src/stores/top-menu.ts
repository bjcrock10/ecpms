import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface TopMenuState {
  menu: Array<Menu>;
}

export const useTopMenuStore = defineStore("topMenu", {
  state: (): TopMenuState => ({
    menu: [
      { 
        icon: "Home",
        pageName: "side-menu-page-1",
        title: "Dashboard",
      },
      { 
        icon: "User",
        pageName: "side-menu-clients",
        title: "Client",
      },
      {
        icon: "Github",
        pageName: "side-menu-page-2",
        title: "Administrator",
        subMenu:[
          {
            icon: "User",
            pageName: "side-menu-users",
            title: "Users",
          },
        ]
      },
    ],
  }),
});
