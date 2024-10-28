<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "@/router";
const username = ref("");
const email = ref("");
const output = ref("");

const goToRegister = () => {
  router.push("/register");
};

const login = async () => {
  if (username.value != "" && email.value != "") {
    try {
      const response = await axios.get(`api/users/${username.value}`);
      if (response.status === 200) {
        console.log("Authenticated");
        router.push("/polls");
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        output.value = "Username or email is incorrect";
      }
    }
  } else {
    output.value = "Username and email can not be empty";
  }
};
</script>

<template>
  Don't have an account?
  <button class="btn" type="button" @click="goToRegister">
    Register account
  </button>

  <form name="Login" @submit.prevent="login">
    <div class="user">
      <label for="username"> Username:</label><br />
      <input id="username" type="text" v-model="username" />
    </div>
    <div class="user">
      <label for="email"> Email:</label><br />
      <input id="email" type="text" v-model="email" />
    </div>
    <button class="btn" type="submit">Login</button>

    <p v-if="output != ''">{{ output }}</p>
  </form>
</template>

<style scoped>
form {
  padding: 10%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

input {
  width: 100%;
}
</style>
