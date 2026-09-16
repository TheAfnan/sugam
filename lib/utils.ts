import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AvailabilityStatus = 'available' | 'limited' | 'full';

export function getAvailabilityStatus(problem: { current_team_count: number; max_teams: number }): AvailabilityStatus {
  const { current_team_count, max_teams } = problem;
  if (current_team_count >= max_teams) return 'full';
  if (current_team_count >= max_teams * 0.6) return 'limited';
  return 'available';
}

export function getAvailabilityLabel(status: AvailabilityStatus): string {
  switch (status) {
    case 'available': return 'Available';
    case 'limited': return 'Limited Slots';
    case 'full': return 'Full';
  }
}

export function getSlotsRemaining(problem: { current_team_count: number; max_teams: number }): number {
  return Math.max(0, problem.max_teams - problem.current_team_count);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(d);
  if (days > 1) return `${days} days ago`;
  if (days === 1) return 'Yesterday';
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return '1 hour ago';
  if (minutes > 1) return `${minutes} minutes ago`;
  return 'Just now';
}

export const SIH_THEMES = [
  'Smart Automation',
  'Disaster Management',
  'Blockchain & Cybersecurity',
  'MedTech / BioTech / HealthTech',
  'Smart Education',
  'Agriculture, FoodTech & Rural Development',
  'Space Technology',
  'Robotics and Drones',
  'Transportation & Logistics',
  'Fitness & Sports',
  'Heritage & Culture',
  'Travel & Tourism',
  'Clean & Green Technology',
  'Smart Vehicles',
  'Miscellaneous',
];

export function t(record: Record<string, string> | undefined | null, lang: string = 'en'): string {
  if (!record) return '';
  return record[lang] || record['en'] || Object.values(record)[0] || '';
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDays(days: number): string {
  if (days <= 0) return 'Instant';
  if (days >= 60) {
    const months = Math.round(days / 30);
    return `~${months} month${months > 1 ? 's' : ''} (${days} days)`;
  }
  return `${days} days`;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(c * 6371 * 10) / 10;
}

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'new delhi': { lat: 28.6139, lng: 77.209 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  surat: { lat: 21.1702, lng: 72.8311 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  kanpur: { lat: 26.4499, lng: 80.3319 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  patna: { lat: 25.5941, lng: 85.1376 },
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  guwahati: { lat: 26.1445, lng: 91.7362 },
  bhubaneswar: { lat: 20.2961, lng: 85.8245 },
};

export const PINCODE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '110': { lat: 28.6139, lng: 77.209 },
  '400': { lat: 19.076, lng: 72.8777 },
  '560': { lat: 12.9716, lng: 77.5946 },
  '600': { lat: 13.0827, lng: 80.2707 },
  '700': { lat: 22.5726, lng: 88.3639 },
  '500': { lat: 17.385, lng: 78.4867 },
  '411': { lat: 18.5204, lng: 73.8567 },
  '380': { lat: 23.0225, lng: 72.5714 },
  '302': { lat: 26.9124, lng: 75.7873 },
  '226': { lat: 26.8467, lng: 80.9462 },
  '160': { lat: 30.7333, lng: 76.7794 },
  '682': { lat: 9.9312, lng: 76.2673 },
  '781': { lat: 26.1445, lng: 91.7362 },
  '751': { lat: 20.2961, lng: 85.8245 },
};

export function getCoordinatesFromQuery(query: string): { lat: number; lng: number } | null {
  const clean = query.toLowerCase().trim();
  if (CITY_COORDINATES[clean]) return CITY_COORDINATES[clean];
  const pinPrefix = clean.slice(0, 3);
  if (PINCODE_COORDINATES[pinPrefix]) return PINCODE_COORDINATES[pinPrefix];
  return null;
}

export function isPincode(query: string): boolean {
  return /^[1-9][0-9]{5}$/.test(query.trim());
}

export function isCity(query: string): boolean {
  return /^[a-zA-Z\s]{3,30}$/.test(query.trim());
}
