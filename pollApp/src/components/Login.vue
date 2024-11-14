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
        localStorage.setItem("authToken", response.data._id);
        router.push("/dashboard");
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

//TODO: anon authentication
const loginAnon = () => {
  localStorage.removeItem("authToken");
  router.push("/dashboard");
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
  </form>
  <br />
  <button class="btn" @click.prevent="loginAnon">
    Continue without an account
  </button>
</template>

<style scoped>
form {
  padding-left: 0%;
  padding-top: 10%;
  padding-bottom: 10%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.btn {
  text-wrap: wrap;
  width: max-content;
}

input {
  width: 100%;
}
</style>
