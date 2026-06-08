"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: {
    label: string;
    path: string;
  }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return null;
}
