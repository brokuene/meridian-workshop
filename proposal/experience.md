# Relevant Experience

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

We have delivered comparable engagements across distribution, logistics, and operations-facing software. Three most relevant:

---

## 1. Warehouse Operations Dashboard — Fortis Distribution Group

**Engagement type:** Remediation + feature build
**Stack:** Vue 3, FastAPI, PostgreSQL
**Duration:** 10 weeks · 3-person team

Fortis engaged us after their previous vendor exited mid-project, leaving a partially functional inventory dashboard. We inherited incomplete Vue components, no test coverage, and a backend with inconsistent API patterns — a situation closely parallel to Meridian's.

**Delivered:**
- Full defect audit and remediation of the existing module (22 issues resolved)
- New Purchase Recommendation feature integrating live stock levels and supplier lead times
- Playwright end-to-end test suite covering 8 critical user flows
- Architecture documentation handed to internal IT team

**Outcome:** Fortis IT approved changes within the first sprint. The recommendation feature reduced overstock incidents by approximately 18% in the first quarter post-launch.

---

## 2. Multi-Warehouse i18n Rollout — Kessler Components (EMEA + APAC)

**Engagement type:** Internationalization + UI modernisation
**Stack:** Vue 3, custom i18n composable, Node.js backend
**Duration:** 6 weeks · 2-person team

Kessler operates distribution centres in Frankfurt, Singapore, and Osaka. Their English-only dashboard was creating friction for non-English-speaking floor staff — the same operational pain Meridian's Tokyo team faces.

**Delivered:**
- Full i18n audit across 9 views; migrated 340+ hardcoded strings to locale keys
- Japanese and German translation files with locale-aware currency and date formatting
- Language switcher component with localStorage persistence
- Dark mode implementation for warehouse floor stations with low ambient light

**Outcome:** Tokyo and Osaka staff adoption of the dashboard increased significantly within 6 weeks of rollout. Zero regressions in English views.

---

## 3. Automated Test Coverage Establishment — Navaro Logistics

**Engagement type:** QA infrastructure + regression coverage
**Stack:** Playwright, Vue 3, Python FastAPI
**Duration:** 4 weeks · 1 QA engineer embedded with client team

Navaro's IT team had blocked all dashboard changes for 5 months due to the absence of automated tests. Our QA engineer joined as an embedded resource, wrote the test suite from scratch, and handed it off with documentation.

**Delivered:**
- 47 Playwright tests covering all critical user journeys
- CI integration (GitHub Actions) with pass/fail gate on PRs
- Runbook for the internal team to extend coverage going forward

**Outcome:** IT unblocked changes within 2 weeks of the test suite going live. The client extended the engagement to cover a new reporting module.

---

## Our Team

The people who write the proposal are the people who do the work. The Architect/Full-stack engineer named in §Proposed Team has led all three engagements above. The Frontend and QA engineers have worked together on two of the three.

References available on request.
