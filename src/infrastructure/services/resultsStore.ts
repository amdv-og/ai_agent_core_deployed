import { Service } from "typedi";

/**
 * Simple in-memory store for callback results
 * In production, this would be a database
 */
@Service()
export class ResultsStore {
  private results: Map<string, any> = new Map();

  /**
   * Store callback results for a session
   */
  store(session: string, workflow: string, data: any): void {
    const key = session;
    const existing = this.results.get(key) || {
      session,
      workflow,
      callbacks: []
    };

    existing.callbacks.push({
      timestamp: new Date().toISOString(),
      data
    });

    this.results.set(key, existing);
    console.log(`[ResultsStore] Stored result for session: ${session}, workflow: ${workflow}`);
  }

  /**
   * Get results for a session
   */
  get(session: string): any | null {
    return this.results.get(session) || null;
  }

  /**
   * Get all results
   */
  getAll(): any[] {
    return Array.from(this.results.values());
  }

  /**
   * Clear all results (for testing)
   */
  clear(): void {
    this.results.clear();
  }
}
