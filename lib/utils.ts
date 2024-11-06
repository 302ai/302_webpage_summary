import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { env } from 'next-runtime-env';
import { useUserStore } from '@/app/stores/use-user-store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalStorage(Item: string) {
  const data = localStorage.getItem(Item);
  return data;
}

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}

export function getAuthLocalStorage(window: Window, key: string) {
  if (window) {
    const data = JSON.parse(window.localStorage.getItem("DATA") || '{}')
    return data[key]
  }
  return null
}

export function getSessionStorage(key: string) {
  return sessionStorage.getItem(key);
}

export function getUse302Auth() {
  return env("NEXT_PUBLIC_USE_302_AUTH") === "true"
}

export function getApiKey() {
  const use302Auth = getUse302Auth();
  return use302Auth ? useUserStore.getState().apiKey : env('NEXT_PUBLIC_API_KEY');
}

export const showBrand = env("NEXT_PUBLIC_SHOW_BRAND") === 'true';
