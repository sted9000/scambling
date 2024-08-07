<template>
  <div class="relative p-4 bg-gradient-to-r from-purple-400 to-pink-500 shadow-md rounded-lg">
    <table class="w-full table-auto border-collapse">
      <thead>
      <tr>
        <th class="px-6 py-3 text-white text-lg font-semibold" colspan="5">Poker Tracker</th>
      </tr>
      <tr>
        <th class="px-4 pb-2 text-white text-md">Site</th>
        <th class="px-4 pb-2 text-white text-md">Game</th>
        <th class="px-4 pb-2 text-white text-md">Starting Bankroll</th>
        <th class="px-4 pb-2 text-white text-md">Starting Time</th>
        <th class="px-4 pb-2 text-white text-md"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="currentSessions.length === 0">
        <td colspan="5" class="text-center text-gray-700 text-center">
          <button @click="openModal" class="bg-white hover:bg-gray-100 text-pink-500 mt-3 py-2 px-4 rounded-full text-sm font-semibold transition duration-300">
            Add a session
          </button>
        </td>
      </tr>
      <template v-else>
        <tr v-for="session in currentSessions" :key="session.id" class="bg-white odd:bg-gray-50 even:bg-gray-100">
          <td class="px-4 py-3 text-center text-gray-700">{{ siteFromSiteId(session.site_id) }}</td>
          <td class="px-4 py-3 text-center text-gray-700">{{ session.game }}</td>
          <td class="px-4 py-3 text-center text-gray-700">${{ session.starting_br }}</td>
          <td class="px-4 py-3 text-center text-gray-700">{{ new Date(session.created_at).toLocaleString() }}</td>
          <td class="px-4 py-3 text-center">
            <button @click="launchEndSessionModal(session)" class="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center">
              End Session
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="text-center text-gray-700 text-right">
            <button @click="openModal" class="bg-white hover:bg-gray-100 text-pink-500 mt-3 py-2 px-4 rounded-full text-sm font-semibold transition duration-300">
              Add a session
            </button>
          </td>
        </tr>
      </template>

      </tbody>

    </table>


    <!-- Modal for starting a new session -->
    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add New Session
                </h3>
                <div class="mt-2">
                  <select v-model="newSession.site" class="border py-2 px-4 rounded-full text-sm font-semibold w-full mb-2">
                    <option v-for="site in sites" :key="site.id" :value="site">{{ site.full_name }}</option>
                  </select>
                  <select v-model="newSession.game" class="border py-2 px-4 rounded-full text-sm font-semibold w-full mb-2">
                    <option v-for="game in games" :key="game" :value="game">{{ game }}</option>
                  </select>
                  <input v-model="newSession.bankroll" placeholder="Starting Bankroll" type="text" class="border py-2 px-4 rounded-full text-sm font-semibold w-full mb-2"/>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveSession" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Save
            </button>
            <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for ending a session -->
    <div v-if="isEndSessionModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  End Session
                </h3>
                <div class="mt-2">
                  <input v-model="endSessionBankroll" placeholder="End Bankroll" type="text" class="border py-2 px-4 rounded-full text-sm font-semibold w-full mb-2"/>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveEndSession" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Save
            </button>
            <button @click="closeEndSessionModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase";

export default {
  name: 'PokerTracker',

  props: ['sites'],
  data() {
    return {
      sessions: [],
      isModalOpen: false,
      isEndSessionModalOpen: false,
      newSession: {
        site: null,
        game: '',
        bankroll: ''
      },
      currentSessionId: null,
      endSessionBankroll: '',
      games: ['PLO', 'NLHE']
    }
  },
  computed: {
    currentSessions() {
      return this.sessions.filter(session => !session.ending_br);
    }
  },
  methods: {
    siteFromSiteId(siteId) {
      const site = this.sites.find(site => site.id === siteId);
      return site ? site.full_name : 'Unknown Site';
    },
    openModal() {
      if (this.sites.length > 0) {
        this.newSession.site = this.sites[0];
      }
      if (this.games.length > 0) {
        this.newSession.game = this.games[0];
      }
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetNewSession();
    },
    resetNewSession() {
      this.newSession = {
        site: null,
        game: '',
        bankroll: ''
      }
    },
    async saveSession() {
      // Make sure all fields are filled out
      if (!this.newSession.site || !this.newSession.game || !this.newSession.bankroll) {
        alert('All fields are required');
        return;
      }
      // Add session to the database
      const { data, error } = await supabase
          .from('sessions')
          .insert({ site_id: this.newSession.site.id, game: this.newSession.game, starting_br: this.newSession.bankroll })
          .select()

      if (error) {
        console.error('Error inserting session:', error);
      } else {
        this.sessions.push(data[0]);
        this.closeModal();
      }
    },
    launchEndSessionModal(session) {
      this.currentSessionId = session.id;
      this.isEndSessionModalOpen = true;
    },
    closeEndSessionModal() {
      this.isEndSessionModalOpen = false;
      this.endSessionBankroll = '';
    },
    async saveEndSession() {
      if (!this.endSessionBankroll) {
        alert('End bankroll is required');
        return;
      }
      // Update session in the database
      const { data, error } = await supabase
          .from('sessions')
          .update({ ending_br: this.endSessionBankroll, ended_at: new Date() })
          .eq('id', this.currentSessionId)
          .select()

      if (error) {
        console.error('Error ending session:', error);
      } else {
        const sessionIndex = this.sessions.findIndex(session => session.id === this.currentSessionId);
        this.sessions.splice(sessionIndex, 1, data[0]);
        this.closeEndSessionModal();
      }
    }
  },
  async created() {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
    } else {
      this.sessions = data;
    }
  }
}
</script>
