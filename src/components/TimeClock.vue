<template>
  <div class="p-4 bg-gradient-to-r from-orange-400 to-pink-500 shadow-md rounded-lg min-w-96">
    <table class="w-full table-auto border-collapse">
      <thead>
      <tr>
        <th class="px-6 py-3 text-white text-lg font-semibold" colspan="5">Time Clock</th>
      </tr>
      </thead>
      <tbody>
      <template v-if="currentTimeCard !== null && notClockedIn">
        <tr class="bg-white bg-gray-50">
          <td class="px-4 py-3 flex justify-center">
            <button class="flash-button bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="handleClockIn()">
              Punch In
            </button>
          </td>
        </tr>
        <tr class="bg-gray-100">
          <td class="px-4 py-3 text-center text-gray-700">{{lastSession}}</td>
        </tr>
      </template>
      <template v-else>
        <tr class="bg-white bg-gray-50">
          <td class="px-4 py-3 flex justify-center">
            <button class="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="handleClockOut()">
              Punch Out
            </button>
          </td>
        </tr>
        <tr class="bg-gray-100">
          <td class="px-4 py-3 text-center text-gray-700">{{currentSession}}</td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import {supabase} from "@/supabase";

export default {
  name: 'TimeClock',
  data() {
    return {
      currentTimeCard: null,
    }
  },
  computed: {
    notClockedIn() {
      return !this.currentTimeCard || this.currentTimeCard.clocked_out_at
    },
    lastSession() {
      // display length of last session
      return this.currentTimeCard ? `Last session was ${new Date(this.currentTimeCard.created_at).toLocaleTimeString()} for ${Math.round((new Date(this.currentTimeCard.clocked_out_at) - new Date(this.currentTimeCard.created_at)) / 60000)} minutes` : 'No previous sessions'
    },
    currentSession() {
      // format the current session time to read "Punched in at 12:00 PM"
      return this.currentTimeCard ? `Punched in at ${new Date(this.currentTimeCard.created_at).toLocaleTimeString()}` : 'No current session'
    }

  },
  methods: {
    async handleClockIn() {
      // insert a new time clock record into db
      const {data, error} = await supabase
        .from('time_card')
        .insert([{}])
        .select()

      if (error) {
        console.error('Error inserting time clock record:', error)
      } else {
        console.log('Inserted time clock record:', data)
        this.currentTimeCard = data[0]
      }
    },
    async fetchTimeCards() {
      // query the time_card table
      const {data, error} = await supabase
        .from('time_card')
        .select('*')
        .order('created_at', {ascending: false})
        .limit(1)

      if (error) {
        console.error('Error fetching time cards:', error)
      } else {
        this.currentTimeCard = data[0]
      }
    },
    async handleClockOut() {
      // update the time clock record with the current time
      const {data, error} = await supabase
        .from('time_card')
        .update({clocked_out_at: new Date()})
        .eq('id', this.currentTimeCard.id)
        .select()

      if (error) {
        console.error('Error updating time clock record:', error)
      } else {
        console.log('Updated time clock record:', data)
        this.currentTimeCard = data[0]
      }
    },
  },
  async mounted() {
    await this.fetchTimeCards()
    console.log('Time clock mounted', this.currentTimeCard)
  }
}
</script>

<style scoped>
@keyframes flash {
  0% { background-color: blue; }
  50% { background-color: lightblue; }
  100% { background-color: blue; }
}

.flash-button {
  animation: flash 2s infinite;
}
</style>
