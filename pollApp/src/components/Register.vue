<script setup>
import { reactive } from "vue";
import axios from "axios";
import router from "../router";
import LoginForm from "./LoginForm.vue";

const formData = reactive({
  username: "",
  email: "",
  role: "user", // Default role
});

// Function to register a new user
async function createUser(formData) {
  let newUser = {
    username: formData.username,
    email: formData.email,
    role: formData.role || "user",
  };

  try {
    const response = await axios.post("http://localhost:3000/auth/register", newUser);

    if (response.status === 201) {
      console.log("User registered successfully:", response.data);
      router.push("/"); // Redirect to login page after registration
    }
  } catch (error) {
    if (error.response) {
      console.error("Error registering user:", error.response.data);
    } else {
      console.error("Error registering user:", error);
    }
    alert("Error registering user. Please try again.");
  }
}
</script>

<template>
  <div id="registration">
    <LoginForm formType="register" @submit="createUser"></LoginForm>
  </div>
</template>

<style scoped>
#registration {
  padding: 10%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

input {
  width: 100%;
}
</style>

