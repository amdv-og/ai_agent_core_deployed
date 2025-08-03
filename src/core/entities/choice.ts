/** ChoiceItem represents an individual choice with a service and a level.
 * It is used within the Choice interface to define a collection of choices.
 */
export interface ChoiceItem {
  service: string;
  level: number;
}

/** The Choice interface represents a collection of choice items.
 * It contains an array of ChoiceItem objects
 */

export interface Choice {
  items: ChoiceItem[]
}

