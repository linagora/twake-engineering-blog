---
title: "Matrix 101: The Protocol Underneath the Chat"
description: "Découvrez la réalité élégante derrière Matrix, le protocole open-source qui redéfinit la messagerie moderne. Dépassant l'idée reçue selon laquelle la tech décentralisée est désespérément complexe, cette analyse approfondie révèle Matrix comme une architecture simple et puissante : des blocs JSON ancrés à un graphe et synchronisés sur des serveurs fédérés. En associant le routage souverain de l'e-mail à l'intégrité cryptographique du registre d'ajouts de Git, Matrix élimine les jardins secrets des applications propriétaires. Découvrez comment il parvient à la résidence des données en temps réel, à la réplication résiliente des serveurs et à la gouvernance décentralisée sans arbitre central. Des mécanismes des graphes orientés acycliques (DAG) et de la résolution d'état à la chorégraphie cryptographique complexe des chiffrements Olm et Megolm, maîtrisez le modèle mental ultime pour l'avenir des communications sécurisées."
date: 2026-07-06
updated: 2026-07-06
authors:
  - linagora-team
tags:
  - Matrix Protocol
  - End-to-End Encryption
  - TwakeChat
---

*Première partie d'une série. Nous travaillons sur Matrix. Vous devriez le comprendre. Servez-vous quelque chose à boire, approchez une chaise, et réglons cela.*

On dit que tout le monde ment, et pourtant une vérité discrète se cache au cœur de chaque tromperie. Depuis des années, voici celle qu'on nous vend au sujet de Matrix : c'est désespérément complexe, un truc de niche pour les paranoïaques du chapeau en alu, et bien trop épineux à expliquer entre un refill chez Starbucks et le retour au bureau.

La réalité, pourtant, est presque embarrassante de simplicité en comparaison. Retirez le jargon, et Matrix n'est qu'un tas de blocs (blobs) JSON, ancrés dans un graphe, et copiés sur des serveurs qui acceptent de jouer le jeu. C'est là tout le tour de magie ; le reste n'est que du décor.

Alors, allumez vos écrans, prenez une gorgée et installez-vous. Nous allons décortiquer exactement comment cela fonctionne.

## Le problème dont personne ne parle

Jetez un œil à votre barre des tâches en ce moment même. Vous avez probablement Slack ouvert pour le boulot, WhatsApp pour donner des nouvelles à la famille, et Discord qui tourne pour le loisir qui occupe vos soirées. Peut-être êtes-vous aussi coincé sur un outil d'entreprise lourd que personne n'aime, vestige d'une décision prise il y a trois réorganisations de cela.

Voici ce qu'aucune de ces applications n'avouera jamais à voix haute : elles ne se parlent pas, et ce n'est pas un accident. C'est leur modèle économique.

Vos messages et votre graphe social sont intentionnellement verrouillés derrière l'API propriétaire de quelqu'un d'autre. Une API qui peut disparaître à l'instant même où elle cesse d'être rentable. Vous vous retrouvez littéralement fantôme de votre propre historique de discussion, largué sans un mot.

Sauf que, par un formidable retournement de situation, nous avons déjà résolu ce casse-tête exact il y a quarante ans. Cela s'appelle l'e-mail, et l'industrie de la tech a simplement choisi collectivement de l'oublier.

Pensez-y : lorsqu'un message bascule d'une application comme Twake Mail vers le monde extérieur, nous ne demandons pas de permission. Le serveur d'expédition vérifie simplement l'enregistrement MX de la destination comme un carnet d'adresses numérique, ouvre une ligne directe avec le serveur désigné et lui remet la lettre. Il n'y a ni videur, ni cordon de sécurité. C'est précisément cette infrastructure ouverte qui a permis à l'e-mail de survivre à tous les jardins fermés ("walled gardens") construits pour le remplacer ; personne ne possède le protocole, donc tout le monde peut gérer son propre bureau de poste.

Matrix reprend cette architecture éprouvée par le temps et lui offre un coup de jeune bien mérité pour l'ère moderne. C'est de la fédération, mais pensée pour la messagerie instantanée.

Certes, la comparaison n'est pas tout à fait parfaite : alors que l'e-mail fonctionne fondamentalement selon le principe du "tirer et oublier" (fire-and-forget), Matrix doit maintenir une conversation en direct et synchronisée au même rythme sur l'ensemble d'un réseau mondial. Quoi qu'il en soit, le cœur qui bat en dessous reste identique : un protocole ouvert, aucun serveur maître, et tout le monde qui se parle directement.

