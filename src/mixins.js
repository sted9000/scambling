// mixins.js
export const displayMethodsMixin = {
  methods: {
    displayDate(date) {
      const d = new Date(date)
      return d.toLocaleString()
    },
    displayDateShort(date) {
      // show only the hour and minute
        const d = new Date(date)
        return d.toLocaleTimeString()
    },
    displayAccount(site, email, players) {
      const player = players.find(player => player.email === email)
      if (!player) {
        return 'Unknown'
      }
      let playerName = player.display_name
      return playerName
    },
    displayAmount(amount) {
      return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    },
    siteIdToSiteName(siteId, sites) {
      const site = sites.find(site => site.id === siteId)
      if (!site) {
        return 'Unknown'
      }
      return site.full_name
    }
  }
}
