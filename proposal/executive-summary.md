# Executive Summary

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Your Firm Name]
**Date:** April 28, 2026

---

## Situation

Meridian Components operates a Vue/Python inventory dashboard across three warehouses. The previous vendor left the engagement with:

- A Reports module with unresolved defects
- No automated test coverage (blocking IT approval of any changes)
- No Restocking capability (the primary operations ask)
- Incomplete architecture documentation
- A partial, undocumented migration from older frontend patterns

## Our Proposal

We will deliver a complete, documented, and tested system in **8 weeks from contract execution** under a fixed-fee, not-to-exceed arrangement.

## Scope at a Glance

| # | Item | Type | Our Commitment |
|---|------|------|----------------|
| R1 | Reports module remediation | Required | Full audit + resolution of all defects |
| R2 | Restocking recommendations view | Required | New feature, delivered and tested |
| R3 | Automated browser test coverage | Required | End-to-end tests for all critical flows |
| R4 | Architecture documentation | Required | Handoff-ready overview for Meridian IT |
| D1 | UI modernization | Desired | Visual refresh, consistent design language |
| D2 | Internationalization | Desired | Japanese support for Tokyo warehouse |
| D3 | Dark mode | Desired | Operator-selectable theme |

## Delivery Approach

We will work in dependency order:

1. **Stabilize** — Audit and fix R1 (Reports), deliver R4 (Architecture docs) as a byproduct of onboarding
2. **Unlock** — Establish R3 (automated tests) so IT can approve forward progress
3. **Build** — Deliver R2 (Restocking) on a verified, tested foundation
4. **Enhance** — D1–D3 as parallel workstreams, non-blocking to required items

## Proposed Team

| Role | Focus | Engagement weeks |
|------|-------|-----------------|
| Architect / Full-stack engineer | Technical lead, codebase onboarding, R1 (Reports), R2 (backend + API), R4 (architecture docs) | 1–8 |
| Frontend engineer | R2 (Restocking UI), D1/D2/D3 desired items | 2–8 |
| QA / test engineer | R3 (browser tests), regression coverage across R1 + R2 | 3–8 |

Two billable roles, three functions. The Architect/Full-stack engineer leads technical onboarding, owns the architecture documentation, and drives backend delivery throughout. The frontend engineer and QA engineer join in weeks 2 and 3 respectively as the work expands. Desired items (D1–D3) run in parallel with R2 and do not extend the timeline.

## Why Us

- We reviewed the existing codebase before submitting this proposal — our scope is based on what's actually there, not the previous vendor's incomplete handoff notes
- Fixed-fee with a not-to-exceed commitment; no surprise invoices
- All required items delivered before desired items begin — Meridian's priorities are our sequencing

---

*Sections that follow: Technical Approach · Timeline · Relevant Experience · Pricing*
