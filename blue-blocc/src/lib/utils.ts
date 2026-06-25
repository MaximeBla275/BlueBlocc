import { Parametres } from '@/types'

export function getSemaine(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getFullYear()}-S${weekNo.toString().padStart(2, '0')}`
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    .format(amount).replace('$US', '$').replace('USD', '$')
}

export function formatKg(kg: number): string {
  return `${kg.toLocaleString('fr-FR')} kg`
}

export function calculerSalaire(totalVendu: number, params: Parametres): number {
  if (totalVendu < params.quotaIndividuel) return 0
  const depassement = totalVendu - params.quotaIndividuel
  const nbPaliers = Math.floor(depassement / params.bonusPalier)
  return params.salaireBase + nbPaliers * params.bonusMontant
}