Si vous voulez l'argument ultime à sortir en ascenseur — celui que nous allons valider dans le reste de cet article — le voici : **Matrix, c'est en gros l'e-mail dans Git.**

## Votre adresse est votre identité

Pour comprendre comment cela fonctionne en pratique, il faut commencer par la manière dont on vous trouve sur le réseau. Un identifiant Matrix standard ressemble à ceci : `@alice:wonder.land`. C'est mignon et très Lewis Carroll, mais cela accomplit un sérieux travail d'ingénierie sous le capot.

La partie après les deux-points, `wonder.land`, n'est pas une coquetterie esthétique, c'est du routage pur. Ainsi, tout serveur tiers essayant de joindre Alice résout ce domaine comme un nom d'hôte normal, localise son homeserver (serveur d'accueil) spécifique et s'y connecte directement. L'identité et l'adresse réseau fusionnent en une seule chaîne de caractères, ne nécessitant qu'une seule recherche sans qu'un annuaire central obèse ne vienne barrer la route.

D'un point de vue sociologique, cela révèle une vérité plus profonde : les identités Matrix ne sont pas de simples lignes dans le tableur centralisé de quelqu'un. Vous pouvez voir `@alice:wonder.land` et `@bob:build.er` comme des citoyens totalement distincts de pays entièrement différents, qui se trouvent simplement parler la même langue diplomatique.

En explorant cet écosystème, il y a deux espaces de noms spécifiques qu'il vaut la peine de se tatouer sur l'avant-bras :

* **`@utilisateur:serveur`** : Représente un utilisateur individuel.
* **`!id_opaque:serveur`** : Représente un salon (une room). Il utilise une chaîne de caractères brute et illisible pour des raisons que nous aborderons dans un instant, de sorte qu'il porte généralement aussi un alias public plus accueillant du type `#nom:serveur`.

## Le Homeserver : votre bureau de poste, votre coffre-fort

