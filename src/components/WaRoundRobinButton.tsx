"use client";

import { openWARoundRobin } from "@/lib/wa-roundrobin";

interface WaRoundRobinButtonProps {
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WaRoundRobinButton({ message, className, children }: WaRoundRobinButtonProps) {
  return (
    <button
      onClick={() => openWARoundRobin(message)}
      className={className}
    >
      {children}
    </button>
  );
}
