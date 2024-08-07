<template>
  <div class="p-4 bg-gradient-to-r from-purple-400 to-pink-500 shadow-md rounded-lg">
    <!--    <h1 class="text-blue-500 text-2xl mb-4">Active Accounts</h1>-->
    <table class="w-full table-auto border-collapse">
      <thead>
      <tr>
        <th class="px-6 py-3 text-white text-lg font-semibold" colspan="5">Daily Checkins</th>
      </tr>
      <tr>
        <th class="px-4 pb-2 text-white text-md">Site</th>
        <th class="px-4 pb-2 text-white text-md">Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="site in sites" :key="site.id" class="bg-white odd:bg-gray-50 even:bg-gray-100">
        <td class="px-4 py-3 text-center text-gray-700">{{ site.full_name }}</td>

        <template v-if="site.checkin_type === 'daily_fixed'">
          <td v-if="noCheckinToday(site.last_checkin)" class="px-4 py-3 text-center">
            <button class="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="handleClick(site)">
              Check In
              <svg class="w-3 h-3 ml-2 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
                <path d="M15 2v7.5h-1v-5.668l-9.334 9.334-0.707-0.707 9.459-9.459h-5.918v-1h7.5zM11 16h-10v-10h6.574v-1h-7.574v12h12v-7.714h-1v6.714z" />
              </svg>
            </button>
          </td>
          <td v-else class="px-4 py-3 text-center">
            <div class="text-green-700 bg-green-100 px-3 py-2 rounded-full font-bold">&#10003;</div>
          </td>
        </template>

        <template v-else-if="site.checkin_type === '24_hour'">
          <td v-if="noCheckinLast24Hours(site.last_checkin)" class="px-4 py-3 text-center">
            <button class="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 flex items-center" @click="handleClick(site)">
              Check In
              <svg class="w-3 h-3 ml-2 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
                <path d="M15 2v7.5h-1v-5.668l-9.334 9.334-0.707-0.707 9.459-9.459h-5.918v-1h7.5zM11 16h-10v-10h6.574v-1h-7.574v12h12v-7.714h-1v6.714z" />
              </svg>
            </button>
          </td>
          <td v-else class="px-4 py-3 text-center">
            <div class="text-green-700 bg-green-100 px-3 py-2 rounded-full font-bold">&#10003;</div>
          </td>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CheckinTable',
  props: ['sites'],
  methods: {
    handleClick(site) {
      // launch the site in a new tab
      window.open(site.url, '_blank');
      // update the site's last_checkin in the database
      this.$emit('checkin', site);
    },
    noCheckinToday(lastCheckin) {
      if (!lastCheckin) {
        return true;
      }
      const today = new Date();
      const lastCheckinDate = new Date(lastCheckin);
      return today.getDate() !== lastCheckinDate.getDate();
    },
    noCheckinLast24Hours(lastCheckin) {
      if (!lastCheckin) {
        return true;
      }
      const today = new Date();
      const lastCheckinDate = new Date(lastCheckin);
      return today - lastCheckinDate > 86400000;
    }
  }
}
</script>
