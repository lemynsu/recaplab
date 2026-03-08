import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import yosemiteCover from "@/assets/yosemite-cover.jpg";
import yosemiteThumb1 from "@/assets/yosemite-thumb1.jpg";
import yosemiteThumb2 from "@/assets/yosemite-thumb2.jpg";
import yosemiteThumb3 from "@/assets/yosemite-thumb3.jpg";

import hikeThumb3 from "@/assets/hike-thumb3.jpg";

import nightThumb1 from "@/assets/night-thumb1.jpg";
import nightThumb2 from "@/assets/night-thumb2.jpg";
import nightThumb3 from "@/assets/night-thumb3.jpg";

const albums = [
  {
    title: "Yosemite Trip",
    meta: "Jan 2025  ·  4 photos",
    cover: yosemiteCover,
    thumbs: [yosemiteThumb1, yosemiteThumb2, yosemiteThumb3],
  },
  {
    title: "Night & Nature",
    meta: "Jan 2025  ·  4 photos",
    cover: nightThumb2,
    thumbs: [nightThumb1, nightThumb2, nightThumb3],
  },
  {
    title: "Winter Trails",
    meta: "Jan 2025  ·  6 photos",
    cover: hikeThumb3,
    thumbs: [yosemiteThumb3, nightThumb1, yosemiteThumb1],
  },
  {
    title: "Golden Hour",
    meta: "Dec 2024  ·  8 photos",
    cover: yosemiteThumb2,
    thumbs: [nightThumb3, hikeThumb3, yosemiteThumb3],
  },
];
export default Index;
