<script setup lang="ts">
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/logo.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useRouter } from "vue-router";
import UserDataService from '../../services/UserDataService';
import ResponseData from "../../types/response.d";
import Lucide from "../../base-components/Lucide";
import { ref, reactive, onMounted, watch, provide} from 'vue';
import Notification from "../../base-components/Notification";
import { useUser } from '../../types/user.d';

const {formUsers, errorMessage, isError} = useUser();
const successNotification = ref();
provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
});
const userInfo = ref([])
const router = useRouter();
const message = ref<String>("Save!");
const messageDetail = ref<String>("Successfully Save.");
const onSubmit = async () => {
  UserDataService
  .logIn(formUsers.username,formUsers.password)
  .then(
    (response: ResponseData) => {
      sessionStorage.setItem('userId',response.data[0].id)
      sessionStorage.setItem('name',response.data[0].lname + ", "+response.data[0].fname)
      sessionStorage.setItem('jobs',response.data[0].jobs)
      sessionStorage.setItem('office',response.data[0].office)
      sessionStorage.setItem('province',response.data[0].province)
      sessionStorage.setItem('division',response.data[0].division)
      sessionStorage.setItem('privileges',response.data[0].privileges)
      sessionStorage.setItem('recStat',response.data[0].recStat)
      if(response.data[0].recStat===1){
        message.value = "Pending Approval"
        messageDetail.value = "Your Account is still pending status."
        successNotification.value.showToast();
        errorMessage.value = ""
      }
      else{
        message.value = "Successfully Log.in"
        messageDetail.value = "Please wait we will redirect you to the landing page."
        successNotification.value.showToast();
        errorMessage.value = ""
        setTimeout(function () {
            router.push({path: '/dashboard'})
        }, 100);
      }
    })
    .catch((e: Error) => {
      isError.value = true
      errorMessage.value = "Credentials not found in our record."
      console.log(e);
    });
  }
  onMounted(() => {
    if(sessionStorage.getItem('userId') !== null){
      router.push({ path:'/dashboard'})
    }
  });
</script>

<template>
  <div
    :class="[
      '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
      'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]"
  >
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <!-- BEGIN: Notification Content -->
    <Notification refKey="successNotification" :options="{
      duration: 3000,
      }" class="flex bg-slate-200">
      <Lucide icon="CheckCircle" class="block mx-auto" />
    <div class="ml-4 mr-4">
      <div class="font-medium">
        {{message}}
      </div>
      <div class="text-slate-500 mt-1">
        {{ messageDetail }}
      </div>
    </div>
    </Notification>
    <!-- END: Notification Content -->
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <div class="my-auto">
            <img
              alt="ECPMS Template"
              class="w-64 -mt-16 -intro-y ml-16"
              :src="illustrationUrl"
            />
            <div
              class="mt-10 text-4xl font-medium leading-tight text-white -intro-x"
            >
              E-Client Profiling & Monitoring <br />
              System - Region 7 version 1.0
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
          
            >
            <h2
              class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left"
            >
              Sign In
            </h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
              <img
                  alt="CFIPD Template"
                  class="w-10 -mt-16 -intro-y"
                  :src="illustrationUrl"
                />
              ECPM <br />
              System
            </div>
          <form class="validate-form" @submit.prevent="onSubmit">
            <div class="intro-x mt-2 text-slate-400 text-center" v-if="isError===true">
              <span class="text-red-600">{{ errorMessage }}
                </span>
            </div>
            <div class="mt-8 intro-x">
              <FormInput
                type="text"
                class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Email"
                v-model="formUsers.username"
              />
              <FormInput
                type="password"
                class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Password"
                v-model="formUsers.password"
              />
            </div>
            <div
              class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm"
            >
              <div class="flex items-center mr-auto">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  class="mr-2 border"
                />
                <label class="cursor-pointer select-none" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <a href="">Forgot Password?</a>
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button
                variant="primary"
                class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                type="submit"
              >
                Login
              </Button>
              <Button
                variant="outline-secondary"
                class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                @click="router.push({name: 'register'})"
              >
                Register
              </Button>
            </div>
          </form>
            <div
              class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left"
            >
              By signin up, you agree to our
              <a class="text-primary dark:text-slate-200" href="">
                Terms and Conditions
              </a>
              &
              <a class="text-primary dark:text-slate-200" href="">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
