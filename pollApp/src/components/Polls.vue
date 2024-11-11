<script setup>
import { onBeforeMount, ref, computed } from "vue";
import axios from "axios";

const polls = ref([]);
const question = ref("");
const option1 = ref({ caption: "" });
const option2 = ref({ caption: "" });
const voteOptions = ref([]);
const counter = ref(0);
var allOptions = [];

// TODO: implement actually secure serverside authentication
const isLoggedIn = computed(() => !!localStorage.getItem("authToken"));

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

// TODO: conditional. Only show create poll if logged in
// sends a POST request to create a new poll
const createPoll = async () => {
  try {
    const publishedAt = new Date();
    const validUntil = new Date();
    validUntil.setDate(publishedAt.getDate() + 30);

    const response = await axios.post("http://localhost:3000/polls/", {
      question: question.value,
      publishedAt,
      validUntil,
      voteOptions: allOptions,
    });
    // appends the lates poll to the list
    polls.value.push(response.data);
    console.log("Poll created: ",response.data);
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
    const response = await axios.get("http://localhost:3000/polls/");
    polls.value = response.data;
    console.log(polls)
  } catch (error) {}
};

// TODO: implement function to vote on a poll option
// TODO: make request dynamic based on logged in user
const vote = async (index, voteOption) => {
  try {
    const response = await axios.post("http://localhost:3000/users/test/votes/", {publishedAt: new Date(), voteOption: voteOption});
    getPolls();
    
  } catch (error) {}
  
}

// ensures the polls are fetched on page load
onBeforeMount(getPolls);
</script>

<template >
  <div id="dashboard">
  <div id="createPoll" v-if="isLoggedIn">
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
  <br/>
  <div id="polls">
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



#dashboard {
  display: grid;
  align-items: center;
}

#createPoll {
  display: flex;
  align-items: center;
  padding-bottom: 10%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

#polls {
  display: flex;
  align-items: center;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin: auto;
  flex: auto;
}

</style>
