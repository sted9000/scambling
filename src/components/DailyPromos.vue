<template>
  <div class="p-4 bg-gradient-to-r from-green-300 to-teal-400 shadow-md rounded-lg">
    <table v-if="daily_promos" class="w-full table-auto border-collapse">
      <thead>
      <tr>
        <th class="px-6 py-3 text-white text-lg font-semibold" colspan="5">Daily Promos</th>
      </tr>
      <tr>
        <th class="px-4 pb-2 text-white text-md">Site</th>
        <th class="px-4 pb-2 text-white text-md">Promo</th>
        <th class="px-4 pb-2 text-white text-md">Start</th>
        <th class="px-4 pb-2 text-white text-md">End</th>
        <th class="px-4 pb-2 text-white text-md">Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="nonDeletedPromos.length === 0">
        <td class="px-4 py-3 text-center text-gray-700 bg-gray-50" colspan="5">No promos available</td>
      </tr>
      <tr v-for="promo in nonDeletedPromos" :key="promo.id" class="bg-white odd:bg-gray-50 even:bg-gray-100">
        <td class="px-4 py-3 text-center text-gray-700">{{ siteIdToSiteName(promo.site_id, sites) }}</td>
        <td class="px-4 py-3 text-center text-gray-700">{{ promo.promo_type }}</td>
        <td class="px-4 py-3 text-center text-gray-700">{{ promo.starts_at }}</td>
        <td class="px-4 py-3 text-center text-gray-700">{{ promo.ends_at }}</td>
        <td v-if="promoStatus(promo) === 'Available'" class="px-4 py-3 text-center">
          <button class="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="handleClaim(promo.id, promo.site_id, promo.subject)">
            Claim
            <svg class="w-3 h-3 ml-2 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
              <path d="M15 2v7.5h-1v-5.668l-9.334 9.334-0.707-0.707 9.459-9.459h-5.918v-1h7.5zM11 16h-10v-10h6.574v-1h-7.574v12h12v-7.714h-1v6.714z" />
            </svg>
          </button>
        </td>
        <td v-if="promoStatus(promo) === 'Viewed'" class="px-4 py-3 text-center">
          <button class="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="openModal(promo.id)">
            Record
          </button>
        </td>
        <td v-if="promoStatus(promo) === 'Recorded'" class="px-5 py-4 text-center">
          <div class="text-green-700 bg-green-100 px-3 py-2 rounded-full font-bold">&#10003;</div>
        </td>
        <td v-if="!promo.recorded" class="px-4 py-3 text-center">
          <TrashIcon class="w-5 h-5 text-red-700 cursor-pointer" @click="handleDelete(promo.id)"/>
        </td>
        <td v-else class="px-4 py-3 text-center">
          <ArchiveBoxIcon class="w-5 h-5 cursor-pointer" @click="handleArchive(promo.id)"/>
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
                  <input v-model="modalData.ev" placeholder="EV" class="border py-2 px-4 rounded-full text-sm font-semibold w-full mb-2"/>
                  <input v-model="modalData.time_elapsed" placeholder="Time" class="border py-2 px-4 rounded-full text-sm font-semibold w-full"/>
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
import {displayMethodsMixin} from "@/mixins";
import { supabase } from '@/supabase'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { ArchiveBoxIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'WowVegasTable',
  components: { TrashIcon, ArchiveBoxIcon },
  props: ['sites'],
  mixins: [displayMethodsMixin],
  data() {
    return {
      daily_promos: [],
      isModalOpen: false,
      modalData: {
        ev: '',
        start_time: null,
        end_time: null,
        promoId: null
      }
    }
  },
  computed: {
    nonDeletedPromos() {
      return this.daily_promos.filter(promo => !promo.deleted && !promo.archived)
    }
  },
  methods: {
    async fetchDailyPromos() {
      // query the event table
      const { data, error } = await supabase
          .from('promotions')
          .select('*')
      if (error) {
        console.error(error)
      } else {
        this.daily_promos = data;
      }
    },
    async handleClaim(promoId, siteId, promoSubject) {
      let site = this.sites.find(site => site.id === siteId)
      // update the promo's viewed status in the database
      const { data, error } = await supabase
          .from('promotions')
          .update({ viewed: true })
          .eq('id', promoId)
          .select()
      if (error) {
        console.error(error)
      } else {
        this.modalData.start_time = new Date()
        const promoIndex = this.daily_promos.findIndex(promo => promo.id === promoId)
        this.daily_promos.splice(promoIndex, 1, data[0])
        await navigator.clipboard.writeText(`from:${site.promo_email} subject:${promoSubject}`)
        window.open(`https://mail.google.com/mail/`, '_blank');
      }
    },
    openModal(promoId) {
      this.isModalOpen = true;
      this.modalData.end_time = new Date();
      this.modalData.time_elapsed = Math.floor((this.modalData.end_time - this.modalData.start_time) / 1000);
      this.modalData.promoId = promoId;
    },
    closeModal() {
      this.isModalOpen = false;
      this.modalData.ev = '';
      this.modalData.start_time = '';
      this.modalData.end_time = '';
      this.modalData.promoId = null;
    },
    async saveModalData() {
      const { ev, time_elapsed, promoId } = this.modalData;
      if (!ev || !time_elapsed) {
        console.error('EV and Time are required');
        return;
      }

      // Update the promo's recorded status in the database
      const { data: promoData, error: promoError } = await supabase
          .from('promotions')
          .update({ recorded: true })
          .eq('id', promoId)
          .select()
      if (promoError) {
        console.error(promoError)
      } else {
        console.log(`Promo Data: ${promoData}`)
        const promoIndex = this.daily_promos.findIndex(promo => promo.id === promoId)
        this.daily_promos.splice(promoIndex, 1, promoData[0])
      }

      // Insert the bonus into the database with the EV and Time Elapsed
      const { error: bonusError } = await supabase
          .from('bonus')
          .insert({ promo_id: promoId, type: 'PROMO', amount: ev, duration: time_elapsed, site_id: this.daily_promos.find(promo => promo.id === promoId).site_id })
      if (bonusError) {
        console.error(bonusError)
      } else {
        this.closeModal();
      }
    },
    async handleDelete(id) {
      // delete the promo from the database
      const { data, error } = await supabase
          .from('promotions')
          .update({ deleted: true })
          .eq('id', id)
          .select()
      if (error) {
        console.error(error)
      } else {
        const promoIndex = this.daily_promos.findIndex(promo => promo.id === id)
        this.daily_promos.splice(promoIndex, 1, data[0])
      }
    },
    async handleArchive(id) {
      // archive the promo from the database
      const { data, error } = await supabase
          .from('promotions')
          .update({ archived: true })
          .eq('id', id)
          .select()
      if (error) {
        console.error(error)
      } else {
        const promoIndex = this.daily_promos.findIndex(promo => promo.id === id)
        this.daily_promos.splice(promoIndex, 1, data[0])
      }
    },
    promoStatus(promo) {
      if (!promo.viewed) {
        return 'Available'
      } else if (!promo.recorded) {
        return 'Viewed'
      } else {
        return 'Recorded'
      }
    },
  },
  async mounted() {
    await this.fetchDailyPromos()

    supabase
        .channel('room1')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'promotions' }, payload => {
          console.log('Change received!', payload)
          this.daily_promos.push(payload.new)
        })
        .subscribe()

  }
}
</script>

