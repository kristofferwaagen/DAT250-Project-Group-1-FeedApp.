<script setup>
import { onBeforeMount, onBeforeUpdate, ref } from "vue";
import axios from "axios";

const polls = ref([]);
const question = ref("");
const option1 = ref({ option: "" });
const option2 = ref({ option: "" });
const voteOptions = ref([]);
var allOptions = [];

const addOption = () => {
  voteOptions.value.push({ option: "" });
};

const removeOption = (index) => {
  voteOptions.value.splice(index, 1);
};

const handleSubmit = () => {
  allOptions = [option1.value, option2.value].concat(voteOptions.value);
  console.log("Form submitted:", allOptions);
  createPoll();
};

// sends a POST request to create a new poll
const createPoll = async () => {
  try {
    const publishedAt = new Date();
    const validUntil = new Date().setDate(publishedAt.getDate() + 30);
    const response = await axios.post("api/polls/", {
      question: question.value,
      publishedAt: publishedAt,
      validUntil: validUntil,
      voteOptions: allOptions,
    });
    // appends the lates poll to the list
    polls.value.push(response.data.question);
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
  }
};

// sends a GET request to the server to fetch all polls
const getPolls = async () => {
  try {
    const response = await axios.get("api/polls/");
    polls.value = response.data;
  } catch (error) {}
};

// TODO: implement function to vote on a poll option
const vote = async () => {
  try {
    const response = await axios.get("api/polls/");
    polls.value = response.data;
  } catch (error) {}
}

// ensures the polls are fetched on page load
onBeforeMount(getPolls);
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <input
          type="text"
          v-model="question"
          name="question"
          id="voteQuestion"
          placeholder="Enter question"
        /><br />
        <input
          type="text"
          v-model="option1.option"
          name="option"
          id="voteOpt"
          placeholder="Enter vote option"
        /><br />
        <input
          type="text"
          v-model="option2.option"
          name="option"
          id="voteOpt"
          placeholder="Enter vote option"
        />
      </div>
      <div v-for="(optionObj, index) in voteOptions" :key="index">
        <input
          type="text"
          v-model="optionObj.option"
          name="option"
          id="voteOpt"
          placeholder="Enter vote option"
        />
        <button @click.prevent="removeOption(index)">Remove option</button>
      </div>
      <button @click.prevent="addOption">Add vote option</button><br />
      <button type="submit">Submit</button>
    </form>
    <h1>Polls:</h1>
    <ul>
      <li v-for="(poll, index) in polls" :key="index">
        <h3>{{ poll.question }}</h3>
        <li v-for="(opt, index) in poll.voteOptions">
          {{ opt.option }} -- {{ opt.votes }} <button>Vote</button>
        </li>
      </li>
    </ul>
  </div>
</template>
