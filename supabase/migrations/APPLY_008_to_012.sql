-- Combined migrations 008-012 for the Supabase SQL Editor.
-- Generated 2026-09-25. Run once, top to bottom.
-- Safe to re-run: inserts use ON CONFLICT DO NOTHING and DDL uses IF NOT EXISTS.

-- ============================================================
-- >>> 008_update_agent_post.sql
-- ============================================================
-- ============================================================
-- 008: Update the AI agent post — cache-first rate limiting,
--      Groq → NVIDIA NIM failover, retired-model recovery, diagrams
-- ============================================================

UPDATE blog_posts SET
  excerpt = $md$My live AI agent broke in production this week, and the model was not the problem: the provider retired it and my code swallowed the error. Here is how I rebuilt it for the failures that actually happen in 2026 — rate limits, retired models and provider outages — with cache-first rate limiting, Groq → NVIDIA NIM failover and a deterministic backstop, still at $0/month.$md$,
  read_time = 10,
  tags = ARRAY['LangGraph', 'AI Agents', 'Serverless', 'Supabase', 'Rate Limiting', 'LLM Failover', 'Groq', 'NVIDIA NIM'],
  updated_at = now(),
  content = $md$# How I Shipped a Production AI Agent on Serverless

Everyone demos agents. Almost nobody ships one that strangers can use, that never breaks, and that costs $0/month.

I shipped one. It lives on my portfolio, on the [Sandbox page](/Sandbox). You can point it at any public GitHub repository and watch a real agent pipeline run: cache check → rate limit → repo fetch → structural analysis → LLM synthesis. This post is about the unglamorous 80% — the decisions that separate a demo from something you can put in front of clients.

And this week, it taught me the most important lesson of all.

## It broke — and the model was not the problem

I clicked **Analyze** on my own site and got a report without the AI summary. No error page, no crash: the deterministic fallback did its job. But the LLM had silently stopped working.

The cause took minutes to find once I could see it, and it had nothing to do with prompts or model quality. My provider had **retired the model** my code was pinned to. Every call came back `404 model_not_found`, and a bare `catch {}` swallowed it.

That is exactly what the industry data says. Datadog's *State of AI Engineering* report (July 2026) found that teams are quick to test new models but "slower to retire older models already running in production" — and providers are not waiting for them. If your agent hard-codes a model name, it has an expiry date you do not control.

## The architecture

The whole thing runs on **Supabase Edge Functions** (Deno), orchestrated by **LangGraph.js**. The graph now has six nodes:

![The agent graph: checkCache, rateLimit, fetchRepo, analyze, synthesize, saveCache. Only synthesize calls an LLM.](/images/blog/agent-serverless/pipeline.svg)

Five of the six steps are plain code. Only one calls an LLM. That ratio is deliberate:

1. **checkCache** — a 24-hour cache in Postgres. Repeated analyses cost nothing and return in about 0.6 s.
2. **rateLimit** — a per-IP limit, applied only to fresh runs (more on this below).
3. **fetchRepo** — four parallel GitHub API calls: metadata, languages, README, file tree.
4. **analyzeStructure** — pure code: language distribution, dependency files and quality signals (tests? CI? license? docs? lockfiles?). Zero tokens.
5. **synthesizeReport** — the only LLM call, with a two-provider failover.
6. **saveCache** — stores AI reports only, so a fallback report is never pinned for 24 hours.

Because only one node needs an LLM, the system is fast (about 2.5 s for a fresh AI report), cheap and resilient — the three properties demos rarely have.

## Rate limits are the real failure mode

Here is the number that changed how I think about agents in production:

![Datadog, State of AI Engineering 2026: in February 2026, 5% of LLM calls returned an error and 60% of those errors were rate limits.](/images/blog/agent-serverless/rate-limit-errors.svg)

In February 2026, Datadog saw 5% of all LLM call spans return an error, and **60% of those errors were caused by exceeded rate limits** — the provider saying "too many requests".

Rate limits bite you from two sides. Upstream, your provider throttles you. Downstream, your own public endpoint needs a limit, or one bot can burn your whole free quota.

My first version got the downstream side wrong. I capped visitors at 3 runs per hour and checked the limit *before* the cache — so re-opening a report that was already cached, which costs nothing, still used up one of your three tries. I hit my own limit while testing.

The fix is one of those small ideas that matters a lot: **check the cheap thing first.**

![Cache-first rate limiting: cache hits return immediately and are not counted; only fresh runs go through the limiter.](/images/blog/agent-serverless/cache-first-rate-limit.svg)

- Cache hits are served before the limiter and never count.
- Only fresh runs, the ones that spend GitHub and LLM quota, count toward the limit.
- The limit is now **10 fresh runs per hour per IP**, and it is a setting (`RATE_LIMIT_PER_HOUR`), not a constant — I can tune it from the dashboard without redeploying.

In LangGraph terms, the rate limiter simply became a node *after* `checkCache`. The graph shape does the policy work.

## Two providers, zero lock-in

The post-mortem left me with two rules: never depend on one provider, and never depend on one model name.

![LLM failover chain: Groq first, then NVIDIA NIM, then a deterministic structural report. A retired model triggers a lookup of available models and one retry.](/images/blog/agent-serverless/llm-failover.svg)

1. **Groq is the primary** — fast, with a free tier that resets daily.
2. **NVIDIA NIM is the backup**, running on free credits. It is only called when Groq fails, so the credits last.
3. **The deterministic structural report is the backstop.** If both providers are down, the visitor still gets a useful report — never an error page.

On top of that, each provider recovers from retired models on its own: on a `404`, the agent asks the provider for its current model list, picks the next available model from a preference list and retries once. The model name in my config became a *preference*, not a single point of failure.

This matches what practitioners are converging on. As a recent piece on provider outages put it: "Tiered fallback chain is the most resilient. Primary, secondary, and a self-hosted or open-weight model as a final backstop" — and for most teams, "dual-provider active-passive is the right place to start." It is also where the market already is: Datadog reports that more than 70% of organizations now use three or more models.

## Observability is not optional

The fallback made the outage invisible to visitors — which is good — but it also made it invisible to *me*, which is not. My `catch {}` blocks were so polite that they hid a total LLM failure.

Now every failed call logs the provider, the HTTP status and the first part of the error body (never the key). The retired model showed up in the logs as a one-line explanation:

```
llm http error 404 {"error":{"message":"The model `llama-3.3-70b-versatile` does not exist ..."}}
```

That is the part of the "agents in production" debate I now agree with most: "Most production AI agents don't fail because the model is bad. They fail because the infrastructure around them is invisible." Graceful degradation without logging just means you find out last.

## The decisions nobody writes about

**The demo must never break publicly.** Any LLM failure degrades to the deterministic report. A visitor should never see "internal error" because of a vendor.

**Abuse is a design constraint.** Strict `owner/repo` validation, a per-IP limit on fresh runs, CORS locked to my domain, and JWT verification so only my site's anon key can call the function.

**Caching is a cost feature — and now a rate-limit feature.** Cached reports are free, instant and never counted, so real visitors almost never hit the limit.

**Configuration beats constants.** The model, the providers and the rate limit are all secrets I can change in the dashboard. The next model retirement is a settings change, not an incident.

**Traceability is a feature.** The function returns real per-step timings and the UI renders them as an agent trace. Visitors don't just read a report — they watch the pipeline run.

## What this taught me

1. **Shrink the scope until it ships.** One real graph is worth more than five planned sub-agents.
2. **Deterministic steps are underrated.** Most of what makes an agent useful is plain code with good structure.
3. **Rate limits are the main production failure mode.** Design for them on both sides: cache first, count only what costs money.
4. **Model names expire.** Treat them as preferences, and let the agent discover what is available.
5. **Two providers plus plain code** beats any single model's uptime.
6. **Fallbacks without logs hide outages.** Degrade gracefully, and log loudly.
7. **Serverless + free-tier LLMs is a legitimate production stack** for agent pipelines with caching — still at $0/month.

## Try it

Head to the [Sandbox page](/Sandbox), pick one of my repositories or paste any public repo. Watch the trace, then run the same repo again — the second run is instant, comes from the cache, and doesn't count toward your limit.

