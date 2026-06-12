import { BetType } from '../api';

export function formatTime(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 0 }).format(value);
}

export function formatSelectionLabel(type: BetType, name: string, index: number) {
  return type === 'WINNER' ? name : `${index + 1}. ${name}`;
}

export function delay(durationInMs: number) {
  return new Promise((resolve) => window.setTimeout(resolve, durationInMs));
}
