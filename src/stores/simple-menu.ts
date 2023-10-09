import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SimpleMenuState {
  menu: Array<Menu | "divider">;
}

export const useSimpleMenuStore = defineStore("simpleMenu", {
  state: (): SimpleMenuState => ({
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
        icon: "Activity",
        pageName: "side-menu-to",
        title: "Travel Order",
      },
      { 
        icon: "Activity",
        pageName: "side-menu-reports",
        title: "Report",
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
