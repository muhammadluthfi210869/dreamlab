"use client";

import React from "react";
import AlurMaklonTimeline from "./AlurMaklonTimeline";

interface AlurInfographicProps {
  image?: string;
  alt?: string;
}

export default function AlurInfographic({ image, alt }: AlurInfographicProps) {
  return <AlurMaklonTimeline hideHeader={true} />;
}
