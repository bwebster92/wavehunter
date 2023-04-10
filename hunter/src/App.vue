<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import { useBreaksStore } from './stores/breaks'

const user =  useUserStore();
const breaks =  useBreaksStore();

onMounted(() => {
  // Check user info
  axios.post('/api/login', {
    username: user.id
  })
    .then((res) => {
      user.$patch(res.data)
    })
    .catch(err => {
      console.log(err)
    })

  // Get list of breaks
  axios.get('/api/breaks')
    .then((res) => {
      breaks.$patch(res.data)
    })
    .catch(err => {
      console.log(err)
    })
})
</script>

<template>
  <v-app>
    
    <v-app-bar app elevation="2">
      <v-app-bar-title class="headline">WaveHunter</v-app-bar-title>
      <nav>
        <RouterLink id="dash" to="/dash/:username">Home</RouterLink>
        <RouterLink id="explorer" to="/explore">Explore</RouterLink>
      </nav>
    </v-app-bar>

    <v-main>
        <RouterView />
    </v-main>

  </v-app>
</template>

<style>
body {
  font-family: "Monaco", "Lucida Console", monospace;
}
nav {
  padding-right: 10px;
}
a,
a:hover,
a:active {
  border-radius: 3px;
  text-decoration: none;
  font-size: 1.2em;
  padding: 10px 10px 10px 10px;
  margin: 4px 4px 4px 4px;
  color: black;
  background-color:rgb(205, 205, 205)
}
.headline {
  user-select: none;
}
</style>