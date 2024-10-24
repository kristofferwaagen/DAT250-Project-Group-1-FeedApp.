<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "../router";

const username = ref("");
const email = ref("");

// sends a POST request to the backend to create a new user
const createUser = async () => {
  let newUser = { username: username.value, email: email.value };
  try {
    const response = await axios.post("/api/users/", newUser);
    if (response.status === 201) {
      console.log(response.data);
      router.push("/");
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
  }
};
</script>

<template>
  Register account
  <form name="register" @submit.prevent="createUser">
    <div class="user">
      <label for="username"> Username</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div class="user">
      <label for="email"> Email</label>
      <input id="email" type="text" v-model="email" />
    </div>
    <button class="btn" type="submit">Register</button>
  </form>
</template>
