# Technical Brief: Precision Parts Accuracy Engine

This document outlines the database modifications and the architectural workflow required to integrate **TecAlliance (TecDoc)** fitment data with our **Local Inventory**.

## 1. Database Schema Enhancements

To enable accurate cross-checking, the internal `Product` model must be updated from its legacy "Drinks" roots to a technical "Automotive" structure.

### Proposed Fields for `Product` Table

| Field | Type | Description |
| :--- | :--- | :--- |
| `oemNumber` | `String` | The primary Original Equipment number (e.g., `04465-12610`). **Crucial for fitment.** |
| `manufacturerPartNumber` | `String` | The aftermarket brand's part number (e.g., `DB1234` for Bosch). |
| `interchangeNumbers` | `JSON/Text` | A list of other compatible part numbers for broader search results. |
| `vehicleCompatibility` | `JSON` | A cached array of Vehicle IDs (KTypes) known to fit this part. |
| `brand` | `String` | The manufacturer brand (Bosch, Denso, Toyota-Genuine). |
| `specifications` | `Text` | Technical details: thickness, diameter, material, etc. |

---

## 2. Integration Workflow: "The Accuracy Engine"

The catalog will move from a "search and guess" model to a **"Search and Verify"** model using the following logic:

### Phase A: Vehicle Identification
1.  **User Input**: User selects **Year -> Make -> Model -> Engine** (or chooses via VIN).
2.  **TecAlliance Query**: The app fetches the unique **KType ID** for that specific vehicle.

### Phase B: Fitment Lookup
3.  **TecAlliance API Call**: `getArticlesByVehicle(KTypeID)`.
    *   *Result:* Returns a massive list of all articles (parts) confirmed by the manufacturer to fit that car.
4.  **OEM Extraction**: We extract the set of `OEM Numbers` and `Article Numbers` from the TecAlliance response.

### Phase C: Inventory Cross-Check (The "Magic")
5.  **Internal Query**: `SELECT * FROM Products WHERE oemNumber IN [list] OR manufacturerPartNumber IN [list]`.
6.  **Results Merging**:
    *   **MATCH FOUND**: Display our product. Label it as 🟢 **Verified Fitment**. Show our price and stock.
    *   **NO MATCH**: Display the part metadata from TecAlliance. Label it as 🟡 **Available via Request**. Provide a "Request Quote" button for our sales team to source it.

---

## 3. Implementation Phases

### Phase 1: Data Preparation
*   Update the backend database to include the new fields.
*   Begin populating the `oemNumber` for top-selling moving parts (Brake pads, Filters, Sensors).

### Phase 2: TecAlliance Service Layer
*   Implement the `tecalliance.ts` service with a request/relay pattern.
*   Build the Vehicle Selector UI (Year/Make/Model).

### Phase 3: Integration & UI
*   Implement the "Join" logic between TecDoc and our Inventory.
*   Update the Product Grid to distinguish between "In Stock" and "Catalog Only" results.

---

## 4. Business Impact

*   **Conversion**: Users buy with confidence when they see "Guaranteed to Fit."
*   **Reduced Returns**: Eliminates the most common cause of returns (wrong part ordered).
*   **Wider Catalog**: We can display 1,000,000+ parts from TecAlliance, even if we only stock 1,000. We become the "Source" for any automotive part in Kenya.

---

> [!TIP]
> **Next Step**: I recommend we finalize the backend API's ability to search by `oemNumber` first, as this is the "bridge" between the external data and your actual warehouse inventory.
