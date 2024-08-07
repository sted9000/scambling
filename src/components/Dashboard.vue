<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div v-if="filterSettings.showTimeClock" class="h-auto m-4">
      <TimeClock/>
    </div>
    <div v-if="filterSettings.showDeposit" class="h-auto m-4">
      <DepositBonus :sites="depositSites"/>
    </div>

    <div v-if="filterSettings.showPokerTracker" class="h-auto m-4">
      <PokerTracker :sites="pokerSites"/>
    </div>
    <div v-if="filterSettings.showCheckin" class="h-aut m-4">
      <CheckinTable :sites="checkinSites" @checkin="handleCheckin"/>
    </div>
    <div v-if="filterSettings.showPromos" class="h-auto m-4">
      <DailyPromos :sites="sites" class="h-auto"/>
    </div>
    <div v-if="filterSettings.showPostalCode" class="h-auto m-4">
      <PostalCode :sites="postalSites"/>
    </div>

  </div>

  <!--    Filter Modal-->
  <button class="fixed bottom-4 right-4 p-3 bg-blue-500 rounded-full hover:bg-blue-700 transition duration-300" @click="openModal">
    <AdjustmentsHorizontalIcon class="size-10 text-white"/>
  </button>
  <FilterModal v-show="isModalOpen" :filter-settings="filterSettings" @close="closeModal" @submit="handleFilter"/>
</template>


<script>
import { supabase } from '@/supabase'
import CheckinTable from "@/components/CheckinTable";
import PostalCode from "@/components/PostalCode";
import {AdjustmentsHorizontalIcon} from '@heroicons/vue/24/solid'
import FilterModal from "@/components/FilterModal";
import DailyPromos from "@/components/DailyPromos";
import DepositBonus from "@/components/DepositBonus";
import TimeClock from "@/components/TimeClock";
import PokerTracker from "@/components/PokerTracker";

export default {
  name: 'DashboardComponent',
  components: {
    PokerTracker,
    TimeClock,
    DepositBonus,
    DailyPromos,
    PostalCode,
    CheckinTable,
    AdjustmentsHorizontalIcon,
    FilterModal
  },
  data () {
    return {
      sites: [],
      loading: true,
      isModalOpen: false,
      filterSettings: {
        showDeposit: true,
        showPokerTracker: true,
        showTimeClock: true,
        showPostalCode: true,
        showCheckin: true,
        showPromos: true
      }
    }
  },

  computed: {
    // sites that are collecting postal codes
    postalSites() {
      return this.sites.filter(site => site.is_postal_code);
    },
    checkinSites() {
      return this.sites.filter(site => site.is_checkin);
    },
    depositSites() {
      return this.sites.filter(site => site.is_deposit_bonus);
    },
    pokerSites() {
      return this.sites.filter(site => site.is_poker);
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    handleFilter(filterSettings) {
      this.filterSettings = filterSettings;
      this.closeModal();
    },
    async handleCheckin(site) {

      // update the last_checkin field in the site table;
      const {data, error} = await supabase
          .from('site')
          .update({last_checkin: new Date()})
          .eq('id', site.id)
          .select('*')

      // update the sites array
      if (error) {
        console.error(error)
      } else {
        const index = this.sites.findIndex(s => s.id === site.id);
        this.sites.splice(index, 1, data[0]);
      }

      // insert into bonus table
      const {data: bonusData, error: bonusError} = await supabase
          .from('bonus')
          .insert([
            {site_id: site.id, type: 'CHECHIN', amount: site.checkin_amount}
          ])
          .select('*')

      if (bonusError) {
        console.error('Error inserting bonus:', bonusError)
      } else {
        console.log('Bonus inserted:', bonusData)
      }
    },
    async getSites() {
      // query the site table
      const {data, error} = await supabase
          .from('site')
          .select('*')
      if (error) {
        console.error(error)
      } else {
        this.sites = data;
      }
    },
  },

  mounted() {
    this.getSites();
    this.loading = false;
  }
}
</script>

