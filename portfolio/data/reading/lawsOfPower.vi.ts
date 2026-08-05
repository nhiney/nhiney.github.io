import type { BookReadingPage } from "../books";
import { POWER_BOARD_CARD_PAGES } from "./lawsOfPowerCards.vi";
import { POWER_BOARD_PART_ONE_PAGES } from "./lawsOfPowerPartOne.vi";
import { POWER_BOARD_PRACTICE_PAGES } from "./lawsOfPowerPractice.vi";

/** Vietnamese critical-reading edition: a field guide to recognising power
 * without turning the book's tactics into instructions to manipulate people. */
export const LAWS_OF_POWER_PAGES: BookReadingPage[] = [
  ...POWER_BOARD_PART_ONE_PAGES,
  ...POWER_BOARD_CARD_PAGES,
  ...POWER_BOARD_PRACTICE_PAGES,
];
