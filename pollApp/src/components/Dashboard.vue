<script setup>
import { onBeforeMount, ref, computed } from "vue";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const polls = ref([]);
const question = ref("");
const option1 = ref({ caption: "" });
const option2 = ref({ caption: "" });
const voteOptions = ref([]);
var allOptions = [];


//Token authentication
const token = localStorage.getItem("authToken");
const userRole = localStorage.getItem("userRole");

const isLoggedIn = computed(() => !!localStorage.getItem("authToken")); // Check if token exists

const getUser = async () => {
  const username = localStorage.getItem("authToken");
  const response = await axios.get("http://localhost:3000/users/" + username);
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
  if (!isLoggedIn.value) {
    alert("You must be logged in to create a poll.");
    return;
  }
  try {
    const token = localStorage.getItem("authToken");
    const publishedAt = new Date();
    const validUntil = new Date();
    validUntil.setDate(publishedAt.getDate() + 30);

    const response = await axios.post(
        "http://localhost:3000/polls/",
        {
          question: question.value,
          publishedAt,
          validUntil,
          voteOptions: allOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the header
          },
        }
    );

    polls.value.push(response.data);
    console.log("Poll created: ", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error creating poll:", error.response.data);
    }
  }
};

// sends a GET request to the server to fetch all polls
const getPolls = async () => {
  console.log("Fetched polls:", polls.value);
  try {
    const token = localStorage.getItem("authToken");


    const config = {
      headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}, // Empty headers for public access
    };

    // Pass the config object to axios.get()
    const response = await axios.get("http://localhost:3000/polls/", config);

    // Update polls data
    polls.value = response.data;
    console.log("Fetched polls:", polls.value);
  } catch (error) {
    console.error("Error fetching polls:", error);

    // Handle 401 error (unauthorized access)
    if (error.response && error.response.status === 401) {
      alert("Error fetching polls. Please try again later.");
    }
  }
};

// TODO: implement function to vote on a poll option
// TODO: make request dynamic based on logged in user
const vote = async (voteOptionId) => {
  try {
    const token = localStorage.getItem("authToken");

    // Determine if the user is logged in
    const isLoggedIn = !!token;

    let username = null;

    if (isLoggedIn) {
      // Decode the username from the token if logged in
      const decodedToken = jwtDecode(token); // Assuming you imported jwt-decode
      username = decodedToken.username;
    }

    // Send the vote request
    const voteRes = await axios.post(
        isLoggedIn
            ? `http://localhost:3000/votes/${username}`
            : `http://localhost:3000/votes/anonymous`, // Fallback for anonymous users
        { voteOptionId: voteOptionId },
        isLoggedIn
            ? {
              headers: {
                Authorization: `Bearer ${token}`, // Include token if logged in
              },
            }
            : {}
    );

    console.log("Vote response:", voteRes.data);

    // Increment the vote count for the poll
    const countRes = await axios.post(
        `http://localhost:3000/polls/${voteOptionId}`,
        {},
        isLoggedIn
            ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
            : {}
    );

    console.log("Vote count updated:", countRes.data);

    // Refresh polls after voting
    getPolls();
  } catch (error) {
    console.error("Error voting:", error);
    if (error.response) {
      alert(`Error voting: ${error.response.data.message}`);
    }
  }
};





// ensures the polls are fetched on page load
onBeforeMount(() => {
  getPolls(); // Always fetch polls, regardless of authentication
});
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
