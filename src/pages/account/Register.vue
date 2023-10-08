<script setup lang="ts">
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../assets/images/logo.png";
import illustrationUrl from "../../assets/images/illustration.png";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useRouter } from "vue-router";
import { useUser } from '../../types/user.d';
import UserDataService from '../../services/UserDataService';
import ResponseData from "../../types/response.d";
import { ref, reactive, onMounted, watch, provide} from 'vue';
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import Toastify from "toastify-js";

const {formUsers, errorMessage, isError} = useUser();
const router = useRouter();

const confirmPassword = ref<String>();
const password = ref();
const isDisable = ref(false);

const message = ref<String>("Save!");
const messageDetail = ref<String>("Successfully Save.");

const isPass1 = ref(false);
const isPass2 = ref(false);
const isPass3 = ref(false);
const onSubmit = async () =>{
  isDisable.value = true
  formUsers.username = formUsers.email
  formUsers.password = password.value
  UserDataService
    .create(formUsers)
    .then(
      (response: ResponseData) => {
        formUsers.id = response.data.id;
        successNotification.value.showToast();
        setTimeout(function () {
          message.value = "For approval"
          messageDetail.value = "Please wait until admin will activate your account. Thanks"
          router.push({name: 'logIn'})
      }, 2000);
    })
    .catch((e: Error) => {
      console.log(e);
    });
}
const successNotification = ref();
// Watch Ref Variable
watch(confirmPassword, (confirmPassword, adas) => {
    if(confirmPassword === password.value){
      isDisable.value = false
      isError.value = false
    }
    else{
      isDisable.value = true
      isError.value = true
      errorMessage.value = "Password not matched...."
    }
  })

  watch(password, (password, adas) => {
    if(password.length >= 4){
      isDisable.value = false
      isError.value = false
      isPass1.value = true
      isPass2.value = false
      isPass3.value = false
      if(password.length >= 6){
        isPass2.value = true
        isPass3.value = false
        if(password.length >= 8){
          isPass3.value = true
        }
      }
    }
    else{
      isDisable.value = true
      isPass1.value = false
      isPass2.value = false
      isPass3.value = false
    }
  })
// end watch section
provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
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
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Register Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <!-- <a href="" class="flex items-center pt-5 -intro-x">
            <img
              alt="CFIPD Template"
              class="w-6"
              :src="logoUrl"
            />
            <span class="ml-3 text-lg text-white"> CFIPD </span>
          </a> -->
          <div class="my-auto">
            <img
              alt="CFIPD Template"
              class="w-64 -mt-16 -intro-y ml-16"
              :src="illustrationUrl"
            />
            <div
              class="mt-10 text-4xl font-medium leading-tight text-white -intro-x"
            >
              Coconut Farmers & Industry <br />
              Development Plan
            </div>
            <!-- <div
              class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400"
            >
              Manage all your e-commerce accounts in one place
            </div> -->
          </div>
        </div>
        <!-- END: Register Info -->
        <!-- BEGIN: Register Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2
              class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left"
            >
              Sign Up
            </h2>
            <form class="validate-form" @submit.prevent="onSubmit">
              <div
                class="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden"
              >
                  <img
                      alt="CFIPD Template"
                      class="w-10 -mt-16 -intro-y"
                      :src="illustrationUrl"
                    />
                  Coconut Farmers & Industry <br />
                  Development Plan
              </div>
              <div class="mt-8 intro-x">
                <FormInput
                  type="text"
                  class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="First Name"
                  v-model="formUsers.fname"
                  required
                />
                <FormInput
                  type="text"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Last Name"
                  v-model="formUsers.lname"
                  required
                />
                <FormInput
                  type="email"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Email"
                  v-model="formUsers.email"
                  required
                />
                <FormInput
                  type="password"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Password"
                  v-model="password"
                  required
                />
                <div class="grid w-full h-1 grid-cols-12 gap-4 mt-3 intro-x">
                  <div class="h-full col-span-3 rounded bg-success" v-if="isPass1===true"></div>
                  <div class="h-full col-span-3 rounded bg-success" v-if="isPass2===true"></div>
                  <div class="h-full col-span-3 rounded bg-success" v-if="isPass3===true"></div>
                  <div
                    class="h-full col-span-3 rounded bg-slate-100 dark:bg-darkmode-800" v-if="isPass3===true"
                  ></div>
                </div>
                <a
                  href=""
                  class="block mt-2 text-xs intro-x text-slate-500 sm:text-sm"
                >
                  What is a secure password?
                </a>
                <FormInput
                  type="password"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Password Confirmation"
                  v-model="confirmPassword"
                />
                <div class="intro-x mt-2 text-slate-400 text-center" v-if="isError===true">
                  <span class="text-red-600">{{ errorMessage }}
                    </span>
                </div>
              </div>
              <div
                class="flex items-center mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm"
              >
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  class="mr-2 border"
                />
                <label class="cursor-pointer select-none" htmlFor="remember-me">
                  I agree to the CFIDP
                </label>
                <a class="ml-1 text-primary dark:text-slate-200" href="">
                  Privacy Policy
                </a>
                .
              </div>
              <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                <Button
                  type="submit"
                  variant="primary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                  :disabled="isDisable"
                >
                  Register
                </Button>
                <Button
                  variant="outline-secondary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                  @click="router.push({name: 'logIn'})"
                >
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </div>
        <!-- END: Register Form -->
      </div>
    </div>
  </div>
</template>
