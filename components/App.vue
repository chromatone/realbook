<script setup>
import { ref } from 'vue'
import { Interval, Chord } from 'tonal'

import { useRealBook } from '../composables/useRealBook'

import YoutubeEmbed from './YoutubeEmbed.vue'
import ChordSheet from './ChordSheet.vue'
import ChordCard from './ChordCard.vue'
import SongList from './SongList.vue'
import SettingsFooter from './SettingsFooter.vue'
import SongTitle from './SongTitle.vue'

const globalChord = ref('')

const { transpose, currentSong, currentFile } = useRealBook()

</script>

<template lang='pug'>
.flex.justify-stretch.touch-action-manipulation.max-w-100vw.overflow-hidden.w-full.h-full(style="line-height: 1.2em")

  SongList(@select="currentFile = $event" :current="currentFile")

  .flex.flex-col.overflow-y-scroll.w-full.overscroll-none.max-w-100vw.max-h-100vh.flex-1(style="flex: 1")

    SongTitle

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