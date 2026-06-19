"use client";

import Link from "next/link";

interface WaRoundRobinButtonProps {
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WaRoundRobinButton({ className, children }: WaRoundRobinButtonProps) {
  return (
    <Link
      href="/thankyou/google/"
      className={className}
    >
      {children}
    </Link>
  );
}