Derrière chacune de ces adresses vrombit un moteur appelé le *homeserver*. Ce logiciel implémente le cœur de la [spécification de l'API client-serveur de Matrix](https://spec.matrix.org/latest/client-server-api/) et jongle rigoureusement avec trois tâches principales : agir comme le gardien de votre compte, servir de serveur à votre client, et faire office d'ambassade auprès de tous les autres serveurs du réseau.

Grâce à cette configuration, l'application cliente de votre choix (*qu'il s'agisse de [TwakeChat](https://twake.app/), [FluffyChat](https://www.google.com/search?q=https://fluffychat.im/m), [Cinny](https://cinny.in/) ou autre*) communique avec un seul et unique homeserver. Vous vous connectez une fois, récupérez un jeton de session, et le moindre de vos mouvements transite par cette unique machine. Votre client n'a jamais besoin de savoir qu'un serveur tiers existe ; c'est le problème du homeserver, par conception.

Naturellement, ces implémentations de serveurs se déclinent en plusieurs saveurs selon vos exigences de performance :

* **[Synapse](https://github.com/element-hq/synapse)** : Développé en Python, incroyablement complet, et historiquement connu pour engloutir toute votre RAM en tâche de fond. Il reste la Cadillac incontestée des homeservers.
* **[Dendrite](https://github.com/element-hq/dendrite)** : Une alternative plus légère en Go, qui rattrape rapidement son retard fonctionnel.
* **[Conduit](https://conduit.rs/)** (et ses forks) : Écrit en Rust, épuré jusqu'à l'absolu nécessaire, et parfaitement ravi de tourner discrètement sur un Raspberry Pi.

En fin de compte, l'endroit où vous choisissez de parquer votre homeserver détermine exactement qui détient vos données. Si vous utilisez matrix.org, c'est la Fondation Matrix qui les a. Si vous utilisez une instance d'entreprise, c'est l'entreprise. Mais si vous choisissez de l'auto-héberger, alors félicitations : les données vous appartiennent vraiment !

Le protocole s'en moque éperdument dans les deux cas, même si vos responsables de la conformité en entreprise ne partageront peut-être pas la même insouciance.

## L'illusion derrière les salons

Cela nous amène à la rupture architecturale majeure où Matrix cesse officiellement d'être "un simple service de chat de plus".

Dans l'univers Matrix, un salon de discussion ne vit pas sur un serveur spécifique. Au lieu de cela, il est répliqué partout où il est invité. Chaque homeserver ayant un utilisateur représenté dans ce salon en conserve une copie complète, localement souveraine, de l'état entier du salon.

Puisqu'il n'y a pas de copie maîtresse, il n'y a pas de point de défaillance unique. Si votre homeserver tombe en panne au milieu d'une phrase, la conversation continue d'avancer ailleurs sur le réseau sans sauter un seul battement. Lorsque votre serveur revient en ligne, il synchronise tranquillement le delta et rattrape son retard. Un peu comme consulter son téléphone après un long vol.

Pour visualiser cela, revenons à notre analogie initiale avec Git : un salon Matrix est en fait un projet logiciel que chaque serveur participant a entièrement cloné. Vous poussez une entrée sur votre copie locale, et le protocole travaille automatiquement en coulisses pour aligner la réalité de tous les autres.

Cette synchronisation continue s'effectue via l'IAP [serveur-serveur de Matrix](https://spec.matrix.org/latest/server-server-api/), plus communément appelée l'API de Fédération. Lorsqu'un homeserver reçoit un nouvel événement, il en vérifie la légitimité, l'enregistre localement et le diffuse via HTTPS authentifié.

Chaque serveur destinataire revérifie le travail avant de le transmettre. Grâce à cette rigueur, personne ne peut usurper l'identité de quelqu'un d'autre ; l'intégralité de l'échange est verrouillée par des clés de signature `ed25519`, l'équivalent cryptographique d'une signature notariée que personne ne peut falsifier.

## Tout est un événement

Pour rendre possible cette réplication décentralisée, l'historique dans Matrix ne peut pas être traité comme une table de base de données statique. Il est plutôt traité comme un flux vivant d'événements structurés. Absolument tout ce qui se passe dans un salon arrive enveloppé dans le même calage JSON :

```json
{
  "type": "m.room.message",
  "event_id": "$26RqwJMLw-yds1GAH_QxjHRC1Da9oasK0e5VLnck_45",
  "sender": "@alice:wonder.land",
  "room_id": "!xyz:build.er",
  "origin_server_ts": 1632489532305,
  "content": {
    "msgtype": "m.text",
    "body": "WE ARE LATE!!!"
  }
}

```

Qu'il s'agisse d'un message texte standard, de quelqu'un qui rejoint le salon, ou du sujet du salon modifié à 2 heures du matin sans raison apparente, tout arrive dans la même enveloppe. Seul le champ `type` change. Le serveur vérifie simplement l'affranchissement de l'enveloppe ; ce qui se passe à l'intérieur du bloc `content` ne regarde strictement que l'expéditeur et votre application cliente.

Pour garder ce flux organisé, les événements sont globalement divisés en deux grandes catégories :

1. **Les événements d'état (State events)** : Ils portent une clé unique `state_key` et définissent les faits actuels du salon (par exemple, le nom du salon ou qui détient les droits d'administration). Ils écrasent leurs prédécesseurs dès leur arrivée.
2. **Les événements de fil chronologique (Timeline events)** : Ils représentent l'historique permanent et linéaire du salon (par exemple, les messages, les réactions, les images ou les signaux d'appels). Ils sont ajoutés pour toujours. Même lorsque vous modifiez un message, Matrix ne réécrit pas l'histoire : il émet un tout nouvel événement de fil chronologique qui pointe vers l'original via une propriété `m.relates_to`.

## L'historique comme un graphe orienté acyclique (DAG)

Parce que les événements se produisent simultanément sur différents serveurs, l'historique des salons ne peut pas être stocké sous forme de liste séquentielle bien propre. À la place, il est structuré comme un graphe orienté acyclique, ou DAG (*Directed Acyclic Graph*).

Pourquoi choisir un tel niveau de complexité structurelle ? Considérez l'environnement : vous avez des serveurs indépendants dispersés dans le monde entier qui écrivent dans la base de données à la même milliseconde, sans arbitre central. Une simple liste nécessiterait un marqueur de score centralisé pour décider qui a tiré le premier. Comme Matrix n'en a pas, un DAG permet à chaque serveur individuel d'ajouter des événements à la réalité qu'il a sous les yeux au moment présent.

Inévitablement, le graphe va se diviser en branches (forker). Cependant, ces branches s'entrelacent à nouveau de manière fluide dès que les serveurs se connectent et comparent leurs notes. Le résultat final est un système qui parvient à une cohérence globale sans nécessiter aucune coordination en temps réel.

Git repose exactement sur cette même vision structurelle, en utilisant des commits qui pointent vers des commits parents sans dépendre d'une horloge centrale. Le tour de force ultime de Matrix consiste à résoudre ces fourches inévitables du DAG de manière automatique grâce à un processus déterministe appelé **la résolution d'état**. En s'appuyant sur des règles mathématiques strictes pondérées par les niveaux de puissance des utilisateurs, il produit une réponse unique et canonique que chaque serveur du réseau obtient de manière totalement indépendante.

## La valse sur le réseau

Si l'on zoome sur la mécanique, la séquence exacte étape par étape d'Alice envoyant un message ressemble à une chorégraphie minutieuse en quatre temps distincts :

**1. Client → Homeserver (API Client-Serveur)**

Alice tape son message et appuie sur envoyer. Son client lance une requête `PUT` vers `/_matrix/client/v3/rooms/{roomId}/send/{eventType}/{txnId}`. Son homeserver local valide la requête, construit l'enveloppe formelle de l'événement JSON, la signe et lui attribue un `event_id` unique.

**2. Homeserver → DAG**

L'événement fraîchement créé est immédiatement ajouté au DAG local du salon sur le serveur d'Alice, en référençant explicitement les `prev_events` actuels. Si des modifications d'état complexes sont impliquées dans cette étape, l'algorithme de résolution d'état s'exécute localement pour s'assurer de sa validité.

**3. Homeserver → Fédération (API Serveur-Serveur)**

À présent, le homeserver d'Alice diffuse l'événement à tous les autres homeservers ayant des utilisateurs dans ce salon via une requête `PUT /_matrix/federation/v1/send/{txnId}`. Chaque serveur de réception valide indépendamment la signature cryptographique, vérifie la chaîne d'authentification et ajoute l'événement à son propre clone local du DAG.

**4. Homeserver → Clients**

Enfin, les clients à l'écoute interrogent leurs serveurs respectifs via `/_matrix/client/v3/sync` à l'aide d'un jeton de curseur. Le homeserver renvoie tout ce qui a changé depuis leur dernière vérification (y compris les événements de fil chronologique, les deltas d'état, les mises à jour de présence et les indicateurs de saisie).

Les clients traitent ces données, mettent à jour l'interface utilisateur et relancent immédiatement une interrogation. Matrix utilise ici un mécanisme de **long-polling avec expiration (long-poll timeout)**, ce qui signifie que le homeserver maintient intentionnellement la connexion HTTP ouverte jusqu'à ce qu'un nouvel événement arrive. Si un client se trouve en arrière-plan, une passerelle de notification dédiée prend le relais : le homeserver lui envoie une notification minimale, réveillant l'appareil pour que le client puisse récupérer l'événement complet à sa reprise.

> **Note** : Le `txnId` utilisé dans les deux API d'envoi fait office de clé d'idempotence. Cela permet aux clients et aux serveurs de rejouer en toute sécurité les requêtes réseau ayant échoué sans risquer de publier deux fois le même message — un petit détail qui apporte d'immenses garanties de justesse.

## Orchestrer la gouvernance

Bien sûr, permettre à tout le monde d'écrire simultanément dans un graphe partagé tournerait rapidement au chaos sans des garde-fous stricts. Pour résoudre ce problème, chaque salon Matrix implémente un système intégré de niveaux de puissance (*power levels*) qui est nettement plus souple que la gestion traditionnelle par rôles.

Au lieu de manipuler des groupes arbitraires et rigides, les permissions sont régies par un unique événement d'état `m.room.power_levels` contenant un dictionnaire simple de seuils sous forme d'entiers :

```json
{
  "users": {
    "@alice:wonder.land": 100,
    "@bob:wonder.land": 50
  },
  "users_default": 0,
  "events": {
    "m.room.name": 50,
    "m.room.power_levels": 100
  },
  "ban": 50,
  "kick": 50,
  "redact": 50,
  "invite": 0
}

```

Dans ce modèle, les utilisateurs se voient attribuer un niveau numérique fixe. Parallèlement, des actions et types d'événements spécifiques exigent un seuil numérique minimal pour être exécutés. Si vous souhaitez agir, il vous suffit d'atteindre ou de dépasser le nombre requis. De plus, vous ne pouvez pas octroyer à un autre utilisateur un niveau de puissance supérieur au vôtre. C'est un événement d'état unique évalué à chaque étape, sans qu'il soit nécessaire de recourir à des API de permissions distinctes ou à des matrices alambiquées.

La flexibilité architecturale que cela crée est remarquable : les canaux de diffusion, les communautés fortement modérées, les salons automatisés gérés par des bots et les espaces d'équipe ouverts sont tous construits en utilisant exactement la même logique sous-jacente, simplement avec des chiffres différents configurés dans le bloc de l'événement.

Pour un contrôle macroscopique, la gouvernance s'étend aux ACL (listes de contrôle d'accès) de serveurs, permettant à un salon de bannir complètement les serveurs malveillants. Et lorsque les mathématiques sous-jacentes du protocole ont besoin d'un correctif, les communautés peuvent migrer de manière transparente vers de nouvelles versions de salon, implémentant des règles structurelles mises à jour tout en préservant l'historique de la conversation.

## La chorégraphie cryptographique

Si la gouvernance décentralisée semble complexe, la couche de confidentialité va encore plus loin. Le chiffrement de bout en bout dans Matrix n'est pas un simple interrupteur binaire que l'on bascule ; c'est un repas cryptographique sophistiqué à plusieurs services :

* **Les clés d'identité de l'appareil (Device identity keys)** : Clés à long terme qui restent persistantes pendant toute la durée d'une session.
* **Les pré-clés à usage unique (One-time prekeys)** : Clés éphémères publiées sur le serveur, consommées une fois par les pairs qui se connectent, et périodiquement réapprovisionnées.
* **Les clés de session Olm (Olm session keys)** : Un protocole basé sur un système de roue à cliquet (ratchet) utilisé pour sécuriser les communications directes de un à un, avançant à chaque message envoyé.
* **Les clés de session Megolm (Megolm session keys)** : Un protocole à cliquet optimisé conçu pour gérer le trafic intense des discussions de groupe en faisant tourner les clés dès qu'un utilisateur rejoint ou quitte le salon.
* **Les clés de sauvegarde de clés (Key backup keys)** : Un filet de sécurité cryptographique sécurisé, protégé par phrase de passe, utilisé pour récupérer l'historique si un appareil est égaré entre les coussins du canapé.

En raison de cette chorégraphie complexe, lorsqu'un message ne parvient pas à se déchiffrer dans votre client, cela signifie rarement que l'ensemble du protocole est cassé. Le plus souvent, cela signifie simplement qu'une de ces clés hautement transitoires a été temporairement perdue en cours de route ou a pivoté une fraction de seconde trop tôt.

Pour ancrer tout ce réseau de confiance, on s'appuie sur la **vérification des appareils par signature croisée (cross-signing)**. Une fois que vous avez vérifié la clé maîtresse d'un contact (généralement via un scan de code QR en personne ou une comparaison d'emojis), cette confiance explicite se répercute automatiquement sur chaque appareil ultérieur qu'il aura lui-même vérifié, garantissant une sécurité qui s'adapte naturellement aux usages.

## La réalité brute

Lorsque l'on dépouille Matrix de son marketing et de son jargon techno, la réalité est magnifiquement brute : ce sont des blocs JSON, ancrés à un graphe, copiés sur des serveurs qui ne répondent à aucun maître suprême.

Tout le reste, des passerelles d'application (bridges) au chiffrement de bout en bout, en passant par les algorithmes de résolution d'état qui font discrètement leurs calculs en arrière-plan, existe uniquement pour permettre à cette structure de graphe simple de tourner de manière sécurisée et à grande échelle. Les clients tiers habillent l'interface visuelle, les serveurs d'identité traduisent les identifiants existants comme les e-mails en ID Matrix lorsque vous souhaitez être trouvé, et les services d'application lient l'ensemble du graphe vers l'extérieur vers Slack, Discord et tout ce qui refuse de se fédérer nativement.

Si jamais vous avez besoin de vous en souvenir simplement, repensez à notre formule fétiche : **c'est de l'e-mail dans Git.**

L'aspect fédération, c'est la moitié e-mail ; des serveurs indépendants qui discutent librement sans gardien du temple. L'aspect DAG, c'est la moitié Git ; un historique cryptographique, en ajout uniquement, que personne ne peut réécrire discrètement derrière votre dos. C'est un modèle mental épuré et structurellement juste, et vous avez désormais officiellement le droit de le sortir en société.

Le mensonge persistant était que Matrix est trop compliqué à comprendre.
La vérité, comme la plupart des bonnes vérités d'ingénierie, s'est révélée bien plus élégante que la rumeur.

Voilà tout le protocole mis à nu jusqu'aux fondations.
Il reste de nombreuses pistes à explorer, et nous reviendrons très bientôt avec d'autres détails.

---

Nous espérons que votre café n'a pas refroidi et qu'il vous reste un morceau de croissant pour savourer la fin de votre pause, tout en laissant mûrir ces quelques réflexions sur l'architecture de Matrix.
