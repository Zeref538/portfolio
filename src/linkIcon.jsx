import { LuPlay, LuBookOpen } from "react-icons/lu";

// Icon for a project's link, from its label: reading material (a case study or
// a paper) gets a book, anything you run or watch ("try it", "replay demo")
// gets play. One place, so the card, popup and project page can't disagree.
export function LinkIcon({ label }) {
  return /case study|paper/i.test(label) ? <LuBookOpen /> : <LuPlay />;
}
