<!--
this is a reusable form component. It is used both for the login page and
registration page
-->
<script setup>
import { reactive } from "vue";
import axios from "axios";

const formData = reactive({
  username: "",
  email: "",
});

const props =defineProps({
  formType: {
    type: String,
    required: true,
    validator: (value) => ["login", "register"].includes(value),
  },
});

const emit = defineEmits(["submit"]);

async function handleSubmit() {
  try {
    if (props.formType === "login") {
      // Login logic
      emit("submit", formData);
    } else if (props.formType === "register") {
      // Registration logic
      emit("submit", formData);
    }
  } catch (error) {
    console.error(`${props.formType} failed:`, error);
    alert(`${props.formType === "login" ? "Login" : "Registration"} failed. Please try again.`);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="username">Username:</label>
      <input id="username" type="text" v-model="formData.username" />
    </div>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="text" v-model="formData.email" />
    </div>
    <button type="submit">{{ props.formType === "login" ? "Login" : "Register" }}</button>
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
