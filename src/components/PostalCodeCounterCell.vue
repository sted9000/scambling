<template>
  <td class="px-4 py-3 text-center">
    <div class="bg-yellow-500 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300">{{ timeRemaining }}</div>
  </td>
</template>

<script>
import {onUnmounted, ref} from 'vue'
export default {
  props: ['pause', 'createdAt'],
  setup(props, context) {
    let timeRemaining = ref('');
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const createdAtTime = new Date(props.createdAt).getTime()
      const distance = now - createdAtTime
      const fiveMinutes = props.pause * 60 * 1000
      if (distance >= fiveMinutes) {
        clearInterval(interval)
        console.log('Postal code available')
        context.emit('postal-code-available')
      } else {
        const unFormattedTime = fiveMinutes - distance
        const minutes = Math.floor((unFormattedTime % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((unFormattedTime % (1000 * 60)) / 1000)
        if (minutes === 0) {
          timeRemaining.value = `${seconds}s`
        } else {
          timeRemaining.value = `${minutes + 1}m`
        }
      }
    }, 1000)
    onUnmounted(() => {
      clearInterval(interval)
    })
    return { timeRemaining }
  }
}
</script>
