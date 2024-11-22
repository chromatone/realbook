<script setup>
import { useMidi, useSoundFont } from 'use-chromatone'
import StateDark from './StateDark.vue'

const { cached, instrument, loaded, synthEnabled, getSoundfontNames } = useSoundFont()

const { midi } = useMidi()

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
</script>

<template lang='pug'>
.flex.sticky.items-center.bottom-0.left-0.right-0.gap-2.z-100.bg-light-600.dark-bg-dark-200.p-2
  button.text-2xl(
    v-tooltip="`Toggle sampler synth `"
    :style="{ opacity: synthEnabled ? 1 : 0.5 }" @click="synthEnabled = !synthEnabled") {{ loaded ? '⌽' : '✲' }}
  select.rounded-lg.text-sm.min-w-8.p-2.bg-light-300.dark-bg-dark-500(
    v-tooltip="`Select sampler synth sound`"
    v-model="instrument")
    option( v-for="name in getSoundfontNames()" :key="name" :value="name") {{ capitalize(name.replaceAll('_', ' ')) }} {{ cached[name] ? '✔' : '' }}
  .flex-1 
  StateDark
  select.rounded-lg.text-sm.min-w-8.p-2.bg-light-300.dark-bg-dark-500(
    v-tooltip="`Select MIDI output channel`"
    v-model="midi.channel")
    option( v-for="ch in Array(16).fill(true).map((_, i) => i + 1)" :key="ch" :value="ch") {{ ch }}
  button.text-2xl(
    v-tooltip="`Toggle MIDI output`"
    :style="{ opacity: midi.out ? 1 : 0.5 }" @click="midi.out = !midi.out")
    .i-mdi-midi-input
</template>