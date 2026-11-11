-- ============================================================
-- 015: Smart metering in Ontario — ETL, VEE, ETL vs ELT (EN + FR)
-- Proposal framing: domain mapping from large-scale data work,
-- NOT real Ontario smart-metering data. Honest disclaimer inside.
-- ============================================================

INSERT INTO blog_posts (
  title, slug, excerpt, content, title_fr, excerpt_fr, content_fr,
  category, tags, cover_image, cover_alt, cover_alt_fr, read_time, published, published_date
) VALUES (
  $md$Smart Metering in Ontario: The ETL and VEE Pipeline Behind Every kWh — A Working Proposal$md$,
  'smart-metering-etl-vee-ontario',
  $md$Every 15 minutes, millions of Ontario meters send a reading. Between the meter and the bill sits an ETL pipeline with a utility-specific name: VEE. Here is how smart metering maps to extract-transform-load, a full VEE walkthrough, ETL vs ELT — and a proposal connecting this domain to the data engineering I already do.$md$,
  $md$# Smart Metering in Ontario: The ETL and VEE Pipeline Behind Every kWh

**A note up front.** I have not worked on Ontario's Smart Metering Initiative, and nothing in this article comes from real Ontario meter data. This is a **proposal** — the smart-metering data pipeline mapped against work I have actually done: validation rules on large-scale government data, time-series forecasting, anomaly detection, and lakehouse pipelines. Same rigour, new domain. I say it plainly because a proof of transfer is only credible if the claim stays honest.

## Why smart metering is a data problem first

Ontario is one of the most metered jurisdictions in North America: roughly **4.8 million smart meters** were deployed from the mid-2000s under an **OEB** mandate. Each meter records interval energy — typically **15-minute or hourly kWh reads** — and ships them upstream through the utility's network to a system that must turn hundreds of millions of raw reads a year into a bill you can defend.

Three parties matter:

- The **LDC** (your utility) bills you and owns the local network.
- The **IESO** runs the grid and the wholesale market — and, as Ontario's **Smart Metering Entity (SME)**, operates the central **MDM/R** on behalf of the LDCs.
- The **OEB** is the regulator that mandated the meters and the rate structures that make interval data valuable: **TOU**, tiered, and **ULO**.

Between the meter and every one of those consumers of data sits a single pipeline. That pipeline is **ETL** — and its transform step has a name you will not find in a data-engineering textbook: **VEE**.

## The acronyms, defined once and kept

| Acronym | Stands for | Role in this story |
| --- | --- | --- |
| **AMI** | Advanced Metering Infrastructure | The network: meters, collectors, comms, head-end system |
| **MDM/R** | Meter Data Management and Repository | Validates, estimates, edits and stores interval reads |
| **VEE** | Validation, Estimation and Editing | The industry name for the Transform step of metering ETL |
| **IESO** | Independent Electricity System Operator | Grid and market operator; Ontario's Smart Metering Entity |
| **SME** | Smart Metering Entity | The IESO's role providing central MDM/R services to LDCs |
| **OEB** | Ontario Energy Board | The regulator behind the smart-metering mandate and rates |
| **LDC** | Local Distribution Company | Your utility — owns the local network, bills customers |
| **TOU** | Time-of-Use | Pricing that varies by time of day and season |
| **ULO** | Ultra-Low Overnight | Optional rate with a very cheap overnight window |
| **kWh** | kilowatt-hour | The billing unit — energy, not power |
| **DST** | Daylight Saving Time | Creates duplicate or missing hours in interval data |
| **NAESB** | North American Energy Standards Board | Standards for energy transaction formats (XML) |
| **CIM** | Common Information Model | Utility data-exchange standard (IEC 61968) |
| **NTL** | Non-Technical Losses | Energy delivered but never billed — theft, bypass, faults |
| **CVR** | Conservation Voltage Reduction | Lowering feeder voltage to reduce consumption |
| **DR** | Demand Response | Programs that pay customers to shift load |

## ETL in smart metering

![Ontario smart metering ETL: smart meter to AMI head-end, through VEE inside the MDM/R, to billing, IESO settlement and analytics](/images/blog/smart-metering-etl-vee-ontario.svg)

### Extract

Interval reads arrive at the **MDM/R** from **AMI head-end systems** — the collectors that talk to the meters. Each read is a small record: **meter ID, timestamp, kWh value, quality flag**. Data lands as flat files — CSV, or XML in formats like **NAESB** or **CIM** — or through API feeds. When a utility runs meters from different vendors, several head-ends feed the same MDM/R, so the extract layer normalizes whatever it receives.

### Transform — this is VEE

**Validation** flags anything that cannot be trusted: missing intervals, zero reads on an active meter, negative consumption, spikes beyond a threshold, duplicate timestamps, and the gaps or overlaps that **DST** creates twice a year.

**Estimation** fills the gaps using the meter's own history (same hour, same day-of-week), neighbour meters, or weather-regression models. This is where forecasting enters: an estimator is a forecasting problem wearing a compliance jacket.

**Editing** applies corrections — field-crew overrides, meter swaps, multiplier adjustments — and stamps an **audit trail** so billing can trace every change from the raw read to the bill.

### Load

Clean, validated interval data lands in the MDM/R repository and flows downstream to **billing**, **IESO settlement**, **outage management** and **analytics**.

## A VEE walkthrough, step by step

![VEE walkthrough: a raw interval stream with six problems, the validate-estimate-edit decisions, and the corrected stream with audit stamps](/images/blog/vee-walkthrough.svg)

Take meter **MTR-004712** in Ottawa on **2 November 2025** — the DST fall-back day, so the 01:00 hour happens twice. The raw stream arrives with six problems:

| Timestamp | Raw (kWh) | What VEE sees | Action |
| --- | --- | --- | --- |
| 01:00 EDT | 0.88 | duplicate hour (DST) | **Edit** — merge with the 01:00 EST read, sum **1.71**, stamp the audit trail |
| 01:00 EST | 0.83 | duplicate hour (DST) | merged with the row above |
| 04:00 | 0.62 | clean | pass |
| 06:00 | — | missing interval | **Estimate** — same-hour, same-day profile: **0.91** |
| 09:00 | 0.00 | zero on an active meter | **Validate** → flag; estimate **1.02** from the profile |
| 13:00 | −1.24 | negative consumption | flag; correct to **0.00** |
| 17:00 | 42.10 | spike (profile ≈ 1.0) | flag; cap at 3× the profile: **3.12** |

Every correction carries an audit line, something like:

`MTR-004712 | 2025-11-02T06:00 | ESTIMATED (profile) | rule v4.2 | 0.91 kWh`

That single line is the whole trust model of metering: **a bill is only as defensible as the audit trail behind every corrected read.**

## ETL vs ELT — which one is smart metering?

![ETL vs ELT: transform before load in the MDM/R, transform after load in the analytics lakehouse](/images/blog/etl-vs-elt.svg)

| | **ETL** | **ELT** |
| --- | --- | --- |
| Transform happens | **before** load | **after** load |
| Best when | the destination is strict (billing), the schema is known, every step must be auditable | storage is cheap, questions evolve, schemas change faster than pipelines |
| In metering | the **MDM/R edge** — nothing unvalidated may touch a bill | the **analytics lakehouse** — raw intervals landed first, transformed later |

Smart metering uses **both, in layers**. The MDM/R is classic ETL: validate before the data can touch billing. But the analytics side is increasingly ELT — land the raw intervals in a lakehouse and transform them later with **Delta Lake** and Spark, where storage is cheap and the questions change faster than the schemas.

## What utilities actually do with "smart data"

Once interval reads are clean, they power the actual product set:

- **Billing** — TOU and ULO rates require accurate interval data, not monthly totals.
- **Load profiling and forecasting** — aggregate consumption curves by customer class and feed demand forecasts.
- **Anomaly and loss detection** — compare billed versus delivered energy to flag **NTL**: theft, meter bypass, faulty wiring.
- **Customer segmentation** — cluster load shapes to design rate plans and **DR** programs.
- **Outage detection** — a cluster of meters going silent signals an outage faster than waiting for phone calls.
- **Conservation voltage reduction** — use real-time voltage and consumption to optimize feeder voltage (**CVR**).

## Where my experience already fits

This is the point of the article. None of the pieces are new to me; the domain is.

| Smart-metering need | Work I have already shipped |
| --- | --- |
| VEE validation rules | Ministry project: validation rules and data dictionaries across **5,000 sites** |
| Estimation & forecasting | **SARIMA/ARIMA** forecasting on utility production data (FRED, 1939–2025) |
| Anomaly detection | **XGBoost** classification — sensor fusion and behavioural detection |
| ETL at interval scale | **Databricks** lakehouse: Delta Lake, Unity Catalog, Workflows, Model Serving |
| Reporting to stakeholders | Live **Streamlit** dashboards and Supabase-backed platforms |

In interview terms, that is one honest paragraph:

> "My ETL experience maps directly: at the Ministry I built validation rules and data dictionaries for data from 5,000 sites — that is the same discipline as VEE on meter data. My SARIMA forecasting on utility production data is the estimation piece. And I have built end-to-end pipelines on Databricks with Delta Lake, which handles the scale of interval data."

## The honest part, repeated

I have not operated Ontario's MDM/R, and this article is not a claim that I have. It is a **proof of concept of transfer**: the same validation rigour, the same forecasting and anomaly tooling, the same pipeline discipline — pointed at a domain where every 15-minute read must survive an audit.

If your utility or energy team needs someone who already thinks in VEE, ETL and lakehouses, [let's talk](/Contact).$md$,
  $md$Comptage intelligent en Ontario : le pipeline ETL et VEE derrière chaque kWh — une proposition de travail$md$,
  $md$Toutes les 15 minutes, des millions de compteurs ontariens envoient une lecture. Entre le compteur et la facture se trouve un pipeline ETL au nom propre au secteur : VEE. Voici comment le comptage intelligent se traduit en extraction-transformation-chargement, un exemple VEE complet, ETL vs ELT — et une proposition reliant ce domaine au travail de données que je fais déjà.$md$,
  $md$# Comptage intelligent en Ontario : le pipeline ETL et VEE derrière chaque kWh

**Une précision d'abord.** Je n'ai pas travaillé sur l'initiative de comptage intelligent de l'Ontario, et rien dans cet article ne provient de données réelles de compteurs ontariens. Ceci est une **proposition** : le pipeline de données du comptage intelligent mis en regard d'un travail que j'ai réellement réalisé — règles de validation sur des données gouvernementales à grande échelle, prévision de séries temporelles, détection d'anomalies et pipelines lakehouse. Même rigueur, nouveau domaine. Je le dis clairement, car une preuve de transférabilité n'est crédible que si la revendication reste honnête.

## Pourquoi le comptage intelligent est d'abord un problème de données

L'Ontario est l'un des territoires les plus équipés d'Amérique du Nord : environ **4,8 millions de compteurs intelligents** ont été déployés à partir du milieu des années 2000 sous un mandat de la **OEB** (Commission de l'énergie de l'Ontario). Chaque compteur enregistre l'énergie par intervalles — généralement des lectures **kWh de 15 minutes ou horaires** — et les envoie en amont, à travers le réseau du service public, vers un système qui doit transformer des centaines de millions de lectures brutes par an en une facture défendable.

Trois acteurs comptent ici :

- La **LDC** (votre service public local) vous facture et possède le réseau de distribution.
- La **IESO** exploite le réseau et le marché de gros — et, en tant qu'**entité de comptage intelligent (SME)** de l'Ontario, opère le **MDM/R** central pour le compte des LDC.
- La **OEB** est le régulateur à l'origine du mandat de comptage et des structures tarifaires qui rendent les données d'intervalles précieuses : **TOU**, tarification par paliers et **ULO**.

Entre le compteur et chacun de ces consommateurs de données se trouve un seul pipeline. Ce pipeline, c'est de l'**ETL** — et son étape de transformation porte un nom qu'on ne trouve pas dans les manuels de data engineering : **VEE**.

## Les sigles, définis une fois pour toutes

| Sigle | Signification | Rôle dans cette histoire |
| --- | --- | --- |
| **AMI** | Advanced Metering Infrastructure | Le réseau : compteurs, concentrateurs, communications, système de tête (head-end) |
| **MDM/R** | Meter Data Management and Repository | Valide, estime, corrige et stocke les lectures d'intervalles |
| **VEE** | Validation, Estimation and Editing | Le nom sectoriel de l'étape Transform de l'ETL de comptage |
| **IESO** | Independent Electricity System Operator | Exploitant du réseau et du marché ; entité de comptage intelligent de l'Ontario |
| **SME** | Smart Metering Entity | Le rôle de la IESO qui fournit le MDM/R central aux LDC |
| **OEB** | Ontario Energy Board | Le régulateur derrière le mandat de comptage intelligent et les tarifs |
| **LDC** | Local Distribution Company | Votre service public — possède le réseau local, facture les clients |
| **TOU** | Time-of-Use | Tarification selon l'heure et la saison |
| **ULO** | Ultra-Low Overnight | Tarif optionnel avec une fenêtre nocturne très bon marché |
| **kWh** | kilowattheure | L'unité de facturation — de l'énergie, pas de la puissance |
| **DST** | Daylight Saving Time | Crée des heures en double ou manquantes dans les données d'intervalles |
| **NAESB** | North American Energy Standards Board | Organisme de normalisation des formats de transactions énergétiques (XML) |
| **CIM** | Common Information Model | Norme d'échange de données des services publics (CEI 61968) |
| **NTL** | Non-Technical Losses | Énergie livrée mais jamais facturée — vol, contournement, défauts |
| **CVR** | Conservation Voltage Reduction | Baisse de la tension des départs pour réduire la consommation |
| **DR** | Demand Response | Programmes qui rémunèrent les clients pour déplacer leur charge |

## L'ETL dans le comptage intelligent

![ETL du comptage intelligent en Ontario : compteur intelligent vers le concentrateur AMI, puis VEE dans le MDM/R, vers la facturation, le règlement IESO et l'analytique](/images/blog/smart-metering-etl-vee-ontario.svg)

### Extraction

Les lectures d'intervalles arrivent au **MDM/R** depuis les **systèmes de tête AMI** — les concentrateurs qui dialoguent avec les compteurs. Chaque lecture est un petit enregistrement : **identifiant de compteur, horodatage, valeur kWh, indicateur de qualité**. Les données arrivent en fichiers plats — CSV, ou XML aux formats **NAESB** ou **CIM** — ou par flux API. Quand un service public exploite des compteurs de plusieurs fournisseurs, plusieurs têtes alimentent le même MDM/R : la couche d'extraction normalise donc tout ce qu'elle reçoit.

### Transformation — c'est la VEE

**Validation** : signaler tout ce qui ne peut pas être cru — intervalles manquants, lectures nulles sur un compteur actif, consommations négatives, pics au-delà d'un seuil, horodatages en double, et les trous ou chevauchements créés deux fois par an par l'heure d'été (**DST**).

**Estimation** : combler les manques avec l'historique du compteur (même heure, même jour de semaine), les compteurs voisins, ou des modèles de régression météo. C'est ici que la prévision entre en jeu : un estimateur est un problème de prévision qui porte une jaquette de conformité.

**Édition** : appliquer les corrections — interventions de terrain, remplacements de compteurs, ajustements de multiplicateur — et apposer une **piste d'audit** pour que la facturation puisse retracer chaque changement, de la lecture brute à la facture.

### Chargement

Les données d'intervalles propres et validées atterrissent dans le référentiel MDM/R et descendent vers la **facturation**, le **règlement IESO**, la **gestion des pannes** et l'**analytique**.

## Un exemple VEE, étape par étape

![Exemple VEE : un flux d'intervalles brut avec six problèmes, les décisions valider-estimer-corriger, et le flux corrigé avec pistes d'audit](/images/blog/vee-walkthrough.svg)

Prenons le compteur **MTR-004712** à Ottawa le **2 novembre 2025** — le jour du retour à l'heure normale, où l'heure de 01:00 se produit deux fois. Le flux brut arrive avec six problèmes :

| Horodatage | Brut (kWh) | Ce que VEE voit | Action |
| --- | --- | --- | --- |
| 01:00 HAE | 0,88 | heure en double (DST) | **Éditer** — fusionner avec la lecture de 01:00 HNE, total **1,71**, tamponner la piste d'audit |
| 01:00 HNE | 0,83 | heure en double (DST) | fusionnée avec la ligne ci-dessus |
| 04:00 | 0,62 | propre | passer |
| 06:00 | — | intervalle manquant | **Estimer** — profil même heure, même jour : **0,91** |
| 09:00 | 0,00 | zéro sur compteur actif | **Valider** → signaler ; estimer **1,02** depuis le profil |
| 13:00 | −1,24 | consommation négative | signaler ; corriger à **0,00** |
| 17:00 | 42,10 | pic (profil ≈ 1,0) | signaler ; plafonner à 3× le profil : **3,12** |

Chaque correction porte une ligne d'audit, du genre :

`MTR-004712 | 2025-11-02T06:00 | ESTIMÉ (profil) | règle v4.2 | 0,91 kWh`

Cette seule ligne résume tout le modèle de confiance du comptage : **une facture n'est défendable qu'à hauteur de la piste d'audit derrière chaque lecture corrigée.**

## ETL vs ELT — lequel est le comptage intelligent ?

![ETL vs ELT : transformation avant chargement dans le MDM/R, transformation après chargement dans le lakehouse analytique](/images/blog/etl-vs-elt.svg)

| | **ETL** | **ELT** |
| --- | --- | --- |
| La transformation a lieu | **avant** le chargement | **après** le chargement |
| Idéal quand | la destination est stricte (facturation), le schéma est connu, chaque étape doit être auditable | le stockage est bon marché, les questions évoluent, les schémas changent plus vite que les pipelines |
| Dans le comptage | le **bord MDM/R** — rien de non validé ne doit toucher une facture | le **lakehouse analytique** — intervalles bruts chargés d'abord, transformés ensuite |

Le comptage intelligent utilise **les deux, par couches**. Le MDM/R est de l'ETL classique : valider avant que les données ne touchent la facturation. Mais le versant analytique est de plus en plus de l'ELT — déposer les intervalles bruts dans un lakehouse et les transformer plus tard avec **Delta Lake** et Spark, là où le stockage est bon marché et où les questions changent plus vite que les schémas.

## Ce que les services publics font vraiment de la « donnée intelligente »

Une fois les lectures propres, elles alimentent le vrai catalogue de produits :

- **Facturation** — les tarifs TOU et ULO exigent des données d'intervalles exactes, pas des totaux mensuels.
- **Profilage de charge et prévision** — agréger les courbes de consommation par catégorie de client et alimenter les prévisions de demande.
- **Détection d'anomalies et de pertes** — comparer l'énergie facturée à l'énergie livrée pour signaler les **NTL** : vol, contournement, câblage défectueux.
- **Segmentation des clients** — regrouper les formes de charge pour concevoir des plans tarifaires et des programmes **DR**.
- **Détection de pannes** — un groupe de compteurs qui se tait signale une panne plus vite que les appels téléphoniques.
- **Réduction de tension de conservation** — utiliser tension et consommation en temps réel pour optimiser les départs (**CVR**).

## Où mon expérience s'insère déjà

C'est tout l'objet de cet article. Aucune des pièces ne m'est nouvelle ; c'est le domaine qui l'est.

| Besoin du comptage intelligent | Travail que j'ai déjà livré |
| --- | --- |
| Règles de validation VEE | Projet au Ministère : règles de validation et dictionnaires de données sur **5 000 sites** |
| Estimation et prévision | Prévision **SARIMA/ARIMA** sur des données de production d'énergie (FRED, 1939–2025) |
| Détection d'anomalies | Classification **XGBoost** — fusion de capteurs et détection comportementale |
| ETL à l'échelle des intervalles | Lakehouse **Databricks** : Delta Lake, Unity Catalog, Workflows, Model Serving |
| Reporting aux parties prenantes | Tableaux de bord **Streamlit** en direct et plateformes Supabase |

En entretien, cela tient en un paragraphe honnête :

> « Mon expérience ETL se transpose directement : au Ministère, j'ai construit des règles de validation et des dictionnaires de données pour 5 000 sites — c'est exactement la discipline de la VEE sur données de comptage. Ma prévision SARIMA sur des données de production d'énergie, c'est la pièce d'estimation. Et j'ai construit des pipelines de bout en bout sur Databricks avec Delta Lake, ce qui gère l'échelle des données d'intervalles. »

## La partie honnête, répétée

Je n'ai pas opéré le MDM/R de l'Ontario, et cet article ne prétend pas que je l'ai fait. C'est une **preuve de concept de transfert** : la même rigueur de validation, les mêmes outils de prévision et de détection d'anomalies, la même discipline de pipeline — pointés vers un domaine où chaque lecture de 15 minutes doit survivre à un audit.

Si votre équipe énergie ou service public cherche quelqu'un qui pense déjà en VEE, ETL et lakehouses, [parlons-en](/Contact).$md$,
  'Industry Insights',
  ARRAY['Smart Metering', 'ETL', 'VEE', 'Ontario', 'Data Engineering', 'MDM/R'],
  '/images/blog/smart-metering-etl-vee-ontario.svg',
  'Ontario smart metering ETL diagram: smart meter to AMI head-end, through VEE inside the MDM/R, to billing, IESO settlement and analytics',
  'Diagramme ETL du comptage intelligent en Ontario : compteur intelligent vers le concentrateur AMI, puis VEE dans le MDM/R, vers la facturation, le règlement IESO et l''analytique',
  11, true, DATE '2026-11-11'
);
