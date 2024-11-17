<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const polls = ref([]);
const question = ref("");
const voteOptions = ref([{ caption: "" }, { caption: "" }]);

/*
Yet to be implemented, commented out to test the other functionalities in the program

// TODO: implement actually secure serverside authentication
const isLoggedIn = computed(() => !!localStorage.getItem("authToken"));

const getUser = async () => {
  const username = localStorage.getItem("authToken");
  const response = await axios.get("http://localhost:3000/users/" + username);
  console.log(response);
  return response;
};
*/

const addOption = () => {
  voteOptions.value.push({ caption: "" });
};

const removeOption = (index) => {
  voteOptions.value.splice(index, 1);
};

const createPoll = async () => {
  try {
    const publishedAt = new Date();
    const validUntil = new Date();
    validUntil.setDate(publishedAt.getDate() + 30);

    await axios.post("http://localhost:3000/polls", {
      question: question.value,
      publishedAt,
      validUntil,
      voteOptions: voteOptions.value,
    });

    // Immediately refresh the poll list
    fetchPolls();

    // Reset form
    question.value = "";
    voteOptions.value = [{ caption: "" }, { caption: "" }];
  } catch (error) {
    console.error("Error creating poll:", error);
  }
};

const vote = async (voteOptionId) => {
  try {
    await axios.post(`http://localhost:3000/polls/vote/${voteOptionId}`);
    fetchPolls();
  } catch (error) {
    console.error("Error voting:", error);
  }
};

const clearDatabase = async () => {
  try {
    await axios.delete("http://localhost:3000/polls");
    polls.value = [];
  } catch (error) {
    console.error("Error clearing database:", error);
  }
};

const fetchPolls = async () => {
  try {
    const response = await axios.get("http://localhost:3000/polls");
    // Ensure vote options maintain the correct order
    polls.value = response.data.map((poll) => ({
      ...poll,
      voteOptions: poll.voteOptions.sort((a, b) => a.id - b.id),
    }));
  } catch (error) {
    console.error("Error fetching polls:", error);
  }
};

onMounted(fetchPolls);
</script>

<template>
  <div>
    <h1>Create a Poll</h1>
    <input v-model="question" placeholder="Enter poll question" />
    <div v-for="(option, index) in voteOptions" :key="index">
      <input v-model="option.caption" placeholder="Enter option" />
      <button @click="removeOption(index)">Remove</button>
    </div>
    <button @click="addOption">Add Option</button>
    <button @click="createPoll">Submit Poll</button>

    <h1>Polls</h1>
    <div v-for="poll in polls" :key="poll.id">
      <h2>{{ poll.question }}</h2>
      <ul>
        <li v-for="option in poll.voteOptions" :key="option.id">
          {{ option.caption }} (Votes: {{ option.vote_count }})
          <button @click="vote(option.id)">Vote</button>
        </li>
      </ul>
    </div>
    <button @click="clearDatabase">Clear Database</button>
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
