<script setup>
import { onBeforeMount, ref } from "vue";
import axios from "axios";

const polls = ref([]);
const question = ref("");
const option1 = ref({ caption: "" });
const option2 = ref({ caption: "" });
const voteOptions = ref([]);
const counter = ref(0);
var allOptions = [];

const addOption = () => {
  voteOptions.value.push({ caption: "" });
};

const removeOption = (index) => {
  voteOptions.value.splice(index, 1);
};

const handleSubmit = () => {
  allOptions = [option1.value, option2.value].concat(voteOptions.value);
  console.log("Form submitted:", allOptions);
  createPoll();
};

// TODO: conditional. Only show create poll if logged in
// sends a POST request to create a new poll
const createPoll = async () => {
  try {
    const publishedAt = new Date();
    const validUntil = new Date().setDate(publishedAt.getDate() + 30);
    const response = await axios.post("api/polls/", {
      question: question.value,
      publishedAt: '2024-10-31T14:33:03.153Z',
      validUntil: '2024-10-31T14:33:03.153Z',
      voteOptions: allOptions,
    });
    // appends the lates poll to the list
    polls.value.push(response.data.question);
    console.log("response data: ",response.data);
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
// TODO: make request dynamic based on logged in user
const vote = async (index, voteOption) => {
  try {
    const response = await axios.post("api/users/test/votes/", {publishedAt: new Date(), voteOption: voteOption});
    getPolls();
    
  } catch (error) {}
  
}

// ensures the polls are fetched on page load
onBeforeMount(getPolls);
</script>

<template>
  <div id="polls">
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
    <div id="dashboard">
    <h1>Polls:</h1>
    <ul>
      <li v-for="(poll, index) in polls" :key="index">
        <h3>{{ poll.question }}</h3>
        <li v-for="(opt, optIndex) in poll.voteOptions" :key="optIndex">
          {{ opt.caption }} -- {{ opt.presentationOrder }} <button @click.prevent="vote(index, opt)">Vote</button>
        </li>
      </li>
    </ul>
  </div>
  </div>
</template>

<style scoped>

#polls {
  padding: 10%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

#dashboard {
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin: auto;
  flex: auto;
  align-content: center;
}

</style>
