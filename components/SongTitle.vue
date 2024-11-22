<script setup>
import { Note, Interval } from 'tonal'
import { pitchColor } from 'use-chromatone'

import { useRealBook } from '../composables/useRealBook';

const { transpose, currentSong, songPitch } = useRealBook()

</script>

<template lang='pug'>
transition(name="fade" mode="out-in")
  .flex.flex-col.sticky.left-0.top-0.p-4.bg-light-500.bg-op-80.backdrop-blur.dark-bg-dark-500.dark-bg-op-80.pl-16.z-1000(:key="currentSong.filename")
    .flex.w-full.items-center.gap-2
      .flex.flex-col.gap-2
        .flex.w-full.items-center.gap-2
          .text-xl.font-bold {{ currentSong.Title }}
        .text-md {{ currentSong.ComposedBy }}
        .text-sm  {{ currentSong.TimeSig[0] }}/{{ currentSong.TimeSig[1] }}, {{ currentSong.Bars }} bars 
      .flex-1
      .w-10.op-40.text-center.rounded-full.px-2.py-1.text-lg.font-bold(:style="{ backgroundColor: pitchColor(songPitch, 4, 1, .5) }") {{ currentSong.DBKeySig }}
      .flex.flex-col.w-14.text-center
        button.rounded-lg.transition.bg-light-900.active-bg-light-100.dark-bg-dark-300.active-dark-bg-dark-100(@click="transpose++") +
        .p-2.font-bold {{ transpose > 0 ? '+' : '' }}{{ Interval.fromSemitones(transpose) }}
        button.rounded-lg.transition.bg-light-900.active-bg-light-100.dark-bg-dark-300.active-dark-bg-dark-100(@click="transpose--") -
      .w-10.text-center.rounded-full.px-2.py-1.text-lg.font-bold(:style="{ backgroundColor: pitchColor(songPitch + transpose, 4, 1, .5) }") {{ Note.transpose(currentSong.DBKeySig, Interval.fromSemitones(transpose)) }}
</template>