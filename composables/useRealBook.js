import { computed, ref } from 'vue'

import jazz from '../real-book.yaml'
import { useStorage } from '@vueuse/core'
import { noteNames } from 'use-chromatone'
import { useClamp } from '@vueuse/math'

jazz.sort((a, b) => a.Title < b.Title ? -1 : 1)

export function useRealBook() {
  return { jazz, transpose, currentFile, currentSong, songPitch }
}

const currentFile = useStorage('real-book-song', jazz[0].filename)

const currentSong = computed(() => jazz.find(s => s.filename == currentFile.value))

const songPitch = computed(() => noteNames[currentSong.value.DBKeySig])

const transpose = useClamp(0, -12, 12)

