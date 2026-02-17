import { Service } from "typedi";
import { Choice } from "../../core/entities/choice";

/**
 * Service for validating choices.
 * It checks if a given choice is valid based on predefined services and levels.
 */
@Service()
export class ChoiceService {
  /**
   * A list of valid services that can be included in a choice.
   * Each service must have a corresponding level that is a non-negative number.
   */
  private readonly services = [
    "Recognition",
    "Provision",
    "Indexing",
    "TransactionIndexing",
    "PartyClauseIndexing",
    "AcknowledgmentIndexing", // Notary Acknowledgment -
    "ExhibitIndexing", // Property
    "MonetaryInfoIndexing",
    "ConfidentialIndexing",
    "RecitalIndexing",  // Reference
    "EndorsementIndexing",
    "VitalIndexing",
    "CourtIndexing",
    "LegalEnrichment",
    "ChainEnrichment",
    "HistoryEnrichment",
    "PartyEnrichment",
    "FeeComputation",
    "Validation",
    "ClassIndexing",
    "Redaction",
    "Endorsment",
    "Confirmation",
    "Certification",
    "FineTuning",
    "Redact",
    "Record",
    "Abstract",
  ];

  /**
   * Validates the provided choice.
   * It checks if the choice has valid items, each with a valid service and a non-negative level.
   *
   * @param choice - The choice to validate.
   * @returns True if the choice is valid, false otherwise.
   */
  validateChoice(choice: Choice): boolean {
    if (!choice || !choice.items || !Array.isArray(choice.items) || choice.items.length === 0) {
      return false;
    }
    const result = choice.items.every(item =>
      this.services.includes(item.service) &&
      typeof item.level === 'number' &&
      item.level >= 0
    );
    return result;
  }

}
