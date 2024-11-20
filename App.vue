<script setup>
import { computed, ref } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { onClickOutside, useStorage } from '@vueuse/core'
import { Chord, Range } from 'tonal'

import { activeChroma, noteNames, pitchColor, playChroma, useMidi, stopChroma, useSoundFont } from 'use-chromatone'

import YoutubeEmbed from './components/YoutubeEmbed.vue'
import StateDark from './components/StateDark.vue'
import ChordSheet from './components/ChordSheet.vue'

import { version } from './package.json'

import jazz from './real-book.yaml'

const { cached, instrument, loaded, synthEnabled, getSoundfontNames } = useSoundFont()
const { midi } = useMidi()

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

const panel = ref()

onClickOutside(panel, () => { panelOpen.value = false })

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

</script>

<template lang='pug'>
.flex.justify-stretch.touch-action-manipulation.max-w-100vw.overflow-hidden.w-full(style="line-height: 1.2em;")

  .flex.absolute.items-center.bottom-0.left-0.right-0.gap-2.z-100.bg-light-600.dark-bg-dark-200.p-2
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

  .shadow-xl.panel.z-10000.transition.bg-light-800.dark-bg-dark-500.flex.flex-col.max-h-100vh.gap-1.transition.overscroll-none.z-100.absolute(
    ref="panel"
    :style="{ transform: `translateX(${panelOpen ? '0px' : '-230px'})`, width: '230px' }")
    button.text-lg.absolute.-right-12.z-1000.top-6.bg-light-300.dark-bg-dark-800.p-2.rounded.shadow-lg(@click="panelOpen = !panelOpen")
      .i-la-bars(v-if="!panelOpen")
      .i-la-angle-left(v-else)

    h1.text-xl.p-2 Real Book

    .text-sm.px-2  Interactive jazz standards chord progressions collection
    a.mx-2.top-8.right-8.flex.gap-1.items-center.no-underline.text-sm(href="https://github.com/chromatone/realbook/" target="_blank")
      .i-la-github
      span v.{{ version }}
    .flex.p-2.sticky.top-0.bg-light-400.dark-bg-dark-400.items-center.bg-op-80.dark-bg-op-80.backdrop-blur.z-1001
      .i-la-search.absolute.left-4.op-70.touch-action-none.pointer-events-none(v-if="!searchText")
      input.p-2.rounded-lg.w-full.dark-bg-dark-900(v-model="searchText")
      button.absolute.right-4.op-40.hover-op-90.transition(@click="searchText = ''")
        .i-la-times
    .overflow-y-scroll
      template(v-for="song in results" :key="song.item.filename")
        .song.flex.flex-col.cursor-pointer.hover-bg-light-900.dark-hover-bg-dark-900.p-2.transition(
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
      .flex.flex-col.sticky.left-0.top-0.p-4.bg-light-500.bg-op-80.backdrop-blur.dark-bg-dark-500.dark-bg-op-80.pl-16.z-1000(:key="currentSong.filename")
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
                  .i-la-info-circle.op-50.hover-op-100.transition.mr-2(@click="globalChord = ch")




    youtube-embed.my-16(v-if="currentSong.youtube" :video="currentSong.youtube")
    .flex-1
    chord-sheet.z-100.sticky.bottom-2.right-2(
      @reset="globalChord = ''"
      :chord="globalChord"
      )
</template>

<style lang="postcss">
.song.active {
  @apply bg-light-900 bg-op-90 dark-bg-dark-100 sticky top-0 bottom-0 z-1000 backdrop-blur
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