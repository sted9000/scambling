<template>
  <div class="p-4 bg-gradient-to-r from-blue-300 to-sky-400 shadow-md rounded-lg">
    <table class="w-full table-auto border-collapse">
      <thead>
      <tr>
        <th class="px-6 py-3 text-white text-lg font-semibold" colspan="3">Postal Codes</th>
      </tr>
      <tr>
        <th class="px-4 pb-2 text-white text-md">Site</th>
        <th class="px-4 pb-2 text-white text-md">Input</th>
        <th class="px-4 pb-2 text-white text-md">Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="site in sites" :key="site.id" class="bg-white odd:bg-gray-50 even:bg-gray-100">
        <td class="px-4 py-3 text-center text-gray-700">{{ site.full_name }}</td>

        <!-- If the code is available, display an input field and a save button -->
        <template v-if="codeAvailable(site.id, site.postal_pause)">
          <td class="px-4 py-3 text-center">
            <input v-model="postalCodeInputs[site.id]" class="border py-2 px-4 rounded-full text-sm font-semibold w-56"/>
          </td>
          <td class="px-4 py-3 text-center">
            <button @click="savePostalCode(site.id)" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300">
              Save
            </button>
          </td>
        </template>

        <!-- If the code is not available, display a disabled input field and a waiting button -->
        <template v-else>
          <td class="px-4 py-3 text-center">
            <input class="border py-2 px-4 rounded-full text-sm font-semibold w-56" disabled/>
          </td>
          <PostalCodeCounterCell :pause="site.postal_pause" :created-at="lastCodeCreation(site.id)" @postal-code-available="handlePostalCodeAvailable()"/>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {displayMethodsMixin} from "@/mixins";
import {supabase} from "@/supabase";
import PostalCodeCounterCell from "@/components/PostalCodeCounterCell";

export default {
  name: 'PostalCode',
  components: {PostalCodeCounterCell},
  props: ['sites'],
  mixins: [displayMethodsMixin],
  data() {
    return {
      postalCodes: [],
      postalCodeInputs: {}
    }
  },
  methods: {
    sortPostalCodes(codes) {
      if (!codes.length) return []
      return codes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    codeIsOld(code, minutes) {
      return code.created_at < new Date(new Date().getTime() - minutes * 60000).toISOString()
    },
    codeAvailable(siteId, minutes) {
      let codes = this.postalCodes.filter(code => code.site_id === siteId)
      if (!codes.length) return true
      let latestCode = this.sortPostalCodes(codes)[0]
      if (this.codeIsOld(latestCode, minutes)) return true
      return false
    },
    lastCodeCreation(siteId) {
      let codes = this.postalCodes.filter(code => code.site_id === siteId)
      let latestCode = this.sortPostalCodes(codes)[0]
      return latestCode.created_at
    },
    async fetchPostalCodes() {
      const {data, error} = await supabase
          .from('postal_code')
          .select('*')
          .gt('created_at', new Date(new Date().getTime() - 30 * 60000).toISOString())
      if (error) {
        console.error(error)
      } else {
        this.postalCodes = data;
        console.log(this.postalCodes)
      }
    },
    async savePostalCode(siteId) {
      const postalCode = this.postalCodeInputs[siteId];
      if (!postalCode) {
        console.error('Postal code is required');
        return;
      }

      const {data, error} = await supabase
          .from('postal_code')
          .insert([
            {site_id: siteId, postal_code: postalCode},
          ])
          .select()
      if (error) {
        console.error(error)
      } else {
        this.postalCodes.push(data[0])
        // Clear the input after saving
        this.postalCodeInputs[siteId] = '';
      }
    },
    handlePostalCodeAvailable() {
      // rerender the component
      this.$forceUpdate();
    }
  },

  mounted() {
    this.fetchPostalCodes()
  }
}
</script>
