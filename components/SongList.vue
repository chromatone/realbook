<script setup>
import { ref } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { onClickOutside } from '@vueuse/core'

import { noteNames, pitchColor } from 'use-chromatone'

import { version } from '../package.json'

import jazz from '../real-book.yaml'

jazz.sort((a, b) => a.Title < b.Title ? -1 : 1)

const emit = defineEmits(['select'])
const props = defineProps({
  current: { type: String, default: jazz[0].filename }
})

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

</script>

<template lang='pug'>
.shadow-xl.panel.z-10000.transition.bg-light-800.dark-bg-dark-500.flex.flex-col.max-h-100vh.transition.overscroll-none.z-100.absolute(
  ref="panel"
  :style="{ transform: `translateX(${panelOpen ? '0px' : '-230px'})`, width: '230px' }")
  button.text-lg.absolute.-right-12.z-1000.top-6.bg-light-300.dark-bg-dark-800.p-2.rounded.shadow-lg(@click="panelOpen = !panelOpen")
    .i-la-bars(v-if="!panelOpen")
    .i-la-angle-left(v-else)
  .p-2.flex.flex-col.gap-1
    a.flex.items-center.gap-1.px-2.pt-2(href="https://chromatone.center" target="_blank")
      img.w-6(src="/logo.svg")
      .text-sm.font-bold Chromatone
    .flex.w-full.px-2.py-1.items-baseline
      h1.text-2xl Real Book
      .flex-1
      a.mx-2.top-8.right-8.flex.gap-1.no-underline.text-sm(href="https://github.com/chromatone/realbook/" target="_blank")
        .i-la-github
        span v.{{ version }}

    .text-sm.p-2  Interactive jazz standards chord progressions collection

  .flex.p-2.sticky.top-0.bg-light-400.dark-bg-dark-400.items-center.bg-op-80.dark-bg-op-80.backdrop-blur.z-1001
    .i-la-search.absolute.left-4.op-70.touch-action-none.pointer-events-none(v-if="!searchText")
    input.p-2.rounded-lg.w-full.dark-bg-dark-900(v-model="searchText")
    button.absolute.right-4.op-40.hover-op-90.transition(@click="searchText = ''")
      .i-la-times
  .overflow-y-scroll
    template(v-for="song in results" :key="song.item.filename")
      .song.flex.flex-col.cursor-pointer.hover-bg-light-900.dark-hover-bg-dark-900.p-2.transition(
        v-if="!song.score || song.score < 0.4"
        @click="emit('select', song.item.filename)"
        :class="{ active: current == song.item.filename }"
        )
        .flex.items-baseline.flex-wrap.gap-2.relative
          .flex.items-baseline.w-full
            .font-bold {{ song.item.Title }}
            .flex-auto
            .rounded-full.px-1.text-xs.font-bold(:style="{ backgroundColor: pitchColor(noteNames[song.item.DBKeySig], 4, 1, .5) }") {{ song.item.DBKeySig }}
          .text-sm {{ song.item.ComposedBy }}
          .flex-auto
          .text-sm.absolute.bottom-0.right-0  {{ song.item.TimeSig[0] }}/{{ song.item.TimeSig[1] }}
</template>