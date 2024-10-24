<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "@/router";
const input = ref({ username: "", email: "" });
const output = ref("");

// sends a POST request to the backend to create a new user
const createUser = async () => {
  let newUser = { username: "test", email: "test@mail.com" };
  try {
    const response = await axios.get("/api/users/", newUser);

    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
  }
};

const login = async () => {
  if (input.value.username != "" && input.value.email != "") {
    try {
      const response = await axios.post("api/users/login", {
        username: input.value.username,
        email: input.value.email,
      });
      if (response.status === 200) {
        router.push("/home");
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      }
    }
  } else {
    output.value = "Username and email can not be empty";
  }
};
</script>

<template>
  <button class="btn" type="button" @click.prevent="createUser">
    Create Test User
  </button>

  <form name="Login">
    <div class="user">
      <label for="username"> Username</label>
      <input id="username" type="text" v-model="input.username" />
    </div>
    <div class="user">
      <label for="email"> Email</label>
      <input id="email" type="text" v-model="input.email" />
    </div>
    <button class="btn" type="submit" @click.prevent="login">Login</button>

    <p>Output: {{ output }}</p>
  </form>
</template>
