<script setup>
import { computed, ref, reactive } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useStorage } from '@vueuse/core'
import { Chord, Range } from 'tonal'

import { activeChroma, noteNames, pitchColor, playChroma, playChromaOnce, stopChroma } from 'use-chromatone'

import YoutubeEmbed from './components/YoutubeEmbed.vue'
import StateDark from './components/StateDark.vue'
import ChordSheet from './components/ChordSheet.vue'

import { version } from './package.json'

import jazz from './real-book.yaml'

const globalChord = ref('')

jazz.sort((a, b) => a.Title < b.Title ? -1 : 1)

const currentFile = useStorage('real-book-song', jazz[0].filename)

const currentSong = computed(() => jazz.find(s => s.filename == currentFile.value))

const searchText = ref('')

const { results } = useFuse(searchText, jazz, {
  matchAllWhenSearchEmpty: true, fuseOptions: {
    keys: ['Title', 'ComposedBy'],
    includeScore: true,
  }
})

const panelOpen = ref(true)


</script>

<template lang='pug'>
.flex.justify-stretch.touch-action-manipulation.max-w-100vw.overflow-hidden.w-full(style="line-height: 1.2em;")
  .panel.bg-light-800.dark-bg-dark-500.flex.flex-col.max-h-100vh.overflow-scroll.gap-1.op-80.hover-op-100.transition.overscroll-none.z-100.absolute.max-w-80(
    :style="{ left: panelOpen ? 0 : '-100%' }"
    style="flex: 0 0 190px")
    .flex.items-center.p-2
      h1.text-xl Real Book
      .flex-1
      StateDark
    .text-sm.px-2  Interactive jazz standards chord progressions collection
    a.mx-2.top-8.right-8.flex.gap-1.items-center.no-underline.text-sm(href="https://github.com/chromatone/realbook/" target="_blank")
      .i-la-github
      span v.{{ version }}
    .flex.p-2.sticky.top-0.bg-light-400.dark-bg-dark-400.items-center.bg-op-80.dark-bg-op-80.backdrop-blur.z-1001
      .i-la-search.absolute.left-4.op-70.touch-action-none.pointer-events-none(v-if="!searchText")
      input.p-2.rounded-lg.w-full.dark-bg-dark-900(v-model="searchText")
      button.absolute.right-4.op-40.hover-op-90.transition(@click="searchText = ''")
        .i-la-times

    template(v-for="song in results" :key="song.item.filename")
      .song.flex.flex-col.cursor-pointer.hover-bg-light-900.dark-hover-bg-dark-900.p-1.transition(
        v-if="!song.score || song.score < 0.4"
        @click="currentFile = song.item.filename;"
        :class="{ active: currentFile == song.item.filename }"
        )
        .flex.items-baseline.flex-wrap.gap-2.relative
          .flex.items-baseline.w-full
            .font-bold {{ song.item.Title }}
            .flex-auto
            .rounded-full.px-1.text-xs.font-bold(:style="{ backgroundColor: pitchColor(noteNames[song.item.DBKeySig], 4, 1, .5) }") {{ song.item.DBKeySig }}
          .text-sm {{ song.item.ComposedBy }}
          .flex-auto
          .text-sm.absolute.bottom-0.right-0  {{ song.item.TimeSig[0] }}/{{ song.item.TimeSig[1] }}

  .flex.flex-col.gap-4.overflow-x-scroll.w-full.overscroll-none.overflow-scroll.max-h-100vh( style="flex: 1")
    transition(name="fade" mode="out-in")
      .flex.flex-col.sticky.left-0.top-0.p-4.bg-light-500.bg-op-60.backdrop-blur.dark-bg-dark-500.dark-bg-op-60(:key="currentSong.filename")
        .flex.w-full.items-center
          .text-xl.font-bold {{ currentSong.Title }}
          .flex-auto
          .rounded-full.px-2.py-1.text-lg.font-bold(:style="{ backgroundColor: pitchColor(noteNames[currentSong.DBKeySig], 4, 1, .5) }") {{ currentSong.DBKeySig }}
        .text-md {{ currentSong.ComposedBy }}
        .text-sm  {{ currentSong.TimeSig[0] }}/{{ currentSong.TimeSig[1] }}, {{ currentSong.Bars }} bars 

    transition(name="fade" mode="out-in")
      .flex.flex-col.gap-4.p-2(:key="currentSong.Title")
        .flex.gap-2(v-for="line in currentSong.chords" :key="line")
          .flex-1.flex.items-center.gap-1.rounded.overflow-hidden.cursor-pointer(v-for="chord in line" :key="chord") 
            .flex-1.flex.font-bold.text-sm.filter.flex-col(
              @pointerdown="playChroma(Chord.get(ch).chroma, noteNames[Chord.get(ch).tonic])"
              @pointerup="stopChroma(Chord.get(ch).chroma, noteNames[Chord.get(ch).tonic])"
              @pointerleave="stopChroma(Chord.get(ch).chroma, noteNames[Chord.get(ch).tonic])"
              v-for="ch in chord.split(' ')" :key="ch"
              ) 
                .flex.items-center(:style="{ backgroundColor: pitchColor(noteNames[Chord.get(ch).tonic], 4, 1, .3) }")
                  .flex.flex-col.flex-wrap.gap-1.p-0
                    .p-4px.rounded-full.transition(
                      :style="{ backgroundColor: pitchColor(pitch, activeChroma[pitch] == 1 ? 4 : 2, 1, 1) }"
                      v-for="pitch in Range.numeric([0, Chord.get(ch).notes.length - 1]).map(Chord.steps(ch)).map(n => noteNames[n])")
                  .text-md.md-text-lg.p-2.hover-brightness-150 {{ ch }}
                  .flex-1 
                  .i-la-info-circle.op-50.hover-op-100.transition(@click="globalChord = ch")




    youtube-embed.my-16(v-if="currentSong.youtube" :video="currentSong.youtube")
    .flex-1
    chord-sheet.z-100.sticky.bottom-2.right-2(
      @reset="globalChord = ''"
      :chord="globalChord"
      )
</template>

<style lang="postcss">
.song.active {
  @apply bg-light-900 bg-op-90 dark-bg-dark-100 sticky top-13 bottom-0 z-1000 backdrop-blur
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