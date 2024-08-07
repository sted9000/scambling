<template>
  <nav v-if="$route.path !== '/login'" class="flex justify-between items-center gap-4 px-4 py-8 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-lg m-4">
    <div class="flex items-center">
      <img v-if="logo" :src="logo" alt="App logo" class="h-10 w-10 mr-3 rounded-full">
      <span class="text-4xl font-bold text-white tracking-wide">{{ appName }}</span>
    </div>
    <div>
      <router-link v-if="!user" to="/login" class="bg-white hover:bg-yellow-400 text-blue-600 font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">Login</router-link>
      <button v-if="user" @click="signOut" class="bg-white hover:bg-red-400 text-blue-600 font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">Sign Out</button>
    </div>
  </nav>
  <router-view></router-view>
</template>

<script>
import { supabase } from '@/supabase'
import {signOut} from "@/auth";

export default {
  data () {
    return {
      accounts: [],
      players: [],
      user: null,
      appName: 'Scambling Dashboard',
      logo: 'chip.png',
    }
  },
  methods: {
    async signOut() {
      try {
        await signOut();
        this.$router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
    async getAccounts() {
      // query the event table
      const {data, error} = await supabase
          .from('account')
          .select('*')
          .eq('active', true)
      if (error) {
        console.error(error)
      } else {
        this.accounts = data;
      }
    },
    async getPlayers() {
      // query the event table
      const {data, error} = await supabase
          .from('player')
          .select('*')
      if (error) {
        console.error(error)
      } else {
        this.players = data;
      }
    },
  },
  async mounted() {
    await this.getAccounts()
    await this.getPlayers()
  },
  async created() {
    // see if the user is already signed in
    this.user = (await supabase.auth.getSession()).data?.session?.user;

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // handle sign in event or user updated event
        this.user = session.user;
      } else if (event === 'SIGNED_OUT') {
        // handle sign out event
        this.user = null;
      }
    })
  }
}
</script>

<style scoped>
  nav {
    animation: fadeIn 1s ease-in-out;
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
</style>
