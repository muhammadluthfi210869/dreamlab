"use client";

const RR_NUMBERS = ["6287776550657", "6281952417051"];

function getNextIndex(): number {
  const saved = localStorage.getItem("waIndex");
  return parseInt(saved || "0", 10);
}

function saveIndex(idx: number): void {
  localStorage.setItem("waIndex", String(idx));
}

export function openWARoundRobin(msg: string): void {
  const idx = getNextIndex();
  const phone = RR_NUMBERS[idx % RR_NUMBERS.length];
  const next = (idx + 1) % RR_NUMBERS.length;
  saveIndex(next);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

export function getThankyouUrl(source = "organic"): string {
  return `/thankyou/google/?source=${encodeURIComponent(source)}`;
}

export function medsosRoundRobinWhatsApp(msg: string): void {
  const idx = getNextIndex();
  const phone = RR_NUMBERS[idx % RR_NUMBERS.length];
  const next = (idx + 1) % RR_NUMBERS.length;
  saveIndex(next);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

export function getMedsosThankyouUrl(): string {
  return "/ads/thankyou-medsos/?skip_wa=1";
}
