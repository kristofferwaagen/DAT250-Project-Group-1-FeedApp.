<script setup>
import { defineProps, defineEmits, reactive } from "vue";

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

function handleSubmit() {
  emit("submit", { ...formData });
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
