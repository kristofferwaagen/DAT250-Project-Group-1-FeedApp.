<!--
this is a reusable form component. It is used both for the login page and
registration page
-->
<script setup>
import { reactive } from "vue";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const formData = reactive({
  username: "",
  email: "",
});

defineProps({
  formType: {
    type: String,
    default: "login", // 'login' or 'register'
    validator: (value) => ["login", "register"].includes(value),
  },
});

const emit = defineEmits(["submit"]);

async function handleSubmit() {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      username: formData.username,
      email: formData.email,
    });

    const token = response.data.token;
    const decodedToken = jwtDecode(token);
    console.log("Token received from login:", token);
    // Store token and role in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", decodedToken.role);
    console.log("Token and role saved. Redirecting to /dashboard...");

    if (decodedToken) {
      window.location.href = "/dashboard"; // Redirect all authenticated users to dashboard
    } else {
      window.location.href = "/"; // Redirect if authentication fails
    }
  } catch (error) {
    console.error("Login failed:", error);
    emit("submit", { success: false });
  }
}
</script>

<template>
  <h2>{{ formType === "login" ? "Login" : "Register" }}</h2>
  <form @submit.prevent="handleSubmit">
    <div class="user">
      <label for="username"> Username:</label><br />
      <input id="username" type="text" v-model="formData.username" />
    </div>
    <div class="user">
      <label for="email"> Email:</label><br />
      <input id="email" type="text" v-model="formData.email" />
    </div>
    <button type="submit">
      {{ formType === "login" ? "Login" : "Register" }}
    </button>
  </form>
</template>

<style scoped>
input {
  width: 100%;
}
form {
  padding-left: 0%;
  padding-top: 10%;
  padding-bottom: 10%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
</style>
