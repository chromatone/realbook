<script setup>
import { Range } from 'tonal';
import { Chord } from 'tonal';
import { activeChroma, rotateArray, noteNames, pitchColor, playChroma, stopChroma, chromaColorMix } from 'use-chromatone';
import { computed } from 'vue';

const props = defineProps({
  chord: { type: String, default: 'Cm7' }
})

const emit = defineEmits(['info'])

const chroma = computed(() => Chord.get(props.chord).chroma)
const tonic = computed(() => noteNames[Chord.get(props.chord).
  tonic])
const tonicPitch = computed(() => noteNames[Chord.get(props.chord).tonic])

const pitches = computed(() => Range.numeric([0, Chord.get(props.chord).notes.length - 1]).map(Chord.steps(props.chord)).map(n => noteNames[n]))
</script>

<template lang='pug'>
 button.flex-1.flex.font-bold.text-sm.filter.flex-col.relative(
    @pointerdown="playChroma(chroma, tonic)"
    @pointerup="stopChroma(chroma, tonic)"
    @pointerleave="stopChroma(chroma, tonic)"
    :class="{ 'brightness-120': rotateArray(chroma, -tonic).join('') == activeChroma }"
    )
      .flex.flex-col.rounded-xl.p-1.gap-1(:style="{ backgroundColor: chromaColorMix(rotateArray(chroma, -tonic).join(''), tonic, .15, 5).hsl }")

        .flex.items-center.transition.bg-light-800.dark-bg-dark.bg-op-70.dark-bg-op-70.hover-bg-op-100.dark-hover-bg-op-100.rounded-lg.p-1
          .text-md.hover-brightness-150 {{ chord }}
          .flex-1 
          .i-la-info-circle.op-50.hover-op-100.transition.mr-2(@pointerdown="emit('info', chord)")
        .op-50.hover-op-100.flex.items-center.transition.transition.bg-light-800.dark-bg-dark.bg-op-70.dark-bg-op-70.hover-bg-op-100.dark-hover-bg-op-100.rounded-lg.p-1.gap-1
          .p-4px.rounded-full.transition.flex-1(
            :style="{ backgroundColor: pitchColor(pitch, activeChroma[pitch] == 1 ? 4 : 2, 1, activeChroma[pitch] == 1 ? 1 : .4) }"
            v-for="pitch in pitches")


</template>