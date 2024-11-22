<script setup>
import { ref } from 'vue'
import { Note, Interval, Chord } from 'tonal'
import { pitchColor } from 'use-chromatone'

import { useRealBook } from './composables/useRealBook'

import YoutubeEmbed from './components/YoutubeEmbed.vue'
import ChordSheet from './components/ChordSheet.vue'
import ChordCard from './components/ChordCard.vue'
import SongList from './components/SongList.vue'
import SettingsFooter from './components/SettingsFooter.vue'

const globalChord = ref('')

const { transpose, currentSong, currentFile, songPitch } = useRealBook()

</script>

<template lang='pug'>
.flex.justify-stretch.touch-action-manipulation.max-w-100vw.overflow-hidden.w-full.h-full(style="line-height: 1.2em")

  SongList(@select="currentFile = $event" :current="currentFile")

  .flex.flex-col.overflow-y-scroll.w-full.overscroll-none.max-w-100vw.max-h-100vh.flex-1(style="flex: 1")

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

    transition(name="fade" mode="out-in")
      .flex.flex-col.gap-4.p-2(:key="currentSong.Title")
        .flex.gap-2.overflow-x-scroll(v-for="line in currentSong.chords" :key="line")
          .flex-1.flex.items-center.gap-1.cursor-pointer(v-for="step in line" :key="step") 
            ChordCard(
              :chord="Chord.transpose(chord, Interval.fromSemitones(transpose))" @info="globalChord = $event"
              v-for="chord in step.split(' ')" :key="chord"
              ) 

    youtube-embed.my-16(v-if="currentSong.youtube" :video="currentSong.youtube")
    .flex-1
    chord-sheet.z-100.sticky.bottom-2.right-2(
      @reset="globalChord = ''"
      :chord="globalChord"
      )

    .flex-1

    SettingsFooter

</template>

<style lang="postcss">
.song.active {
  @apply bg-light-100 bg-op-90 dark-bg-dark-100 sticky top-0 bottom-0 z-1000 backdrop-blur
}

#app {
  @apply w-full
}

html,
body {
  @apply flex items-stretch justify-stretch min-h-100svh bg-light-900 dark-bg-dark-100 dark-text-light-300;
  width: 100%;
  line-height: 1.3;
  font-family: "Commissioner", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  font-size: 1em;
  font-weight: 400;
  color: var(--c-text);
  direction: ltr;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overscroll-behavior: none;
  touch-action: pan-y;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
</style>