The code is on [GitHub](https://github.com/womgaalbert). If you want this kind of system for your own product — an AI pipeline with real guardrails, failover and observability — [let's talk](/Contact).

---

**Sources**

- Datadog, [State of AI Engineering](https://www.datadoghq.com/state-of-ai-engineering/) (July 2026)
- Chanl, [When your LLM provider goes down, your agent shouldn't](https://www.channel.tel/blog/llm-provider-failover-agent-reliability) (June 2026)
- Hadil Ben Abdallah, [Why AI Agents Fail in Production (And How Engineering Teams Are Fixing It in 2026)](https://dev.to/hadil/why-ai-agents-fail-in-production-and-how-engineering-teams-are-fixing-it-in-2026-job) (June 2026)
$md$
WHERE slug = 'production-ai-agent-serverless';

-- ============================================================
-- >>> 009_blog_i18n.sql
-- ============================================================
-- ============================================================
-- 009: French versions of blog posts
-- ============================================================
-- Nullable: the English columns remain the fallback when a
-- translation is missing (see localizePost in src/lib/blog.js).

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_fr     TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt_fr   TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_fr   TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_alt_fr TEXT;

-- ============================================================
-- >>> 010_blog_fr_existing.sql
-- ============================================================
-- ============================================================
-- 010: French translations of the existing blog posts
-- ============================================================
-- Code blocks, tables and metric names stay as-is; prose is
-- written as natural French rather than translated literally.

UPDATE blog_posts SET
  title_fr   = $md$Prévision de séries temporelles avec ARIMA : guide pratique$md$,
  excerpt_fr = $md$Plongée dans l'application des modèles ARIMA et SARIMA à la prévision de la demande énergétique industrielle, avec une mise en œuvre pas à pas en Python.$md$,
  content_fr = $md$# Prévision de séries temporelles avec ARIMA : guide pratique

La prévision de séries temporelles est l'une des compétences les plus précieuses dans la boîte à outils d'un data scientist. Dans ce guide, je montre comment appliquer les modèles **ARIMA (AutoRegressive Integrated Moving Average)** à la prévision de la production énergétique industrielle.

## Pourquoi ARIMA ?

Les modèles ARIMA conviennent particulièrement aux séries temporelles univariées qui présentent des motifs clairs dans le temps — tendance, saisonnalité et comportements cycliques. Ils décomposent la série en trois composantes :

- **AR (autorégressive)** : la relation entre une observation et ses valeurs retardées
- **I (intégrée)** : la différenciation qui rend la série stationnaire
- **MA (moyenne mobile)** : la relation entre une observation et les erreurs résiduelles

## Les données

Pour cette analyse, j'ai utilisé les **données de production énergétique industrielle des États-Unis (1939–2025)** issues de la base FRED (Federal Reserve Economic Data).

## À retenir

1. Les modèles ARIMA capturent des motifs temporels complexes avec un paramétrage relativement simple
2. Tester correctement la stationnarité est indispensable à la validité du modèle
3. La décomposition saisonnière révèle des motifs cachés
4. La validation glissante donne une estimation plus réaliste des performances

Cette méthodologie a fait ses preuves en prévision de la demande énergétique et s'adapte à tout domaine comportant des données temporelles.$md$,
  updated_at = now()
WHERE slug = 'time-series-forecasting-arima';

UPDATE blog_posts SET
  title_fr   = $md$Construire un classificateur de documents avec DistilBERT$md$,
  excerpt_fr = $md$Comment j'ai bâti un pipeline de classification NLP en deux étapes, combinant les embeddings DistilBERT et XGBoost pour automatiser l'acheminement de documents juridiques.$md$,
  content_fr = $md$# Construire un classificateur de documents avec DistilBERT

Le traitement de documents juridiques est un cas d'usage idéal pour l'automatisation par NLP. J'ai construit un pipeline de classification qui a réduit le temps d'acheminement des documents de **3–4 minutes à moins de 2 secondes**.

## L'architecture

J'ai conçu un **pipeline en deux étapes** :

### Étape 1 : embeddings DistilBERT
- DistilBERT affiné sur du texte du domaine juridique
- Génération d'embeddings de 768 dimensions par document

### Étape 2 : classification XGBoost
- Les embeddings DistilBERT servent de variables d'entrée
- Optimisation des hyperparamètres avec Optuna

## Résultats

| Indicateur | Avant | Après |
|--------|--------|-------|
| Temps d'acheminement | 3–4 min | < 2 s |
| Exactitude | ~85 % (humain) | 96,4 % |

## Ce que j'en retiens

1. **Deux étapes valent mieux qu'un modèle de bout en bout** : séparer l'embedding de la classification donne bien plus de contrôle
2. **L'affinage sur le domaine compte** : le modèle spécialisé a dépassé le modèle généraliste de 12 %
3. **Les seuils de confiance sont essentiels** : tout document sous 90 % de confiance part en revue humaine$md$,
  updated_at = now()
WHERE slug = 'nlp-document-classifier-distilbert';

UPDATE blog_posts SET
  title_fr   = $md$Les Transformers pour les séries temporelles : au-delà du texte$md$,
  excerpt_fr = $md$Comment les architectures Transformer — conçues à l'origine pour le NLP — peuvent être adaptées à la prévision de séries temporelles, avec des résultats impressionnants.$md$,
  content_fr = $md$# Les Transformers pour les séries temporelles : au-delà du texte

Quand on pense aux Transformers, on pense d'abord au NLP — GPT, BERT, Claude. Mais le **mécanisme d'attention** qui se trouve en leur cœur sert fondamentalement à modéliser les relations dans des données séquentielles. Or une série temporelle est aussi une séquence.

## Pourquoi des Transformers pour les séries temporelles ?

Les approches traditionnelles ont leurs limites :
- **ARIMA** peine face aux motifs non linéaires complexes
- **LSTM** souffre de la disparition du gradient sur les séquences très longues

Les Transformers répondent à cela par l'**auto-attention** : chaque pas de temps peut se rapporter directement à tous les autres.

## Adaptations de l'architecture

1. **Encodages positionnels apprenables** pour les motifs propres au domaine
2. **Masquage causal** pour empêcher toute fuite d'information future
3. **Attention multi-têtes** pour capter différents motifs temporels

## Performances

Sur les données de production énergétique américaine :
- ARIMA : MAE = 2,34
- LSTM : MAE = 1,89
- **Transformer : MAE = 1,42**

## Quand les utiliser

Ils brillent sur les longues séquences (200 pas et plus), les données non linéaires complexes, et lorsque vous disposez d'assez de données d'entraînement.$md$,
  updated_at = now()
WHERE slug = 'transformer-time-series';

UPDATE blog_posts SET
  title_fr   = $md$Pipeline MLOps : du notebook à la production$md$,
  excerpt_fr = $md$Construire un pipeline MLOps de niveau 1 avec suivi d'expériences MLflow, registre de modèles et réentraînement automatisé — les leçons d'un vrai projet de données éducatives.$md$,
  content_fr = $md$# Pipeline MLOps : du notebook à la production

Passer d'un notebook Jupyter à un pipeline de machine learning de qualité production est l'une des transitions les plus difficiles de la data science. Voici comment je m'y suis pris.

## Les niveaux de maturité MLOps

### Niveau 0 : processus manuel
- Tout vit dans des notebooks
- Aucun suivi d'expériences
- Déploiement manuel

### Niveau 1 : automatisation du pipeline
- Validation automatique des données
- Suivi d'expériences (MLflow)
- Registre de modèles
- CI/CD pour l'entraînement

## L'infrastructure clé

| Composant | Outil |
|-----------|------|
| Suivi d'expériences | MLflow |
| Registre de modèles | MLflow |
| Versionnage des données | DVC |
| Orchestration | Prefect |
| Déploiement | FastAPI + Docker |

## Ce que j'en retiens

1. **Tracez tôt** : journalisez vos expériences dès la phase notebook
2. **SMOTE est puissant mais dangereux** : séparez toujours vos jeux de données avant le rééchantillonnage
3. **Une hypothèse vaut mieux qu'une recherche exhaustive** : la connaissance du domaine guide l'exploration
4. **Docker dès le premier jour** : fini le « ça marche sur ma machine »$md$,
  updated_at = now()
WHERE slug = 'mlops-pipeline-production';

UPDATE blog_posts SET
  title_fr   = $md$Vision par ordinateur de zéro : un CNN sur CIFAR-10$md$,
  excerpt_fr = $md$Construire un réseau de neurones convolutif sans apprentissage par transfert — comprendre chaque couche, chaque décision, et dépasser 85 % d'exactitude sur CIFAR-10.$md$,
  content_fr = $md$# Vision par ordinateur de zéro : un CNN sur CIFAR-10

L'apprentissage par transfert est excellent en production, mais pour vraiment comprendre les CNN, il faut en construire un de zéro.

## Conception de l'architecture

```
Input (32x32x3)
  ↓
Conv2D(32, 3x3) → BatchNorm → ReLU → Dropout(0.25)
  ↓
Conv2D(64, 3x3) → BatchNorm → ReLU → Dropout(0.25)
  ↓
Conv2D(128, 3x3) → BatchNorm → ReLU → Dropout(0.3)
  ↓
Flatten → Dense(256) → Dropout(0.5)
  ↓
Dense(10) → Softmax
```

### Décisions de conception

1. **Noyaux 3x3** : les petits filtres captent les détails fins
2. **Canaux progressifs (32→64→128)** : les couches profondes détectent des motifs complexes
3. **BatchNorm après chaque convolution** : stabilise l'entraînement
4. **Dropout croissant** : la régularisation augmente avec la profondeur

## Résultats

| Époque | Exactitude (entraînement) | Exactitude (validation) |
|-------|-----------|--------|
| 50 | 91,2 % | 84,5 % |
| 100 | 95,8 % | **86,2 %** |

Construire de zéro m'a donné une intuition que l'apprentissage par transfert seul n'aurait jamais apportée.$md$,
  updated_at = now()
WHERE slug = 'cnn-cifar10-from-scratch';

-- ------------------------------------------------------------
-- The production AI agent post (inserted in 005, rewritten in 008)
-- ------------------------------------------------------------
UPDATE blog_posts SET
  title_fr   = $md$Comment j'ai mis un agent IA en production sur du serverless$md$,
  excerpt_fr = $md$Mon agent IA est tombé en panne cette semaine, et le modèle n'était pas en cause : le fournisseur l'avait retiré et mon code avalait l'erreur. Voici comment je l'ai reconstruit pour les pannes qui arrivent vraiment en 2026 — limites de débit, modèles retirés et pannes de fournisseur — avec un cache prioritaire, un basculement Groq → NVIDIA NIM et un repli déterministe, toujours à 0 $/mois.$md$,
  content_fr = $md$# Comment j'ai mis un agent IA en production sur du serverless

Tout le monde fait des démos d'agents. Presque personne n'en livre un que des inconnus peuvent utiliser, qui ne casse jamais, et qui coûte 0 $/mois.

Moi, si. Il vit sur mon portfolio, sur la [page Sandbox](/Sandbox). Vous pouvez le pointer vers n'importe quel dépôt GitHub public et regarder tourner un vrai pipeline agentique : vérification du cache → limite de débit → récupération du dépôt → analyse structurelle → synthèse par LLM. Cet article parle des 80 % ingrats — les décisions qui séparent une démo de quelque chose qu'on peut montrer à des clients.

Et cette semaine, il m'a donné la leçon la plus importante de toutes.

## Il est tombé en panne — et le modèle n'était pas en cause

J'ai cliqué sur **Analyser** sur mon propre site et j'ai obtenu un rapport sans résumé IA. Pas de page d'erreur, pas de plantage : le repli déterministe avait fait son travail. Mais le LLM avait cessé de fonctionner en silence.

La cause a pris quelques minutes à trouver une fois visible, et elle n'avait rien à voir avec les prompts ou la qualité du modèle. Mon fournisseur avait **retiré le modèle** auquel mon code était figé. Chaque appel revenait en `404 model_not_found`, et un `catch {}` nu l'avalait.

C'est exactement ce que disent les données du secteur. Le rapport *State of AI Engineering* de Datadog (juillet 2026) observe que les équipes testent vite les nouveaux modèles mais sont « plus lentes à retirer les anciens modèles déjà en production » — et les fournisseurs, eux, ne les attendent pas. Si votre agent fige un nom de modèle, il a une date de péremption que vous ne contrôlez pas.

## L'architecture

Le tout tourne sur des **Supabase Edge Functions** (Deno), orchestrées par **LangGraph.js**. Le graphe compte maintenant six nœuds :

![Le graphe de l'agent : checkCache, rateLimit, fetchRepo, analyze, synthesize, saveCache. Seul synthesize appelle un LLM.](/images/blog/agent-serverless/pipeline.svg)

Cinq des six étapes sont du code ordinaire. Une seule appelle un LLM. Ce ratio est délibéré :

1. **checkCache** — un cache de 24 h dans Postgres. Les analyses répétées ne coûtent rien et reviennent en 0,6 s environ.
2. **rateLimit** — une limite par IP, appliquée uniquement aux exécutions fraîches (j'y reviens).
3. **fetchRepo** — quatre appels parallèles à l'API GitHub : métadonnées, langages, README, arborescence.
4. **analyzeStructure** — du code pur : répartition des langages, fichiers de dépendances et signaux de qualité (tests ? CI ? licence ? docs ? lockfiles ?). Zéro token.
5. **synthesizeReport** — le seul appel LLM, avec un basculement entre deux fournisseurs.
6. **saveCache** — ne met en cache que les rapports produits par le LLM, pour ne jamais figer un repli pendant 24 h.

Comme un seul nœud a besoin d'un LLM, le système est rapide (environ 2,5 s pour un rapport IA frais), économique et résilient — les trois qualités que les démos n'ont jamais.

## Les limites de débit sont la vraie cause de panne

Voici le chiffre qui a changé ma façon de penser les agents en production :

![Datadog, State of AI Engineering 2026 : en février 2026, 5 % des appels LLM ont renvoyé une erreur et 60 % de ces erreurs étaient des limites de débit.](/images/blog/agent-serverless/rate-limit-errors.svg)

En février 2026, Datadog a observé que 5 % des appels LLM renvoyaient une erreur, et que **60 % de ces erreurs venaient de dépassements de limite de débit** — le fournisseur qui répond « trop de requêtes ».

Les limites de débit mordent des deux côtés. En amont, votre fournisseur vous bride. En aval, votre propre point d'accès public a besoin d'une limite, sinon un seul robot peut brûler tout votre quota gratuit.

Ma première version se trompait sur le second point. Je plafonnais les visiteurs à 3 analyses par heure et je vérifiais la limite *avant* le cache — si bien que rouvrir un rapport déjà en cache, qui ne coûte rien, consommait quand même l'un de vos trois essais. J'ai atteint ma propre limite en testant.

Le correctif tient dans une petite idée qui compte beaucoup : **vérifier d'abord ce qui est gratuit.**

![Limite de débit avec cache prioritaire : les réponses en cache reviennent immédiatement sans être comptées ; seules les exécutions fraîches passent par le limiteur.](/images/blog/agent-serverless/cache-first-rate-limit.svg)

- Les réponses en cache sont servies avant le limiteur et ne comptent jamais.
- Seules les exécutions fraîches, celles qui consomment du quota GitHub et LLM, comptent.
- La limite est maintenant de **10 exécutions fraîches par heure et par IP**, et c'est un paramètre (`RATE_LIMIT_PER_HOUR`), pas une constante — je peux l'ajuster depuis le tableau de bord sans redéployer.

En langage LangGraph, le limiteur est simplement devenu un nœud placé *après* `checkCache`. La forme du graphe porte la politique.

## Deux fournisseurs, zéro dépendance

Le post-mortem m'a laissé deux règles : ne jamais dépendre d'un seul fournisseur, ni d'un seul nom de modèle.

![Chaîne de basculement LLM : Groq d'abord, puis NVIDIA NIM, puis un rapport structurel déterministe. Un modèle retiré déclenche la recherche des modèles disponibles et un nouvel essai.](/images/blog/agent-serverless/llm-failover.svg)

1. **Groq en primaire** — rapide, avec une offre gratuite qui se réinitialise chaque jour.
2. **NVIDIA NIM en secours**, sur crédits gratuits. Il n'est appelé que si Groq échoue, donc les crédits durent.
3. **Le rapport structurel déterministe en dernier recours.** Si les deux fournisseurs sont indisponibles, le visiteur reçoit quand même un rapport utile — jamais une page d'erreur.

En plus, chaque fournisseur se remet seul d'un modèle retiré : sur un `404`, l'agent demande la liste des modèles disponibles, choisit le suivant dans une liste de préférences et réessaie une fois. Le nom du modèle dans ma configuration est devenu une *préférence*, pas un point de défaillance unique.

C'est aussi là que converge la pratique. Comme le résumait un article récent sur les pannes de fournisseurs : « Une chaîne de repli à plusieurs niveaux est la plus résiliente. Un primaire, un secondaire, et un modèle auto-hébergé ou à poids ouverts en dernier rempart » — et pour la plupart des équipes, « le mode actif-passif à deux fournisseurs est le bon point de départ. » C'est d'ailleurs déjà la réalité du marché : Datadog rapporte que plus de 70 % des organisations utilisent trois modèles ou plus.

## L'observabilité n'est pas optionnelle

Le repli a rendu la panne invisible pour les visiteurs — tant mieux — mais aussi pour *moi*, ce qui est un problème. Mes blocs `catch {}` étaient si polis qu'ils masquaient une panne totale du LLM.

Désormais, chaque appel en échec journalise le fournisseur, le code HTTP et le début du corps de l'erreur (jamais la clé). Le modèle retiré est apparu dans les journaux comme une explication d'une ligne :

```
llm http error 404 {"error":{"message":"The model `llama-3.3-70b-versatile` does not exist ..."}}
```

C'est la partie du débat sur « les agents en production » avec laquelle je suis le plus d'accord : « La plupart des agents IA en production n'échouent pas parce que le modèle est mauvais. Ils échouent parce que l'infrastructure autour d'eux est invisible. » Une dégradation élégante sans journalisation, c'est simplement l'assurance d'être le dernier informé.

## Les décisions dont personne ne parle

**La démo ne doit jamais casser en public.** Toute défaillance du LLM se dégrade en rapport déterministe. Un visiteur ne doit jamais voir « erreur interne » à cause d'un fournisseur.

**L'abus est une contrainte de conception.** Validation stricte du format `propriétaire/dépôt`, limite par IP sur les exécutions fraîches, CORS restreint à mon domaine, et vérification JWT pour que seule la clé anonyme de mon site puisse appeler la fonction.

**Le cache est un levier de coût — et maintenant de limite de débit.** Les rapports en cache sont gratuits, instantanés et jamais comptés, si bien que les vrais visiteurs n'atteignent presque jamais la limite.

**La configuration vaut mieux que les constantes.** Le modèle, les fournisseurs et la limite de débit sont tous des secrets modifiables depuis le tableau de bord. Le prochain retrait de modèle sera un changement de paramètre, pas un incident.

**La traçabilité est une fonctionnalité.** La fonction renvoie le temps réel de chaque étape et l'interface l'affiche comme une trace d'agent. Les visiteurs ne lisent pas seulement un rapport : ils regardent le pipeline s'exécuter.

## Ce que cela m'a appris

1. **Réduisez le périmètre jusqu'à pouvoir livrer.** Un vrai graphe vaut mieux que cinq sous-agents planifiés.
2. **Les étapes déterministes sont sous-estimées.** L'essentiel de ce qui rend un agent utile, c'est du code ordinaire bien structuré.
3. **Les limites de débit sont la principale cause de panne en production.** Concevez pour elles des deux côtés : cache d'abord, ne comptez que ce qui coûte.
4. **Les noms de modèles expirent.** Traitez-les comme des préférences et laissez l'agent découvrir ce qui est disponible.
5. **Deux fournisseurs plus du code ordinaire** battent la disponibilité de n'importe quel modèle isolé.
6. **Un repli sans journaux masque les pannes.** Dégradez en douceur, mais journalisez fort.
7. **Serverless et LLM en offre gratuite forment une vraie pile de production** pour des pipelines agentiques avec cache — toujours à 0 $/mois.

## Essayez-le

Rendez-vous sur la [page Sandbox](/Sandbox), choisissez l'un de mes dépôts ou collez n'importe quel dépôt public. Regardez la trace, puis relancez le même dépôt : la seconde exécution est instantanée, vient du cache, et ne compte pas dans votre limite.

Le code est sur [GitHub](https://github.com/womgaalbert). Si vous voulez ce type de système pour votre produit — un pipeline IA avec de vrais garde-fous, du basculement et de l'observabilité — [parlons-en](/Contact).

---

**Sources**

- Datadog, [State of AI Engineering](https://www.datadoghq.com/state-of-ai-engineering/) (juillet 2026)
- Chanl, [When your LLM provider goes down, your agent shouldn't](https://www.channel.tel/blog/llm-provider-failover-agent-reliability) (juin 2026)
- Hadil Ben Abdallah, [Why AI Agents Fail in Production (And How Engineering Teams Are Fixing It in 2026)](https://dev.to/hadil/why-ai-agents-fail-in-production-and-how-engineering-teams-are-fixing-it-in-2026-job) (juin 2026)
$md$,
  updated_at = now()
WHERE slug = 'production-ai-agent-serverless';

-- ============================================================
-- >>> 011_blog_current_topics.sql
-- ============================================================
-- ============================================================
-- 011: Three posts on current AI topics (EN + FR), Sept 2026
-- ============================================================

-- ------------------------------------------------------------
-- 1. The GPT-6 wave and model churn (Industry Insights)
-- ------------------------------------------------------------
INSERT INTO blog_posts (
  title, slug, excerpt, content, title_fr, excerpt_fr, content_fr,
  category, tags, cover_image, cover_alt, cover_alt_fr, read_time, published, published_date
) VALUES (
  $md$The GPT-6 Wave: What Model Churn Really Costs the Teams Shipping on Top$md$,
  'gpt-6-wave-and-model-churn',
  $md$Three weeks, three OpenAI releases and one API switched off for good. September 2026 was a masterclass in how fast the ground moves under anyone building on someone else's models — and in how to build so it does not matter.$md$,
  $md$# The GPT-6 Wave: What Model Churn Really Costs the Teams Shipping on Top

September 2026 was a loud month.

- **3 September** — OpenAI announced **GPT-6 Astra**, calling it a new generation of intelligence.
- **22 September** — **GPT-6 Sol** and **GPT-6 Luna** followed. Sol is aimed at complex coding and agentic work, Luna at high-volume tasks. Both landed at roughly **half the token price** of the 5.6-series models they replace, which OpenAI attributes to "improvements in caching and inference".
- **24 September** — the **Sora video API was switched off** for good, six months after the deprecation notice.

Three releases and one shutdown in twenty-one days. If you only read the launch posts, this looks like pure progress. If you *operate* something built on these APIs, it looks like work.

[This is GPT-6 Astra. Anything you can do on a computer, Astra can do for you. Fast.](https://x.com/OpenAI/status/2095595741528125780)

## The launch is the easy part

I write the unglamorous half of this for a living, so let me be blunt about what a release wave actually costs a small team.

New models are opt-in. You can ignore them. **Retirements are not.** Those are a countdown on someone else's calendar, and the countdown runs whether or not you are paying attention.

The Sora API is a clean example. OpenAI announced the deprecation on **24 March 2026** and shut it off on **24 September 2026**. Six months of notice, published in the deprecations table, with **no replacement model listed**. If you shipped a product on it, you did not get a migration path. You got a date.

And Sora is not an outlier. On the same deprecations page today, the audio and realtime models built on GPT-4o are scheduled to stop in **January 2027**, with named replacements. That is the normal rhythm now: a notice, a window, an end.

## I learned this the hard way, last week

I do not write this from theory. A few days ago the AI summary on my own [GitHub Project Analyzer](/Sandbox) quietly stopped working.

The model I had hard-coded — `llama-3.3-70b-versatile` — had been retired by the provider. Every call returned `404 model_not_found`. My code caught the error, said nothing, and served the fallback report. Visitors saw something reasonable. I saw nothing at all.

I wrote up the fix in [How I Shipped a Production AI Agent on Serverless](/Blog). The short version is that I stopped treating the model name as a constant.

Datadog's *State of AI Engineering* report (July 2026) found the same thing at scale: teams are quick to try new models but "slower to retire older models already running in production". Providers are not waiting for us.

## Four habits that make churn boring

Model churn is only painful if your system assumes the model is permanent. Four things fix that, and none of them are exotic.

**1. The model name is configuration, not code.** Mine lives in an environment secret. Changing provider or model is a settings edit, not a deploy. The day Groq retired my model, the fix was one field.

**2. Discover, do not hard-code.** When a call comes back `404`, my agent asks the provider which models it actually has, picks the best available one from a preference list, and retries once. A retirement degrades into a log line instead of an outage.

**3. Two providers, minimum.** Datadog reports that **more than 70% of organizations now use three or more models**. That is not fashion; it is insurance. My analyzer tries Groq first, falls back to NVIDIA NIM, and falls back again to a deterministic report that needs no LLM at all. A visitor never sees an error page because a vendor had a bad afternoon.

**4. Read the deprecations page like a changelog.** Put it in your calendar once a quarter. It is the single highest-value page in any model provider's docs, and almost nobody reads it until something breaks.

## The part nobody puts in the launch post

Cheaper and better models are genuinely good news. GPT-6 Sol at half the price of its predecessor, with OpenAI claiming "about half as many mistakes as its predecessor" on internal factuality evaluations, is a real gift to anyone running a high-volume workload.

But the price of living in a fast-moving ecosystem is that **your architecture has to absorb change that you do not control**. The teams that suffer during a release wave are not the ones on old models. They are the ones who wrote a model name into a function and never thought about it again.

Build so that the next launch is an opportunity, not an incident.

---

**Sources**

- OpenAI, [GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/) (3 September 2026)
- TechCrunch, [OpenAI launches GPT-6 Sol and Luna, boasting lower cost and fewer mistakes](https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/) (22 September 2026)
- OpenAI, [API deprecations](https://developers.openai.com/api/docs/deprecations)
- OpenAI Help Center, [What to know about the Sora discontinuation](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)
- Datadog, [State of AI Engineering](https://www.datadoghq.com/state-of-ai-engineering/) (July 2026)
$md$,
  $md$La vague GPT-6 : ce que la valse des modèles coûte vraiment aux équipes qui construisent dessus$md$,
  $md$Trois semaines, trois sorties chez OpenAI et une API éteinte définitivement. Septembre 2026 a montré à quelle vitesse le sol bouge sous ceux qui bâtissent sur les modèles des autres — et comment construire pour que cela n'ait plus d'importance.$md$,
  $md$# La vague GPT-6 : ce que la valse des modèles coûte vraiment aux équipes qui construisent dessus

Septembre 2026 a été un mois bruyant.

- **3 septembre** — OpenAI annonce **GPT-6 Astra**, présenté comme une nouvelle génération d'intelligence.
- **22 septembre** — **GPT-6 Sol** et **GPT-6 Luna** suivent. Sol vise le code complexe et les workflows agentiques, Luna les tâches à fort volume. Les deux arrivent à environ **la moitié du prix par token** des modèles 5.6 qu'ils remplacent, ce qu'OpenAI attribue à des « améliorations du cache et de l'inférence ».
- **24 septembre** — l'**API vidéo Sora est éteinte** définitivement, six mois après l'avis de dépréciation.

Trois sorties et un arrêt en vingt et un jours. Si vous ne lisez que les annonces, c'est du progrès pur. Si vous *exploitez* quelque chose bâti sur ces API, c'est du travail.

[This is GPT-6 Astra. Anything you can do on a computer, Astra can do for you. Fast.](https://x.com/OpenAI/status/2095595741528125780)

## Le lancement est la partie facile

Je gagne ma vie avec la moitié ingrate de ce métier, alors soyons direct sur ce qu'une vague de sorties coûte réellement à une petite équipe.

Les nouveaux modèles sont optionnels. Vous pouvez les ignorer. **Les retraits, non.** Ce sont des comptes à rebours sur le calendrier de quelqu'un d'autre, et ils tournent que vous y prêtiez attention ou pas.

L'API Sora en est un cas d'école. OpenAI a annoncé la dépréciation le **24 mars 2026** et l'a coupée le **24 septembre 2026**. Six mois de préavis, publiés dans le tableau des dépréciations, **sans aucun modèle de remplacement indiqué**. Si vous aviez livré un produit dessus, vous n'aviez pas de chemin de migration. Vous aviez une date.

Et Sora n'est pas une exception. Sur la même page aujourd'hui, les modèles audio et temps réel basés sur GPT-4o doivent s'arrêter en **janvier 2027**, avec des remplaçants nommés. C'est le rythme normal désormais : un avis, une fenêtre, une fin.

## Je l'ai appris à mes dépens, la semaine dernière

Je n'écris pas cela en théorie. Il y a quelques jours, le résumé IA de mon propre [analyseur de dépôts GitHub](/Sandbox) a cessé de fonctionner en silence.

Le modèle que j'avais figé dans le code — `llama-3.3-70b-versatile` — avait été retiré par le fournisseur. Chaque appel renvoyait `404 model_not_found`. Mon code attrapait l'erreur, ne disait rien, et servait le rapport de repli. Les visiteurs voyaient quelque chose de correct. Moi, je ne voyais rien du tout.

J'ai raconté le correctif dans [Comment j'ai mis un agent IA en production sur du serverless](/Blog). En résumé : j'ai cessé de traiter le nom du modèle comme une constante.

Le rapport *State of AI Engineering* de Datadog (juillet 2026) observe la même chose à grande échelle : les équipes testent vite les nouveaux modèles mais sont « plus lentes à retirer les anciens modèles déjà en production ». Les fournisseurs, eux, ne nous attendent pas.

## Quatre habitudes qui rendent la valse des modèles ennuyeuse

Le renouvellement des modèles ne fait mal que si votre système suppose que le modèle est permanent. Quatre choses corrigent cela, et aucune n'est exotique.

**1. Le nom du modèle est une configuration, pas du code.** Le mien vit dans un secret d'environnement. Changer de fournisseur ou de modèle est une modification de paramètre, pas un déploiement. Le jour où Groq a retiré mon modèle, le correctif tenait dans un champ.

**2. Découvrir plutôt que figer.** Quand un appel revient en `404`, mon agent demande au fournisseur quels modèles il possède réellement, choisit le meilleur disponible dans une liste de préférences, et réessaie une fois. Un retrait se dégrade en une ligne de log au lieu d'une panne.

**3. Deux fournisseurs, au minimum.** Datadog rapporte que **plus de 70 % des organisations utilisent désormais trois modèles ou plus**. Ce n'est pas une mode, c'est une assurance. Mon analyseur essaie Groq d'abord, bascule sur NVIDIA NIM, puis retombe sur un rapport déterministe qui n'a besoin d'aucun LLM. Un visiteur ne voit jamais de page d'erreur parce qu'un fournisseur a eu un mauvais après-midi.

**4. Lisez la page des dépréciations comme un changelog.** Mettez-la à votre agenda une fois par trimestre. C'est la page la plus utile de la documentation de n'importe quel fournisseur, et presque personne ne la lit avant que quelque chose casse.

## Ce que les annonces ne disent pas

Des modèles moins chers et meilleurs, c'est une vraie bonne nouvelle. GPT-6 Sol à la moitié du prix de son prédécesseur, avec « environ deux fois moins d'erreurs que son prédécesseur » selon les évaluations internes de factualité d'OpenAI, est un cadeau réel pour quiconque fait tourner de gros volumes.

Mais le prix d'un écosystème qui avance vite, c'est que **votre architecture doit absorber un changement que vous ne contrôlez pas**. Les équipes qui souffrent pendant une vague de sorties ne sont pas celles restées sur de vieux modèles. Ce sont celles qui ont écrit un nom de modèle dans une fonction et n'y ont plus jamais pensé.

Construisez pour que la prochaine annonce soit une opportunité, pas un incident.

---

**Sources**

- OpenAI, [GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/) (3 septembre 2026)
- TechCrunch, [OpenAI launches GPT-6 Sol and Luna, boasting lower cost and fewer mistakes](https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/) (22 septembre 2026)
- OpenAI, [API deprecations](https://developers.openai.com/api/docs/deprecations)
- Centre d'aide OpenAI, [What to know about the Sora discontinuation](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)
- Datadog, [State of AI Engineering](https://www.datadoghq.com/state-of-ai-engineering/) (juillet 2026)
$md$,
  'Industry Insights',
  ARRAY['GPT-6', 'OpenAI', 'LLM Ops', 'Model Deprecation', 'Resilience', 'AI Strategy'],
  '/images/blog/gpt-6-wave-and-model-churn.webp',
  $md$A wave of glowing AI model cards sweeping forward, older ones dissolving into particles behind the newer ones$md$,
  $md$Une vague de cartes de modèles IA lumineuses qui avance, les plus anciennes se dissolvant en particules derrière les nouvelles$md$,
  8, true, DATE '2026-09-24'
)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- 2. Why AI agents fail in production (Opinion)
-- ------------------------------------------------------------
INSERT INTO blog_posts (
  title, slug, excerpt, content, title_fr, excerpt_fr, content_fr,
  category, tags, cover_image, cover_alt, cover_alt_fr, read_time, published, published_date
) VALUES (
  $md$Why AI Agents Fail in Production — and Why the Model Is Rarely the Problem$md$,
  'why-ai-agents-fail-in-production',
  $md$Five percent of production LLM calls return an error, and 60% of those are rate limits. Not hallucinations. The 2026 consensus is blunt: agents fail in the plumbing around the model, and most teams cannot see it happening.$md$,
  $md$# Why AI Agents Fail in Production — and Why the Model Is Rarely the Problem

There is a sentence going around engineering circles this year that I keep coming back to, because it matches everything I have seen shipping agents for clients:

> "Most production AI agents don't fail because the model is bad. They fail because the infrastructure around them is invisible."

That is Hadil Ben Abdallah, writing in June 2026. It is the most useful thing said about agents all year, and it is not about models at all.

## The numbers back it up

Datadog's *State of AI Engineering* report (July 2026) looked at real production traces, and the finding is not what the discourse would lead you to expect.

In February 2026, **5% of all LLM call spans returned an error — and 60% of those errors were exceeded rate limits.** Not hallucinations. Not bad prompts. The provider saying *too many requests*.

By March the error rate had fallen to 2%, but rate limits were still almost a third of all errors — around **8.4 million of them** in the dataset.

Meanwhile agent frameworks are spreading fast: adoption **nearly doubled year over year, from just over 9% of organizations in early 2025 to almost 18% by the start of 2026**. More teams are shipping agents, into the same unforgiving plumbing.

## The six ways it actually breaks

The failure modes people report are remarkably consistent, and almost none of them live inside the model.

**1. Silent tool failures.** A tool call fails and "the model often keeps going. No exception. No crash. No alert." The agent narrates its way past the gap and produces a confident, wrong answer.

**2. Prompt and schema drift.** Prompts get edited by three people over two months, nobody tracks the versions, and "output quality slowly collapses."

**3. Latency explosions.** In a multi-step workflow, "by the time a production workflow finishes, the system may have touched half a dozen services." Each one adds tail latency and a new way to time out.

**4. Routing chaos across providers.** Multi-provider setups are the right call for resilience, but every provider behaves differently — different errors, different limits, different JSON quirks.

**5. Eval disconnection.** "Offline datasets tell you whether the model performed well last week. They don't tell you whether production quality silently degraded yesterday."

**6. Hallucinated actions.** "The model invents a tool name. It calls a function that doesn't exist." Everything upstream looks fine.

The through-line: **AI doesn't break, its behaviour shifts.** Systems that only alert on exceptions never notice.

## I shipped this bug myself

I am not writing this from the outside. My own [GitHub Project Analyzer](/Sandbox) is a public agent: it fetches a repository, analyses its structure and writes an executive report.

I built it defensively. If the LLM fails, it degrades to a deterministic structural report rather than showing an error. That design worked exactly as intended — which was the problem.

When my provider retired the model I had hard-coded, every call returned `404`. A bare `catch {}` swallowed it. Visitors kept getting sensible reports with no AI summary, and I had **no idea anything was wrong**. Graceful degradation without logging is just a slower way to find out.

The fix took ten minutes once I could see it: log the provider, the status code and the first part of the error body. The retirement showed up as one line:

```
llm http error 404 {"error":{"message":"The model `llama-3.3-70b-versatile` does not exist ..."}}
```

That is failure mode #1, in my own code, on my own site. It is that easy to build.

## What actually helps

Nothing here is glamorous. That is the point.

- **Log every failed external call** with the provider, status and a truncated error body — never the key. If you take one thing from this post, take this.
- **Treat rate limits as a first-class design concern**, not an edge case. Cache aggressively, check the cache *before* the limiter, and count only the work that actually spends quota.
- **Fail over across providers**, with a deterministic last resort that needs no model at all.
- **Emit a trace per run** — a timed list of every step. My analyzer returns per-step timings and the UI renders them, so visitors watch the pipeline run. That same trace is my debugger.
- **Alert on silence, not just errors.** "Zero LLM calls succeeded in the last hour" is the alert that would have caught my bug on day one.

## The honest summary

The interesting problems in production AI are not prompt engineering. They are the same problems distributed systems have always had — retries, timeouts, quotas, versioning, observability — wearing a new hat.

Which is good news, because our industry already knows how to solve those. We just have to remember to apply it when the component in the middle happens to be a language model.

---

**Sources**

- Datadog, [State of AI Engineering](https://www.datadoghq.com/state-of-ai-engineering/) (July 2026)
- Hadil Ben Abdallah, [Why AI Agents Fail in Production (And How Engineering Teams Are Fixing It in 2026)](https://dev.to/hadil/why-ai-agents-fail-in-production-and-how-engineering-teams-are-fixing-it-in-2026-job) (June 2026)
- Chanl, [When your LLM provider goes down, your agent shouldn't](https://www.channel.tel/blog/llm-provider-failover-agent-reliability) (June 2026)

**Watch**

[Ultimate Guide to AI Agent Observability and Production Monitoring 2026](https://www.youtube.com/watch?v=DevAyoh_4bU)
$md$,
  $md$Pourquoi les agents IA échouent en production — et pourquoi le modèle est rarement en cause$md$,
  $md$5 % des appels LLM en production renvoient une erreur, et 60 % de ces erreurs sont des limites de débit. Pas des hallucinations. Le consensus de 2026 est net : les agents cassent dans la tuyauterie autour du modèle, et la plupart des équipes ne le voient pas.$md$,
  $md$# Pourquoi les agents IA échouent en production — et pourquoi le modèle est rarement en cause

Une phrase circule cette année dans les cercles d'ingénierie et j'y reviens sans cesse, parce qu'elle correspond à tout ce que j'ai vu en livrant des agents pour des clients :

> « La plupart des agents IA en production n'échouent pas parce que le modèle est mauvais. Ils échouent parce que l'infrastructure autour d'eux est invisible. »

C'est Hadil Ben Abdallah, en juin 2026. C'est la chose la plus utile dite sur les agents cette année, et elle ne parle pas du tout des modèles.

## Les chiffres le confirment

Le rapport *State of AI Engineering* de Datadog (juillet 2026) a examiné de vraies traces de production, et le résultat n'est pas celui que le discours ambiant laisse attendre.

En février 2026, **5 % de tous les appels LLM ont renvoyé une erreur — et 60 % de ces erreurs étaient des dépassements de limite de débit.** Pas des hallucinations. Pas de mauvais prompts. Le fournisseur qui dit *trop de requêtes*.

En mars, le taux d'erreur était retombé à 2 %, mais les limites de débit représentaient encore près d'un tiers des erreurs — environ **8,4 millions** dans le jeu de données.

Pendant ce temps, les frameworks d'agents se répandent vite : leur adoption a **presque doublé en un an, d'un peu plus de 9 % des organisations début 2025 à près de 18 % début 2026**. Plus d'équipes livrent des agents, dans la même tuyauterie impitoyable.

## Les six façons dont ça casse vraiment

Les modes de défaillance rapportés sont remarquablement constants, et presque aucun ne se situe à l'intérieur du modèle.

**1. Les échecs d'outils silencieux.** Un appel d'outil échoue et « le modèle continue souvent. Pas d'exception. Pas de plantage. Pas d'alerte. » L'agent contourne le trou par la narration et produit une réponse assurée et fausse.

**2. La dérive des prompts et des schémas.** Trois personnes modifient les prompts sur deux mois, personne ne suit les versions, et « la qualité des sorties s'effondre lentement ».

**3. L'explosion des latences.** Dans un workflow multi-étapes, « le temps qu'un workflow de production se termine, le système a pu toucher une demi-douzaine de services ». Chacun ajoute de la latence de queue et une nouvelle façon d'expirer.

**4. Le chaos du routage entre fournisseurs.** Le multi-fournisseur est le bon choix pour la résilience, mais chacun se comporte différemment : erreurs différentes, limites différentes, bizarreries JSON différentes.

**5. La déconnexion des évaluations.** « Les jeux de données hors ligne vous disent si le modèle était bon la semaine dernière. Ils ne vous disent pas si la qualité en production s'est silencieusement dégradée hier. »

**6. Les actions hallucinées.** « Le modèle invente un nom d'outil. Il appelle une fonction qui n'existe pas. » Tout en amont a l'air correct.

Le fil conducteur : **l'IA ne casse pas, son comportement dérive.** Les systèmes qui n'alertent que sur les exceptions ne s'en aperçoivent jamais.

## J'ai livré ce bug moi-même

Je n'écris pas cela de l'extérieur. Mon propre [analyseur de dépôts GitHub](/Sandbox) est un agent public : il récupère un dépôt, analyse sa structure et rédige un rapport exécutif.

Je l'ai construit défensivement. Si le LLM échoue, il se dégrade en rapport structurel déterministe plutôt que d'afficher une erreur. Cette conception a fonctionné exactement comme prévu — et c'était le problème.

Quand mon fournisseur a retiré le modèle que j'avais figé dans le code, chaque appel renvoyait `404`. Un `catch {}` nu l'avalait. Les visiteurs recevaient toujours des rapports corrects sans résumé IA, et je **n'avais aucune idée** que quelque chose clochait. Une dégradation élégante sans journalisation n'est qu'une façon plus lente de l'apprendre.

Le correctif a pris dix minutes une fois le problème visible : journaliser le fournisseur, le code de statut et le début du corps de l'erreur. Le retrait est apparu en une ligne :

```
llm http error 404 {"error":{"message":"The model `llama-3.3-70b-versatile` does not exist ..."}}
```

C'est le mode de défaillance n° 1, dans mon propre code, sur mon propre site. C'est aussi facile que cela à construire.

## Ce qui aide vraiment

Rien ici n'est glamour. C'est justement le propos.

- **Journalisez chaque appel externe en échec** avec le fournisseur, le statut et un extrait du corps de l'erreur — jamais la clé. Si vous ne retenez qu'une chose de cet article, retenez celle-là.
- **Traitez les limites de débit comme une contrainte de conception de premier plan**, pas comme un cas limite. Mettez en cache agressivement, vérifiez le cache *avant* le limiteur, et ne comptez que le travail qui consomme réellement du quota.
- **Basculez entre fournisseurs**, avec un dernier recours déterministe qui n'a besoin d'aucun modèle.
- **Émettez une trace par exécution** — la liste chronométrée de chaque étape. Mon analyseur renvoie le temps de chaque étape et l'interface les affiche, si bien que les visiteurs regardent le pipeline s'exécuter. Cette même trace est mon débogueur.
- **Alertez sur le silence, pas seulement sur les erreurs.** « Zéro appel LLM réussi dans la dernière heure » est l'alerte qui aurait attrapé mon bug dès le premier jour.

## Le résumé honnête

Les problèmes intéressants de l'IA en production ne sont pas le prompt engineering. Ce sont les mêmes problèmes que les systèmes distribués ont toujours eus — reprises, délais d'attente, quotas, versionnage, observabilité — avec un chapeau neuf.

C'est une bonne nouvelle, parce que notre métier sait déjà les résoudre. Il suffit de penser à appliquer ce savoir quand le composant au milieu se trouve être un modèle de langage.

---

**Sources**

- Datadog, [State of AI Engineering](https://www.datadoghq.com/state-of-ai-engineering/) (juillet 2026)
- Hadil Ben Abdallah, [Why AI Agents Fail in Production (And How Engineering Teams Are Fixing It in 2026)](https://dev.to/hadil/why-ai-agents-fail-in-production-and-how-engineering-teams-are-fixing-it-in-2026-job) (juin 2026)
- Chanl, [When your LLM provider goes down, your agent shouldn't](https://www.channel.tel/blog/llm-provider-failover-agent-reliability) (juin 2026)

**À regarder**

[Ultimate Guide to AI Agent Observability and Production Monitoring 2026](https://www.youtube.com/watch?v=DevAyoh_4bU)
$md$,
  'Opinion',
  ARRAY['AI Agents', 'Observability', 'Reliability', 'Rate Limiting', 'MLOps', 'Production'],
  '/images/blog/why-ai-agents-fail-in-production.webp',
  $md$A bright neural network fed by cracked, leaking data pipes — the failure is around the model, not inside it$md$,
  $md$Un réseau de neurones lumineux alimenté par des conduites fissurées qui fuient — la panne est autour du modèle, pas à l'intérieur$md$,
  9, true, DATE '2026-09-24'
)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- 3. AGENTS.md (Tutorials)
-- ------------------------------------------------------------
INSERT INTO blog_posts (
  title, slug, excerpt, content, title_fr, excerpt_fr, content_fr,
  category, tags, cover_image, cover_alt, cover_alt_fr, read_time, published, published_date
) VALUES (
  $md$AGENTS.md: The README for AI Agents, and How to Write One That Earns Its Place$md$,
  'agents-md-open-standard-coding-agents',
  $md$One markdown file, 60,000+ open-source projects, 25+ tools and a Linux Foundation home. A controlled benchmark found it cut an agent's wall time by 27% on an ambiguous task. Here is what goes in it, and what does not.$md$,
  $md$# AGENTS.md: The README for AI Agents

Every coding agent has the same first problem: it arrives in your repository knowing nothing about it.

Which package manager? Which test command? Do you use tabs? Is `dist/` generated or committed? A human contributor reads the README and figures it out. An agent guesses, and its guesses cost you tokens and patience.

**AGENTS.md** is the answer the industry converged on. It is "a README for agents: a dedicated, predictable place to provide the context and instructions to help AI coding agents work on your project."

## Why this one stuck

Plenty of vendors shipped their own version of this file. What makes AGENTS.md different is that it stopped being anyone's.

It is now **stewarded by the Agentic AI Foundation under the Linux Foundation**, after collaborative work involving OpenAI Codex, Amp, Google's Jules, Cursor and Factory. More than **25 tools** read it — VS Code, GitHub Copilot, Cursor, Zed, Warp, Devin, Aider, goose, JetBrains Junie, Windsurf and others — and over **60,000 open-source projects** now ship one, including Apache Airflow and Temporal's Java SDK.

A standard that no single vendor controls is a standard you can adopt without betting on a vendor. That is the whole point.

[AGENTS.md Explained: One File to Rule All Agents](https://www.youtube.com/watch?v=TC7dK0gwgg0)

## It measurably changes agent behaviour

This is the part that convinced me, because it is measured rather than asserted.

In July 2026, Andrea Griffiths ran a controlled benchmark for the Agentic AI Foundation: two identical clones of the same VS Code extension repository, one with a **twelve-line** AGENTS.md and one without. Identical prompts, GitHub Copilot CLI in non-interactive mode, five runs per condition, tracking credits, tokens and time.

On an **ambiguous** task, the file "cut wall time 27%, credits 24%, and produced diffs 26% smaller."

On a **multi-file** task the gain was smaller — "the median win was smaller, 9 to 10%" — but the qualitative difference was sharper: "two of five runs without AGENTS.md wasted time re-orienting in the repo or running an unrequested production build at the end. Every run with AGENTS.md skipped both."

Twelve lines. That is the return on a file you write once.

## What to actually put in it

The useful sections are boring and specific:

- **Project overview** — one paragraph on what this thing is
- **Build and test commands** — the exact commands, not a description of them
- **Code style** — conventions an agent cannot infer from two files
- **Testing instructions** — how to run one test, not just the whole suite
- **Security considerations** — what must never be touched or committed
- **Commit and PR conventions**

Here is roughly what mine looks like on this site:

```markdown
# AGENTS.md

React 19 + Vite portfolio with a Supabase backend.
Bilingual FR/EN; every user-visible string comes from
src/lib/LanguageContext.jsx — never hardcode English.

## Commands
npm run dev        # vite dev server on :5173
npm run typecheck  # tsc over jsconfig.json — must pass
npm run lint       # eslint --quiet — must pass
npm run build      # production build

## Conventions
- Theme colours only: hsl(var(--primary)), text-foreground, bg-card.
  Never hardcode hex colours in components.
- Supabase Edge Functions live in supabase/functions/<name>/index.ts (Deno).
- Migrations are append-only: add supabase/migrations/NNN_name.sql,
  never edit an applied one.

## Security
- Never commit .env.local or any service_role key.
- Public Edge Functions validate input and rate-limit by IP.
```

Nothing in there is clever. Every line is something an agent would otherwise get wrong on its first attempt.

## What to leave out

The failure mode I see most often is a 400-line AGENTS.md that nobody maintains. It becomes stale, and a stale instruction is worse than no instruction — the agent follows it confidently into the wrong pattern.

Three rules I hold myself to:

1. **If it is already in the code, do not restate it.** The agent can read the code.
2. **If it changes often, do not pin it.** Reference the script, not the current flag.
3. **If you would not tell a new contributor on day one, leave it out.**

In a monorepo you can nest files: **"the closest AGENTS.md to the edited file wins; explicit user chat prompts override everything."** So the root file holds what is true everywhere, and each package overrides what is local to it.

## Is this real, or is it ceremony?

Fair question — our industry generates conventions faster than it retires them.

My read: AGENTS.md is real because it is cheap, measured and vendor-neutral. Twelve lines, a Linux Foundation home, 25+ tools, and a benchmark showing double-digit reductions in time and cost. That is a better return than almost any other twelve lines you will write this quarter.

And if the standard is ever displaced, you have lost a markdown file. That is an acceptable downside.

---

**Sources**

- [AGENTS.md](https://agents.md/) — the specification and tool list
- [agentsmd/agents.md on GitHub](https://github.com/agentsmd/agents.md)
- Andrea Griffiths, Agentic AI Foundation, [Measuring AGENTS.md: what five runs show that one doesn't](https://aaif.io/blog/measuring-agents-md-what-five-runs-show-that-one-doesn-t) (22 July 2026)
$md$,
  $md$AGENTS.md : le README des agents IA, et comment en écrire un qui mérite sa place$md$,
  $md$Un fichier markdown, plus de 60 000 projets open source, plus de 25 outils et un foyer à la Linux Foundation. Un test contrôlé a mesuré 27 % de temps en moins sur une tâche ambiguë. Voici ce qu'on y met — et ce qu'on n'y met pas.$md$,
  $md$# AGENTS.md : le README des agents IA

Chaque agent de code a le même premier problème : il arrive dans votre dépôt sans rien en savoir.

Quel gestionnaire de paquets ? Quelle commande de test ? Tabulations ou espaces ? Le dossier `dist/` est-il généré ou versionné ? Un contributeur humain lit le README et s'en sort. Un agent devine, et ses suppositions vous coûtent des tokens et de la patience.

**AGENTS.md** est la réponse sur laquelle le secteur a convergé. C'est « un README pour les agents : un endroit dédié et prévisible pour fournir le contexte et les instructions qui aident les agents de code IA à travailler sur votre projet ».

## Pourquoi celui-ci s'est imposé

Beaucoup d'éditeurs ont livré leur propre version de ce fichier. Ce qui distingue AGENTS.md, c'est qu'il a cessé d'appartenir à quiconque.

Il est désormais **géré par l'Agentic AI Foundation, sous la Linux Foundation**, après un travail collaboratif impliquant OpenAI Codex, Amp, Jules de Google, Cursor et Factory. Plus de **25 outils** le lisent — VS Code, GitHub Copilot, Cursor, Zed, Warp, Devin, Aider, goose, JetBrains Junie, Windsurf et d'autres — et plus de **60 000 projets open source** en embarquent un, dont Apache Airflow et le SDK Java de Temporal.

Un standard que personne ne contrôle est un standard qu'on peut adopter sans parier sur un éditeur. C'est tout l'intérêt.

[AGENTS.md Explained: One File to Rule All Agents](https://www.youtube.com/watch?v=TC7dK0gwgg0)

## Il change le comportement des agents, et c'est mesuré

C'est la partie qui m'a convaincu, parce qu'elle est mesurée plutôt qu'affirmée.

En juillet 2026, Andrea Griffiths a mené un test contrôlé pour l'Agentic AI Foundation : deux clones identiques d'un même dépôt d'extension VS Code, l'un avec un AGENTS.md de **douze lignes**, l'autre sans. Prompts identiques, GitHub Copilot CLI en mode non interactif, cinq exécutions par condition, en suivant crédits, tokens et temps.

Sur une tâche **ambiguë**, le fichier a « réduit le temps de 27 %, les crédits de 24 %, et produit des diffs 26 % plus petits ».

Sur une tâche **multi-fichiers**, le gain était plus faible — « le gain médian était plus petit, 9 à 10 % » — mais la différence qualitative était plus nette : « deux exécutions sur cinq sans AGENTS.md ont perdu du temps à se réorienter dans le dépôt ou à lancer un build de production non demandé à la fin. Toutes les exécutions avec AGENTS.md ont évité les deux. »

Douze lignes. Voilà le rendement d'un fichier qu'on écrit une fois.

## Ce qu'il faut vraiment y mettre

Les sections utiles sont ennuyeuses et précises :

- **Vue d'ensemble du projet** — un paragraphe sur ce que c'est
- **Commandes de build et de test** — les commandes exactes, pas leur description
- **Style de code** — les conventions qu'un agent ne peut pas déduire de deux fichiers
- **Instructions de test** — comment lancer un seul test, pas seulement toute la suite
- **Sécurité** — ce qu'il ne faut jamais toucher ni committer
- **Conventions de commit et de PR**

Voici à peu près à quoi ressemble le mien sur ce site :

```markdown
# AGENTS.md

React 19 + Vite portfolio with a Supabase backend.
Bilingual FR/EN; every user-visible string comes from
src/lib/LanguageContext.jsx — never hardcode English.

## Commands
npm run dev        # vite dev server on :5173
npm run typecheck  # tsc over jsconfig.json — must pass
npm run lint       # eslint --quiet — must pass
npm run build      # production build

## Conventions
- Theme colours only: hsl(var(--primary)), text-foreground, bg-card.
  Never hardcode hex colours in components.
- Supabase Edge Functions live in supabase/functions/<name>/index.ts (Deno).
- Migrations are append-only: add supabase/migrations/NNN_name.sql,
  never edit an applied one.

## Security
- Never commit .env.local or any service_role key.
- Public Edge Functions validate input and rate-limit by IP.
```

Rien là-dedans n'est malin. Chaque ligne correspond à une chose qu'un agent se serait sinon trompé à faire du premier coup.

## Ce qu'il faut en laisser dehors

Le travers que je vois le plus souvent : un AGENTS.md de 400 lignes que personne n'entretient. Il devient obsolète, et une instruction obsolète est pire que pas d'instruction — l'agent la suit avec assurance vers le mauvais schéma.

Trois règles que je m'impose :

1. **Si c'est déjà dans le code, ne le répétez pas.** L'agent sait lire le code.
2. **Si ça change souvent, ne le figez pas.** Référencez le script, pas le drapeau du jour.
3. **Si vous ne le diriez pas à un nouveau contributeur le premier jour, laissez-le dehors.**

Dans un monorepo, les fichiers peuvent s'imbriquer : **« le AGENTS.md le plus proche du fichier modifié l'emporte ; les instructions explicites de l'utilisateur priment sur tout. »** Le fichier racine porte donc ce qui est vrai partout, et chaque paquet redéfinit ce qui lui est propre.

## Est-ce du concret ou du cérémonial ?

Question légitime : notre métier produit des conventions plus vite qu'il n'en retire.

Mon avis : AGENTS.md est du concret parce qu'il est bon marché, mesuré et neutre. Douze lignes, un foyer à la Linux Foundation, plus de 25 outils, et un test montrant des réductions à deux chiffres en temps et en coût. C'est un meilleur rendement que presque n'importe quelles autres douze lignes que vous écrirez ce trimestre.

Et si le standard venait à être supplanté, vous aurez perdu un fichier markdown. C'est un risque acceptable.

---

**Sources**

- [AGENTS.md](https://agents.md/) — la spécification et la liste des outils
- [agentsmd/agents.md sur GitHub](https://github.com/agentsmd/agents.md)
- Andrea Griffiths, Agentic AI Foundation, [Measuring AGENTS.md: what five runs show that one doesn't](https://aaif.io/blog/measuring-agents-md-what-five-runs-show-that-one-doesn-t) (22 juillet 2026)
$md$,
  'Tutorials',
  ARRAY['AGENTS.md', 'Coding Agents', 'Developer Experience', 'Open Standards', 'Claude Code', 'Copilot'],
  '/images/blog/agents-md-open-standard-coding-agents.webp',
  $md$A glowing document at the centre of a dark scene, its light guiding small robotic coding agents working on floating code blocks$md$,
  $md$Un document lumineux au centre d'une scène sombre, dont la lumière guide de petits agents robotiques travaillant sur des blocs de code flottants$md$,
  7, true, DATE '2026-09-24'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- >>> 012_appointments.sql
-- ============================================================
-- ============================================================
-- 012: Discovery-call booking (replaces Calendly)
-- ============================================================
-- Visitors never read or write these tables directly: the
-- book-appointment Edge Function (service role) lists free slots
-- and inserts bookings; admins manage them via is_admin() (007).

CREATE TABLE IF NOT EXISTS appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at     TIMESTAMPTZ NOT NULL,
  duration_min  INT NOT NULL DEFAULT 30,
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email         TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  company       TEXT CHECK (char_length(company) <= 160),
  phone         TEXT CHECK (char_length(phone) <= 40),
  topic         TEXT NOT NULL CHECK (char_length(topic) <= 80),
  message       TEXT CHECK (char_length(message) <= 1000),
  format        TEXT NOT NULL DEFAULT 'video' CHECK (format IN ('video', 'phone')),
  lang          TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'fr')),
  timezone      TEXT CHECK (char_length(timezone) <= 64),
  status        TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'done')),
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One active booking per slot: the database is the final double-booking guard.
CREATE UNIQUE INDEX IF NOT EXISTS appointments_one_per_slot
  ON appointments (starts_at) WHERE status <> 'cancelled';
CREATE INDEX IF NOT EXISTS appointments_reminders
  ON appointments (starts_at) WHERE status = 'confirmed' AND reminder_sent = false;

CREATE TABLE IF NOT EXISTS blocked_dates (
  date   DATE PRIMARY KEY,
  reason TEXT
);

ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies except admins.
DROP POLICY IF EXISTS "Admins read appointments" ON appointments;
CREATE POLICY "Admins read appointments" ON appointments FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins update appointments" ON appointments;
CREATE POLICY "Admins update appointments" ON appointments FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins manage blocked dates" ON blocked_dates;
CREATE POLICY "Admins manage blocked dates" ON blocked_dates FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ------------------------------------------------------------
-- Daily 24h reminders at 12:00 UTC (08:00 Ottawa in summer, 07:00 in winter).
-- The function checks an x-cron-secret header; its value lives in Vault:
--   select vault.create_secret('<same value as the CRON_SECRET function secret>', 'cron_secret');
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $cron$
BEGIN
  PERFORM cron.unschedule('appointment-reminders-daily')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'appointment-reminders-daily');
END
$cron$;

SELECT cron.schedule(
  'appointment-reminders-daily',
  '0 12 * * *',
  $job$
  SELECT net.http_post(
    url     := 'https://ljjmgxhqohbkpmcbklxw.supabase.co/functions/v1/appointment-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    body    := '{}'::jsonb
  );
  $job$
);

