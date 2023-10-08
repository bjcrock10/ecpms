<script setup lang="ts">
import DarkModeSwitcher from "../components/DarkModeSwitcher";
import MainColorSwitcher from "../components/MainColorSwitcher";
import errorIllustration from "../assets/images/error-illustration.svg";
import Button from "../base-components/Button";
import { useRouter } from "vue-router";
import logoUrl from "../assets/images/logo.svg";

const router = useRouter();
</script>

<template>
  <div class="py-2">
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div
        class="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left"
      >
        <div class="-intro-x lg:mr-20">
          <img
            alt="CFIDP Template by Cebudigital"
            class="w-[450px] h-48 lg:h-auto"
            :src="logoUrl"
          />
        </div>
        <div class="mt-10 text-white lg:mt-0">
          <div class="font-medium intro-x text-8xl">404</div>
          <div class="mt-5 text-xl font-medium intro-x lg:text-3xl">
            Oops. This page has gone missing.
          </div>
          <div class="mt-3 text-lg intro-x">
            You may have mistyped the address or the page may have moved.
          </div>
          <Button
            class="px-4 py-3 mt-10 text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200" @click="router.push({path: '/dashboard'})"
          >
            Back to Home
          </Button>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>
