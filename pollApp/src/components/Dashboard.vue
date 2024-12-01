<script setup>
import { onBeforeMount, ref, computed } from "vue";
import axios from "axios";

const polls = ref([]);
const question = ref("");
const option1 = ref({ caption: "" });
const option2 = ref({ caption: "" });
const voteOptions = ref([]);
var allOptions = [];

// TODO: implement actually secure serverside authentication
const isLoggedIn = computed(() => !!localStorage.getItem("authToken"));

const getUser = async () => {
  const username = localStorage.getItem("authToken");
  const response = await axios.get("/api/users/" + username);
  console.log(response);
  return response;
};

const addOption = () => {
  voteOptions.value.push({ caption: "" });
};

const removeOption = (index) => {
  voteOptions.value.splice(index, 1);
};

const handleSubmit = () => {
  console.log("Form submitted");
  allOptions = [option1.value, option2.value].concat(voteOptions.value);
  console.log("Form submitted:", allOptions);
  createPoll();
};

// sends a POST request to create a new poll
const createPoll = async () => {
  try {
    const publishedAt = new Date();
    const validUntil = new Date();
    validUntil.setDate(publishedAt.getDate() + 30);

    const response = await axios.post("/api/polls/", {
      question: question.value,
      publishedAt,
      validUntil,
      voteOptions: allOptions,
    });
    // appends the lates poll to the list
    polls.value.push(response.data);
    console.log("Poll created: ", response.data);
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
    const response = await axios.get("/api/polls/");
    polls.value = response.data;
    console.log(polls);
  } catch (error) {}
};

// TODO: implement function to vote on a poll option
// TODO: make request dynamic based on logged in user
const vote = async (voteOptionId) => {
  try {
    const username = localStorage.getItem("authToken");
    const voteRes = await axios.post("/api/votes/" + username, {
      voteOptionId: voteOptionId,
    });
    const countRes = await axios.post("/api/polls/" + voteOptionId);
    getPolls();
  } catch (error) {}
};

// ensures the polls are fetched on page load
onBeforeMount(getPolls);
</script>

<template>
  <div class="dashboard">
    <div class="createPoll" v-if="isLoggedIn">
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
            v-model="option1.caption"
            name="option"
            id="voteOpt"
            placeholder="Enter vote option"
          /><br />
          <input
            type="text"
            v-model="option2.caption"
            name="option"
            id="voteOpt"
            placeholder="Enter vote option"
          />
        </div>
        <div v-for="(optionObj, index) in voteOptions" :key="index">
          <input
            type="text"
            v-model="optionObj.caption"
            name="option"
            id="voteOpt"
            placeholder="Enter vote option"
          />
          - <button @click.prevent="removeOption(index)">Remove option</button>
        </div>
        <button @click.prevent="addOption">Add vote option</button><br />
        <button type="submit">Submit</button>
      </form>
    </div>
    <br />
    <div class="polls">
      <h1>Polls:</h1>
      <br />
      <div class="poll" v-for="(poll, index) in polls" :key="index">
        <h3 class="pollTitle">{{ poll.question }}</h3>
        <br />
        <div v-for="(opt, optIndex) in poll.voteOptions" :key="optIndex">
          {{ opt.caption }} -- {{ opt.voteCount }}
          <button class="voteBtn" @click="vote(opt._id)">Vote</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  width: 500px;
}

.createPoll {
  display: flex;
  align-items: center;
  padding-bottom: 10%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.polls {
  display: grid;
  width: 100%;
}

.poll {
  display: grid;
  border: 2px solid aliceblue;
  border-radius: 4px;
  grid-template-columns: 100%;
  align-items: center;
  padding: 5%;
}

.pollTitle {
  text-decoration: underline;
  font-weight: bold;
}

.voteBtn {
  margin: auto;
}
</style>
