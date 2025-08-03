/* * MetaHeader represents the header information for a metadata record.
 * It includes the title, class, explanation, and optional fields like secondary titles, number, date, and total.
 * This interface is used to provide a structured overview of the metadata associated with a record.
 * The MetaHeader interface is essential for defining the primary attributes of a metadata record,
 * allowing for easy identification and categorization of the record's content.
 */
export interface MetaHeader {
  title: string;
  secondary_titles?: string[];
  class: string;
  explanation: string;
  number?: string;
  date?: string;
  total?: number;
}

/**
 * Index represents a specific piece of metadata associated with a record.
 * It includes fields like name, value, page, aspect, source, explanation,
 * and optional fields for ambiguity, verification, segment, and code.
 * This interface is used to define the structure of an index in the metadata system.
 */
export interface Index {
  name: string;
  value: string;
  page?: string;
  aspect: string;
  source: string;
  explanation: string;
  ambiguous?: string;
  verification?: string;
  segment?: string;
  code?: string;
}

/**
 * FeeFactor represents a factor that contributes to the calculation of fees.
 * It includes an amount, name, explanation, and optional fields for ambiguity and code.
 * This interface is used to define the components that influence fee calculations in the system.
 */
export interface FeeFactor {
  amount: number;
  name: string;
  explanation: string;
  ambiguous?: string;
  code?: string;
}

/**
 * FeeItem represents a specific fee associated with a record.
 * It includes fields like explanation, name, amount, formula, and an optional code.
 * This interface is used to define the structure of a fee item in the metadata system.
 */
export interface FeeItem {
  explanation: string;
  name: string;
  amount: number;
  formula: string;
  code?: string;
}

/**
 * FundItem represents a specific fund associated with a record.
 * It includes fields like explanation, name, amount, formula, and an optional code.
 * This interface is used to define the structure of a fund item in the metadata system.
 */
export interface FundItem {
  explanation: string;
  name: string;
  amount: number;
  formula: string;
  code?: string;
}

/**
 * PageItem represents a specific page item in the metadata system.
 * It includes fields like class, explanation, and optional fields for name and code.
 * This interface is used to define the structure of a page item in the metadata system.
 */
export interface PageItem {
  class: string;
  explanation: string;
  name?: string;
  code?: string;
}

/**
 * Pages represents a collection of page items in the metadata system.
 * It includes optional fields for recordable and non-recordable pages,
 * as well as the total number of pages and records.
 * This interface is used to define the structure of pages in the metadata system.
 */
export interface Pages {
  recordables?: PageItem[];
  nonrecordables?: PageItem[];
  num_of_pages?: number;
  num_of_records?: number;
}

/**
 * Secret represents a sensitive piece of information in the metadata system.
 * It includes fields like name, value, page, ambiguous, code, source, and explanation.
 * This interface is used to define the structure of secrets in the metadata system.
 */
export interface Secret {
  name: string;
  value: string;
  page?: string;
  ambiguous?: string;
  code?: string;
  source: string;
  explanation: string;
}

/**
 * ChainRecord represents a record in a chain of metadata.
 * It includes fields like title, aspect, role, required, explanation,
 * and optional fields for source, query, page, and code.
 * This interface is used to define the structure of chain records in the metadata system.
 */
export interface ChainRecord {
  title: string;
  aspect: string;
  role: string;
  required: string;
  explanation: string;
  source?: string;
  query?: string;
  page?: string;
  code?: string;
}

/**
 * LegalRecordElement represents an individual element in a legal record.
 * It includes fields like name, aspect, value, explanation, and an optional ambiguous field.
 * This interface is used to define the structure of elements in a legal record.
 */
export interface LegalRecordElement {
  name: string;
  aspect: string;
  value: string;
  explanation: string;
  ambiguous?: string;
}

/**
 * LegalRecord represents a collection of legal record elements.
 * It includes an optional code and an array of elements.
 * This interface is used to define the structure of legal records in the metadata system.
 */
export interface LegalRecord {
  code?: string;
  elements: LegalRecordElement[];
}

/**
 * ReviewData represents the data structure for review operations.
 * It includes an array of indexes that are part of the review process.
 * This interface is used to define the structure of review data in the metadata system.
 */
export interface ReviewData {
  indexes: Index[];
}

/**
 * MetaData represents the complete metadata structure for a record.
 * It includes a header, an array of secrets, indexes, optional legal records,
 * chain records, pages, fee factors, fees, funds, gaps, gap level, and anomalies.
 * This interface is used to define the overall metadata structure in the system.
 */
export interface MetaData {
  heading: MetaHeader;
  secrets: Secret[];
  indexes: Index[];
  legals?: LegalRecord[];
  chain?: ChainRecord[];
  pages?: Pages;
  fee_factors?: FeeFactor[];
  fees?: FeeItem[];
  funds?: FundItem[];
  gaps?: [string, string, string][];
  gap_level?: string;
  anomalies?: [string, string][];
}


