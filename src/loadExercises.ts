import { exercises } from './exercises'
import type { Sketch } from './ExerciseSketch'
import { supabaseUrl as url, supabaseKey as key } from './supabaseConfig'

type Exercise = (typeof exercises)[number]
export type PublishedExercise = Pick<Exercise, 'id' | 'title' | 'category' | 'steps'> & { sketch: Sketch }

export const hasSupabaseConfig = Boolean(url || key)

export async function loadExercises(signal: AbortSignal): Promise<PublishedExercise[]> {
  if (!url || !key?.startsWith('sb_publishable_')) {
    throw new Error('Supabase requires a project URL and a publishable key.')
  }

  const endpoint = new URL('/rest/v1/exercises', url)
  endpoint.searchParams.set('select', 'id,title,category,steps,sketch')
  endpoint.searchParams.set('status', 'eq.published')
  endpoint.searchParams.set('order', 'title.asc,id.asc')

  const response = await fetch(endpoint, { headers: { apikey: key }, signal })
  if (!response.ok) {
    throw new Error(`Could not load exercises (${response.status}).`)
  }
  return response.json()
}
