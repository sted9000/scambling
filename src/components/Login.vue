<template>
  <div class="m-5 mb-8">
    <h1 class="text-blue-500 text-2xl mb-2">Sign In</h1>
    <div class="inline-block mb-4">
      <input v-model="email" placeholder="Email" class="border px-4 py-2 text-md" />
      <input v-model="password" type="password" placeholder="Password" class="border px-4 py-2 text-md" />
    </div>
    <button @click="login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</button>
  </div>
</template>

<script>
import { signIn } from '../auth';

export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await signIn(this.email, this.password);
        this.$router.push('/');
      } catch (error) {
        alert(error.message);
      }
    }
  }
};
</script>
