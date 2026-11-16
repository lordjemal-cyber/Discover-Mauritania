import { copy, type Locale } from './locales'

export const tourIds = ['adrar', 'train', 'coast'] as const
export type TourId = (typeof tourIds)[number]

// These public routes describe destinations, not confirmed schedules or prices.
export function getTours(locale: Locale) {
  return copy[locale].programs
}
