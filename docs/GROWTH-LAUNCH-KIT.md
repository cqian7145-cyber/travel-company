# China, closer · Growth Launch Kit & Week 4 Decision Matrix

> Live site: `https://china-closer.xizimist.com`  
> Founder funnel view: `https://china-closer.xizimist.com/?analytics=1`  
> Centralized affiliate config: `shared/monetization.mjs`

---

## 1. Ready-to-Post Reddit Launch Copy

### Post A — `r/chinatravel` (Tool-first, zero promo tone)
**Title:** Built a free, offline-ready China arrival & Chinese phrase kit (PEK/PKX/PVG/SHA/CAN airports, Alipay SOS, 24 allergy/taxi cards) — works in airplane mode, no login

**Body:**
> Kept seeing first-time travelers ask the same 4 stressful questions before flying to Beijing, Shanghai, or Guangzhou:
> 1. What if I land after midnight when the Airport Express / Metro is closed?
> 2. What if Alipay declines my Visa/Mastercard at a shop or I can’t get a 3DS SMS code on my data-only eSIM?
> 3. How do I show a taxi driver my exact Chinese hotel address or explain a severe peanut/nut/gluten allergy clearly (including cooking oils & shared woks)?
>
> I put together a lightweight web kit to keep all of that offline in one place (no account, no ads, works without VPN):
> - **First 90 Minutes (`https://china-closer.xizimist.com/arrival`)**: Terminal-by-terminal plans for Beijing (PEK/PKX), Shanghai (PVG/SHA), and Guangzhou (CAN)
> - **Speak Local (`https://china-closer.xizimist.com/speak`)**: 24 full-screen Chinese cards (auto-inserts your hotel address + cross-contact allergy cards)
> - **China SOS (`https://china-closer.xizimist.com/sos`)**: Step-by-step troubleshooting when Alipay, SMS, or mobile data breaks
> - **BSG AI Trip Planner (`https://china-closer.xizimist.com/trip`)**: Beijing, Shanghai & Guangzhou itineraries with one-click standalone offline `.html` survival pack export
>
> Would love brutal feedback from anyone currently in China or flying out soon—what’s missing or confusing?

---

## 2. Three 20-Second Short-Video Scripts (TikTok / Reels / YouTube Shorts)

1. **Hook (0–3s):** *"Landing in Shanghai or Beijing after midnight with zero Chinese?"*  
   **Demo (3–15s):** Show phone in Airplane Mode → open saved `China, closer` → tap **First 90 Minutes** → tap **Show Driver** full-screen Chinese hotel card.  
   **CTA (15–20s):** *"Free, no login—save the offline HTML pack before you board at china-closer.xizimist.com."*

2. **Hook (0–3s):** *"Why a Google Translate ‘No Peanuts’ screenshot isn’t safe in China."*  
   **Demo (3–15s):** Show `Speak Local` Peanut Allergy card highlighting **食材和酱料 (sauces/oils)** + **交叉接触 (shared wok cross-contact)** in giant Chinese text.  
   **CTA (15–20s):** *"24 free offline Chinese cards at china-closer.xizimist.com/speak."*

3. **Hook (0–3s):** *"Alipay just declined your foreign card at the counter—don’t tap pay 5 times."*  
   **Demo (3–15s):** Show `/guides/alipay-foreign-card-failed-fix` & `China SOS` 6-step checklist (merchant vs. personal QR, home-SIM 3DS SMS check, backup WeChat rail).  
   **CTA (15–20s):** *"Bookmark `/sos` offline before your flight."*

---

## 3. Affiliate Onboarding Checklist (5-Minute Swap)
Once approved on each network, paste your tracking URLs into **`shared/monetization.mjs`**:
- **Trip.com Affiliate (`Trip.com Partners`)**: Replace `esimTrip.url` & `railTrip.url` (high conversion on China high-speed trains + eSIMs).
- **Airalo Partners / Impact**: Replace `esimAiralo.url`.
- **Klook Affiliate**: Replace `klookShanghai.url`.

---

## 4. Week 4 Data Review & Double-Down Decision Matrix

Check **Cloudflare Web Analytics** + **Cloudflare Workers Logs (`type: "funnel_event"`)** + **Google Search Console** after 14 days:

| Signal Observed | Primary Bet for Month 2 (80% Focus) |
| --- | --- |
| `/arrival`, `/connectivity`, and `/guides/*airport*` drive >50% of entries & `partner_link_clicked:esim-*` CTR > 4% | **Scale the Airport & Connectivity Engine**: Add Chengdu (TFU), Shenzhen (SZX), Xi'an (XIY), Hangzhou (HGH) arrival cards + top-of-page eSIM comparison table. |
| `/trip` (`ai_plan_generated`) + `offline_html_downloaded` has highest engagement & `human-double-check` receives inquiries | **Monetize Custom Survival Packs**: Introduce a $6.99 Stripe Checkout for a multi-city (Beijing→Xi'an→Shanghai) personalized PDF + offline HTML bundle, or $39 async human itinerary audit. |
| `/guides/china-food-allergy-card-printable` or `/speak` ranks top-10 on Google GSC | **Expand Printable Niche Cards**: Add dedicated SEO pages for Celiac/Gluten-Free China, Vegetarian/Halal China, and Hospital/Pharmacy Chinese cards. |
