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
