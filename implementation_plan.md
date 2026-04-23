# Master Implementation Plan: Precision Parts Kenya

This master plan outlines the transformation of the platform into a high-precision automotive marketplace. The goal is to move from a standard shop to a "Fitment-First" engine that guarantees parts accuracy for Kenyan drivers and mechanics.

## 🏁 Phase 1: The Accuracy Foundation (Database & Schema)
Before we can link to global catalogs, our internal data must speak the same language as the car manufacturers.

### 1.1 Database Migration
*   **Update Schema**: Add `oemNumber`, `manufacturerPartNumber`, and `fitmentKTypes` to the `Product` model.
*   **Data Sanitization**: Clean up legacy drink-related fields and map current inventory to these new technical fields.
*   **Key File**: [api.ts](file:///c:/Users/Benjamin%20Okwama/Documents/CLS2026/drinks_client/src/services/api.ts) (Internal Interface updates).

---

## 🚀 Phase 2: The "Accuracy Engine" (TecAlliance Integration)
This is the core feature where external automotive data meets our local stock.

### 2.1 TecAlliance Service Layer
*   **Implementation**: Build a service to query the **TecDoc OneDB API**.
*   **Search by Vehicle**: Create UI workflows for Year -> Make -> Model -> Engine selection.
*   **Cross-Check Logic**:
    1.  Fetch compatibility list from TecDoc.
    2.  Filter local inventory by OEM/Part numbers.
    3.  Display merged results: **In Stock** vs. **Available via Request**.

---

## 👤 Phase 3: Personalization & "My Garage"
Moving from a search-driven site to a vehicle-driven site.

### 3.1 "My Garage" Management
*   **Vehicle Profiles**: Allow logged-in users to save multiple vehicles to their account.
*   **Persistent Filtering**: When a vehicle is "active" in the garage, the entire catalog automatically filters and shows "Verified Fit" badges on all parts.
*   **VIN Integration**: Integrate a VIN Decoding API (e.g., CarsXE) for instant vehicle identification.

---

## 💼 Phase 4: B2B & Local Market Optimization
Tools designed specifically for the Kenyan market and its primary buyers (Mechanics/Fleets).

### 4.1 Mechanic / Garage Portal
*   **Quote Generator**: A specialized checkout mode where a mechanic can generate a PDF/WhatsApp quote for their client with a custom markup.
*   **Wholesale Tiers**: Implement automated pricing for verified B2B partners.

### 4.2 WhatsApp "Logbook" Assistant
*   **Photo Identification**: A dedicated UI flow that helps users send photos of their NTSA logbook or specific part stamps directly to our sales team for 100% accuracy.

---

## 🎯 Verification & Success Metrics

### Automated Verification
*   Unit tests for the **Cross-Check Engine** (joining TecDoc data with Local DB).
*   Mocked TecAlliance API tests to ensure the vehicle selector works without hitting real API limits during dev.

### Manual Verification
*   **Scenario**: Search for "Brake Pads" for a "Toyota Fielder."
*   **Success**: The system must identify the correct OEM number and tell the user if it exists in our local warehouse or needs a special order.

---

## Open Questions

> [!CAUTION]
> **TecDoc Credentials**: We need to move from the "Mock" structure to real API keys.
> **Data Population**: How many of your top products currently have OEM numbers recorded? (This is the "bridge" that makes Phase 2 work).

**Do you approve this Master Plan as our roadmap for the next sprints?**
