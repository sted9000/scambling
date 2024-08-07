<template>
  <div class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center" @click.self="submitFilter">
    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-sm w-full">
      <div class="bg-gradient-to-r from-blue-300 to-green-400 p-5">
        <h2 class="text-white text-lg font-semibold mb-4">Modules</h2>
        <div class="flex items-center mb-4">
          <label class="switch mr-3">
            <input type="checkbox" v-model="localFilterSettings.showDeposit" />
            <span class="slider round"></span>
          </label>
          <span class="text-white">Deposit Bonus</span>
        </div>
        <div class="flex items-center mb-4">
          <label class="switch mr-3">
            <input type="checkbox" v-model="localFilterSettings.showTimeClock" />
            <span class="slider round"></span>
          </label>
          <span class="text-white">Time Clock</span>
        </div>
        <div class="flex items-center mb-4">
          <label class="switch mr-3">
            <input type="checkbox" v-model="localFilterSettings.showPokerTracker" />
            <span class="slider round"></span>
          </label>
          <span class="text-white">Poker Tracker</span>
        </div>
        <div class="flex items-center mb-4">
          <label class="switch mr-3">
            <input type="checkbox" v-model="localFilterSettings.showPostalCode" />
            <span class="slider round"></span>
          </label>
          <span class="text-white">Postal Code</span>
        </div>
        <div class="flex items-center mb-4">
          <label class="switch mr-3">
            <input type="checkbox" v-model="localFilterSettings.showPromos" />
            <span class="slider round"></span>
          </label>
          <span class="text-white">Daily Promo</span>
        </div>
        <div class="flex items-center mb-4">
          <label class="switch mr-3">
            <input type="checkbox" v-model="localFilterSettings.showCheckin" />
            <span class="slider round"></span>
          </label>
          <span class="text-white">Daily Checkin</span>
        </div>
        <div class="flex justify-end">
          <button @click="submitFilter" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300">Apply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['filterSettings'],
  data() {
    return {
      localFilterSettings: { ...this.filterSettings }
    }
  },
  methods: {
    submitFilter() {
      this.$emit('submit', { ...this.localFilterSettings });
      this.$emit('close');
    }
  }
}
</script>

<style>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
