<template>
  <div class="p-4 bg-gradient-to-r from-teal-400 to-blue-500 shadow-md rounded-lg">
    <table class="w-full table-auto border-collapse">
      <thead>
      <tr>
        <th class="px-6 py-3 text-white text-lg font-semibold" colspan="5">Deposit Bonus</th>
      </tr>
      <tr>
        <th class="px-4 pb-2 text-white text-md">Site</th>
        <th class="px-4 pb-2 text-white text-md">Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="site in sites" :key="site.id" class="bg-white odd:bg-gray-50 even:bg-gray-100">
        <td class="px-4 py-3 text-center text-gray-700">{{ site.full_name }}</td>


        <td v-if="sitesStatus[site.id] && sitesStatus[site.id].status === 'Available'" class="px-4 py-3 text-center">
          <button class="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="handleClaim(site)">
            Claim
            <svg class="w-3 h-3 ml-2 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
              <path d="M15 2v7.5h-1v-5.668l-9.334 9.334-0.707-0.707 9.459-9.459h-5.918v-1h7.5zM11 16h-10v-10h6.574v-1h-7.574v12h12v-7.714h-1v6.714z" />
            </svg>
          </button>
        </td>
        <td v-if="sitesStatus[site.id] && sitesStatus[site.id].status === 'Claimed'" class="px-4 py-3 text-center">
          <button class="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="openModal(site)">
            Record
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- Modal -->
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
                  Enter EV and Time
                </h3>
                <div class="mt-2">
                  <input v-model="sitesStatus[modalId].ev" placeholder="EV" class="border py-2 px-4 rounded-full text-sm font-semibold w-full mb-2"/>
                  <input v-model="sitesStatus[modalId].totalTime" placeholder="Time" class="border py-2 px-4 rounded-full text-sm font-semibold w-full"/>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveModalData" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Save
            </button>
            <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {supabase} from "@/supabase";

export default {
  name: 'DepositBonus',
  props: ['sites'],
  data() {
    return {
      isModalOpen: false,
      modalId: null,
      sitesStatus: {}
    }
  },
  methods: {
    handleClaim(site) {
      this.sitesStatus[site.id].status = 'Claimed';
      this.sitesStatus[site.id].startTime = new Date();
      window.open(site.url, '_blank');

    },
    openModal(site) {
      this.isModalOpen = true;
      this.modalId = site.id;
      this.sitesStatus[site.id].endTime = new Date();
      this.sitesStatus[site.id].totalTime = Math.floor((this.sitesStatus[site.id].endTime - this.sitesStatus[site.id].startTime) / 60000);
    },
    async saveModalData() {
      const { ev, totalTime, promoId } = this.sitesStatus[this.modalId];
      if (!ev || (totalTime == null)) {
        alert('EV and Time are required');
        return;
      }

      // Insert the bonus into the database with the EV and Time Elapsed
      const { error: bonusError } = await supabase
          .from('bonus')
          .insert({ promo_id: promoId, type: 'DEPOSIT', amount: ev, duration: totalTime, site_id: this.modalId });
      if (bonusError) {
        console.error(bonusError)
      } else {
        this.sitesStatus[this.modalId].status = 'Available';
        this.closeModal();
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.sitesStatus[this.modalId].ev = null;
      this.sitesStatus[this.modalId].startTime = null;
      this.sitesStatus[this.modalId].endTime = null;
      this.sitesStatus[this.modalId].totalTime = null;
      this.modalId = null;

    },
    async populateSitesStatus() {
      const status = {};
      this.sites.forEach(site => {
        status[site.id] = { status: 'Available', startTime: null, endTime: null, totalTime: null, ev: null };
      });
      this.sitesStatus = status;
    }
  },
  watch: {
    sites: {
      handler: 'populateSitesStatus',
      immediate: true,
      deep: true
    }
  }
}
</script>
