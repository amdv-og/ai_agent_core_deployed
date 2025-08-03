import { Service } from "typedi";

/**
 * Service for validating segments.
 * It checks if a given segment is part of a predefined list of segments.
 */
@Service()
export class SegmentService {
    // Predefined list of segments
    private readonly segments = [
        "party",
        "reference",
        "notary",
        "court",
        "misc",
        "legal",
        "property",
        "transaction",
        "endorsement",
        "vital",
        "fiscal",
        "secrets"
    ];
    /**
     * Validates if the provided segment is part of the predefined segments.
     *
     * @param segment - The segment to validate.
     * @returns True if the segment is valid, false otherwise.
     */
    validateSegment(segment: string): boolean {
        return this.segments.includes(segment);
    }

}
