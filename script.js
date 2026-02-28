(() => {
    "use strict";

    const CONFIG = {
        PLAYER_MAX_HP: 50,
        ENEMY_MAX_HP: 50,
        START_MANA: 3,
        ENEMY_MAX_MANA: 3,
        PLAYER_MAX_MANA: 15,
        HAND_SIZE: 3,
        MAX_HAND_SIZE: 3,
        PLAYER_ACTIONS_PER_TURN: 3,
        AI_ACTIONS_BY_DIFFICULTY: { easy: 2, medium: 3, hard: 3 },
        DAMAGE_LOG_LIMIT: 6
    };

    const CARD_LIBRARY = {
        player: [
            { id: "ritter", name: "Ritter", rarity: "common", school: "nature", damage: 3, cost: 1, type: "damage", copies: 3 },
            { id: "feuerball", name: "Feuerball", rarity: "rare", school: "fire", comboGroup: "fire", damage: 4, cost: 2, type: "damage_status", status: { kind: "burn", turns: 2, damage: 2 }, copies: 3 },
            { id: "feuerdrache", name: "Feuerdrache", rarity: "epic", school: "fire", comboGroup: "fire", damage: 6, cost: 3, type: "damage_status", status: { kind: "hardBurn", turns: 2, damage: 3 }, copies: 2 },
            { id: "heiltrank", name: "Heiltrank", rarity: "common", school: "nature", heal: 4, cost: 2, type: "heal", copies: 2 },
            { id: "schildsegen", name: "Schildsegen", rarity: "rare", school: "nature", shield: 5, cost: 2, type: "shield", copies: 2 },
            { id: "giftklinge", name: "Giftklinge", rarity: "rare", school: "shadow", damage: 2, cost: 2, type: "damage_status", status: { kind: "poison", turns: 3, damage: 1 }, copies: 2 },
            { id: "asteroid", name: "Asteroid", rarity: "legendary", school: "fire", comboGroup: "fire", damage: 15, cost: 6, type: "damage", copies: 1 },
            {
                id: "letzter_wille",
                name: "Letzter Wille",
                rarity: "special",
                school: "nature",
                type: "special",
                cost: 3,
                condition: { kind: "self_hp_at_or_below", value: 18 },
                special: { kind: "heal_and_shield", heal: 6, shield: 4 },
                copies: 1
            },
            {
                id: "hinrichtung",
                name: "Hinrichtung",
                rarity: "special",
                school: "shadow",
                type: "special",
                cost: 4,
                condition: { kind: "target_hp_at_or_below", value: 14 },
                special: { kind: "execute_damage", damage: 12 },
                copies: 1
            },
            {
                id: "reinigung",
                name: "Reinigung",
                rarity: "special",
                school: "nature",
                type: "special",
                cost: 2,
                condition: { kind: "self_has_negative_status" },
                special: { kind: "cleanse_and_heal", heal: 4 },
                copies: 1
            },
            {
                id: "stille",
                name: "Stille",
                rarity: "special",
                school: "shadow",
                type: "special",
                cost: 2,
                special: { kind: "silence", turns: 1 },
                copies: 1
            },
            {
                id: "entzauberung",
                name: "Entzauberung",
                rarity: "special",
                school: "shadow",
                type: "special",
                cost: 2,
                special: { kind: "dispel", removeShield: true },
                copies: 1
            },
            {
                id: "provokation",
                name: "Provokation",
                rarity: "special",
                school: "nature",
                type: "special",
                cost: 1,
                special: { kind: "taunt", turns: 1 },
                copies: 1
            },
            {
                id: "arkaner_motor",
                name: "Arkaner Motor",
                rarity: "special",
                school: "fire",
                type: "special",
                cost: 2,
                special: { kind: "draw_engine", draw: 2 },
                copies: 1
            }
        ],
        ai: [
            { id: "ritter", name: "Ritter", rarity: "common", school: "nature", damage: 3, cost: 1, type: "damage", copies: 3 },
            { id: "feuerball", name: "Feuerball", rarity: "rare", school: "fire", comboGroup: "fire", damage: 4, cost: 2, type: "damage_status", status: { kind: "burn", turns: 2, damage: 2 }, copies: 3 },
            { id: "feuerdrache", name: "Feuerdrache", rarity: "epic", school: "fire", comboGroup: "fire", damage: 6, cost: 3, type: "damage_status", status: { kind: "hardBurn", turns: 2, damage: 3 }, copies: 2 },
            { id: "heiltrank", name: "Heiltrank", rarity: "common", school: "nature", heal: 4, cost: 2, type: "heal", copies: 2 },
            { id: "schildsegen", name: "Schildsegen", rarity: "rare", school: "nature", shield: 5, cost: 2, type: "shield", copies: 2 },
            { id: "giftklinge", name: "Giftklinge", rarity: "rare", school: "shadow", damage: 2, cost: 2, type: "damage_status", status: { kind: "poison", turns: 3, damage: 1 }, copies: 2 },
            { id: "asteroid", name: "Asteroid", rarity: "legendary", school: "fire", comboGroup: "fire", damage: 15, cost: 6, type: "damage", copies: 1 },
            {
                id: "letzter_wille",
                name: "Letzter Wille",
                rarity: "special",
                school: "nature",
                type: "special",
                cost: 3,
                condition: { kind: "self_hp_at_or_below", value: 18 },
                special: { kind: "heal_and_shield", heal: 6, shield: 4 },
                copies: 1
            },
            {
                id: "hinrichtung",
                name: "Hinrichtung",
                rarity: "special",
                school: "shadow",
                type: "special",
                cost: 4,
                condition: { kind: "target_hp_at_or_below", value: 14 },
                special: { kind: "execute_damage", damage: 12 },
                copies: 1
            },
            {
                id: "reinigung",
                name: "Reinigung",
                rarity: "special",
                school: "nature",
                type: "special",
                cost: 2,
                condition: { kind: "self_has_negative_status" },
                special: { kind: "cleanse_and_heal", heal: 4 },
                copies: 1
            },
            {
                id: "stille",
                name: "Stille",
                rarity: "special",
                school: "shadow",
                type: "special",
                cost: 2,
                special: { kind: "silence", turns: 1 },
                copies: 1
            },
            {
                id: "entzauberung",
                name: "Entzauberung",
                rarity: "special",
                school: "shadow",
                type: "special",
                cost: 2,
                special: { kind: "dispel", removeShield: true },
                copies: 1
            },
            {
                id: "provokation",
                name: "Provokation",
                rarity: "special",
                school: "nature",
                type: "special",
                cost: 1,
                special: { kind: "taunt", turns: 1 },
                copies: 1
            },
            {
                id: "arkaner_motor",
                name: "Arkaner Motor",
                rarity: "special",
                school: "fire",
                type: "special",
                cost: 2,
                special: { kind: "draw_engine", draw: 2 },
                copies: 1
            }
        ]
    };

    const ELEMENT_SCHOOL_LABELS = {
        fire: "Feuer",
        shadow: "Schatten",
        nature: "Natur"
    };

    const ELEMENT_SET_BONUS_RULES = {
        fire: { threshold: 2, bonusDamage: 2, description: "Set-Bonus Feuer (2+): +2 Direktschaden." },
        shadow: { threshold: 2, bonusStatusDamage: 1, bonusStatusTurns: 1, description: "Set-Bonus Schatten (2+): +1 Status-Schaden, +1 Runde." },
        nature: { threshold: 2, bonusHeal: 2, bonusShield: 2, description: "Set-Bonus Natur (2+): +2 Heilung, +2 Schild." }
    };

    const CARD_SYNERGY_RULES = {
        feuerball: {
            requiresLastAction: "heal",
            bonusDamage: 2,
            description: "Synergie: Nach Heilung +2 Schaden."
        },
        giftklinge: {
            requiresLastAction: "heal",
            bonusStatusDamage: 1,
            bonusStatusTurns: 1,
            description: "Synergie: Nach Heilung +1 Gift-Schaden und +1 Runde."
        },
        schildsegen: {
            requiresLastAction: "heal",
            bonusShield: 3,
            description: "Synergie: Nach Heilung +3 Schild."
        },
        heiltrank: {
            requiresLastAction: "shield",
            bonusHeal: 2,
            description: "Synergie: Nach Schild +2 Heilung."
        },
        asteroid: {
            requiresLastAction: "damage",
            bonusDamage: 4,
            description: "Synergie: Nach Schadenskarte +4 Schaden."
        }
    };

    const AI_DECK_STRATEGIES = {
        easy: {
            label: "Defensiv",
            cards: [
                { id: "ritter", copies: 4 },
                { id: "heiltrank", copies: 3 },
                { id: "schildsegen", copies: 3 },
                { id: "feuerball", copies: 2 },
                { id: "giftklinge", copies: 1 },
                { id: "feuerdrache", copies: 1 },
                { id: "provokation", copies: 1 },
                { id: "entzauberung", copies: 1 }
            ]
        },
        medium: {
            label: "Ausgewogen",
            cards: [
                { id: "ritter", copies: 3 },
                { id: "feuerball", copies: 3 },
                { id: "feuerdrache", copies: 2 },
                { id: "heiltrank", copies: 2 },
                { id: "schildsegen", copies: 2 },
                { id: "giftklinge", copies: 2 },
                { id: "asteroid", copies: 1 },
                { id: "letzter_wille", copies: 1 },
                { id: "reinigung", copies: 1 },
                { id: "stille", copies: 1 },
                { id: "entzauberung", copies: 1 },
                { id: "arkaner_motor", copies: 1 }
            ]
        },
        hard: {
            label: "Aggro-Finisher",
            cards: [
                { id: "ritter", copies: 3 },
                { id: "feuerball", copies: 3 },
                { id: "feuerdrache", copies: 3 },
                { id: "giftklinge", copies: 3 },
                { id: "hinrichtung", copies: 2 },
                { id: "asteroid", copies: 1 },
                { id: "letzter_wille", copies: 1 },
                { id: "heiltrank", copies: 1 },
                { id: "schildsegen", copies: 1 },
                { id: "stille", copies: 1 },
                { id: "provokation", copies: 1 },
                { id: "arkaner_motor", copies: 1 }
            ]
        }
    };

    const AI_PERSONALITY_PROFILES = {
        balanced: {
            label: "Ausgewogen",
            damageWeight: 1,
            statusWeight: 1,
            healWeight: 1,
            shieldWeight: 1,
            finisherWeight: 1
        },
        berserker: {
            label: "Berserker",
            damageWeight: 1.3,
            statusWeight: 1.05,
            healWeight: 0.7,
            shieldWeight: 0.65,
            finisherWeight: 1.35
        },
        tactician: {
            label: "Taktiker",
            damageWeight: 0.95,
            statusWeight: 1.35,
            healWeight: 1.0,
            shieldWeight: 1.05,
            finisherWeight: 1.1
        },
        guardian: {
            label: "Wächter",
            damageWeight: 0.85,
            statusWeight: 0.95,
            healWeight: 1.3,
            shieldWeight: 1.35,
            finisherWeight: 0.95
        },
        executioner: {
            label: "Henker",
            damageWeight: 1.1,
            statusWeight: 0.9,
            healWeight: 0.85,
            shieldWeight: 0.85,
            finisherWeight: 1.5
        }
    };

    const AI_ARCHETYPE_PROFILES = {
        balanced: {
            label: "Ausgewogen",
            description: "Keine klaren Extreme.",
            damageWeight: 1,
            statusWeight: 1,
            healWeight: 1,
            shieldWeight: 1,
            finisherWeight: 1
        },
        poison: {
            label: "Gift-KI",
            description: "Stark bei DoT/Status, schwach im direkten Burst.",
            damageWeight: 0.85,
            statusWeight: 1.45,
            healWeight: 0.9,
            shieldWeight: 0.9,
            finisherWeight: 0.92
        },
        shield: {
            label: "Schild-KI",
            description: "Stark defensiv mit Schild/Heilung, schwacher Finisher.",
            damageWeight: 0.82,
            statusWeight: 0.95,
            healWeight: 1.2,
            shieldWeight: 1.55,
            finisherWeight: 0.8
        },
        burst: {
            label: "Burst-KI",
            description: "Stark im Direktschaden/Finisher, schwach in Sustain.",
            damageWeight: 1.35,
            statusWeight: 0.9,
            healWeight: 0.7,
            shieldWeight: 0.72,
            finisherWeight: 1.35
        }
    };

    const AI_ARCHETYPE_DECKS = {
        poison: {
            easy: [
                { id: "ritter", copies: 2 },
                { id: "giftklinge", copies: 3 },
                { id: "feuerball", copies: 2 },
                { id: "heiltrank", copies: 2 },
                { id: "schildsegen", copies: 2 },
                { id: "reinigung", copies: 1 },
                { id: "stille", copies: 1 }
            ],
            medium: [
                { id: "ritter", copies: 2 },
                { id: "giftklinge", copies: 4 },
                { id: "feuerball", copies: 3 },
                { id: "feuerdrache", copies: 1 },
                { id: "heiltrank", copies: 2 },
                { id: "schildsegen", copies: 1 },
                { id: "reinigung", copies: 1 },
                { id: "letzter_wille", copies: 1 },
                { id: "entzauberung", copies: 1 }
            ],
            hard: [
                { id: "ritter", copies: 2 },
                { id: "giftklinge", copies: 4 },
                { id: "feuerball", copies: 3 },
                { id: "feuerdrache", copies: 2 },
                { id: "heiltrank", copies: 1 },
                { id: "schildsegen", copies: 1 },
                { id: "reinigung", copies: 1 },
                { id: "letzter_wille", copies: 1 },
                { id: "entzauberung", copies: 1 }
            ]
        },
        shield: {
            easy: [
                { id: "ritter", copies: 3 },
                { id: "heiltrank", copies: 3 },
                { id: "schildsegen", copies: 4 },
                { id: "feuerball", copies: 1 },
                { id: "giftklinge", copies: 1 },
                { id: "provokation", copies: 1 }
            ],
            medium: [
                { id: "ritter", copies: 3 },
                { id: "heiltrank", copies: 3 },
                { id: "schildsegen", copies: 4 },
                { id: "feuerball", copies: 2 },
                { id: "letzter_wille", copies: 1 },
                { id: "reinigung", copies: 1 },
                { id: "provokation", copies: 1 },
                { id: "arkaner_motor", copies: 1 }
            ],
            hard: [
                { id: "ritter", copies: 3 },
                { id: "heiltrank", copies: 3 },
                { id: "schildsegen", copies: 4 },
                { id: "feuerball", copies: 2 },
                { id: "feuerdrache", copies: 1 },
                { id: "letzter_wille", copies: 1 },
                { id: "reinigung", copies: 1 },
                { id: "provokation", copies: 1 },
                { id: "arkaner_motor", copies: 1 }
            ]
        },
        burst: {
            easy: [
                { id: "ritter", copies: 3 },
                { id: "feuerball", copies: 3 },
                { id: "feuerdrache", copies: 2 },
                { id: "heiltrank", copies: 1 },
                { id: "schildsegen", copies: 1 },
                { id: "stille", copies: 1 }
            ],
            medium: [
                { id: "ritter", copies: 3 },
                { id: "feuerball", copies: 4 },
                { id: "feuerdrache", copies: 3 },
                { id: "asteroid", copies: 1 },
                { id: "hinrichtung", copies: 1 },
                { id: "heiltrank", copies: 1 },
                { id: "stille", copies: 1 }
            ],
            hard: [
                { id: "ritter", copies: 3 },
                { id: "feuerball", copies: 4 },
                { id: "feuerdrache", copies: 3 },
                { id: "asteroid", copies: 1 },
                { id: "hinrichtung", copies: 2 },
                { id: "heiltrank", copies: 1 },
                { id: "stille", copies: 1 },
                { id: "entzauberung", copies: 1 }
            ]
        }
    };

    const ROUND_EVENT_POOL = [
        {
            id: "solar_wind",
            type: "Wetter",
            name: "Sonnenwind",
            description: "+1 Direktschaden für alle Angriffe",
            modifiers: { directDamageDelta: 1 }
        },
        {
            id: "toxic_mist",
            type: "Wetter",
            name: "Giftnebel",
            description: "+1 Schaden bei Burn/Poison-Ticks",
            modifiers: { statusTickDelta: 1 }
        },
        {
            id: "holy_rain",
            type: "Wetter",
            name: "Heilregen",
            description: "+1 Heilung auf alle Heal-Effekte",
            modifiers: { healDelta: 1 }
        },
        {
            id: "forge_anvil",
            type: "Artefakt",
            name: "Runenamboss",
            description: "+1 Schild auf alle Schild-Effekte",
            modifiers: { shieldDelta: 1 }
        },
        {
            id: "mana_orb",
            type: "Artefakt",
            name: "Mana-Orb",
            description: "+1 Mana pro Zug für beide",
            modifiers: { manaDelta: 1 }
        }
    ];

    const MATCH_RELIC_POOL = [
        {
            id: "relic_blade",
            type: "Relikt",
            name: "Klinge des Kriegers",
            minLevel: 1,
            description: "+1 Direktschaden im gesamten Match",
            modifiers: { directDamageDelta: 1 }
        },
        {
            id: "relic_chalice",
            type: "Relikt",
            name: "Heilkelch",
            minLevel: 4,
            description: "+1 Heilung im gesamten Match",
            modifiers: { healDelta: 1 }
        },
        {
            id: "relic_bulwark",
            type: "Relikt",
            name: "Bastion-Siegel",
            minLevel: 7,
            description: "+1 Schild im gesamten Match",
            modifiers: { shieldDelta: 1 }
        },
        {
            id: "relic_toxin",
            type: "Relikt",
            name: "Toxischer Fokus",
            minLevel: 10,
            description: "+1 Status-Tick-Schaden im gesamten Match",
            modifiers: { statusTickDelta: 1 }
        },
        {
            id: "relic_orb",
            type: "Relikt",
            name: "Arkane Sphäre",
            minLevel: 13,
            description: "+1 Mana pro Zug im gesamten Match",
            modifiers: { manaDelta: 1 }
        }
    ];
    const BOSS_RELIC_POOL = [
        {
            id: "boss_ash_crown",
            type: "Boss-Relikt",
            name: "Krone der Aschenfront",
            description: "+2 Direktschaden im Match",
            modifiers: { directDamageDelta: 2 }
        },
        {
            id: "boss_ash_core",
            type: "Boss-Relikt",
            name: "Glutkern",
            description: "+2 Mana pro Zug im Match",
            modifiers: { manaDelta: 2 }
        },
        {
            id: "boss_ash_bastion",
            type: "Boss-Relikt",
            name: "Aschenbastion",
            description: "+2 Schild auf alle Schild-Effekte",
            modifiers: { shieldDelta: 2 }
        },
        {
            id: "boss_verdant_thorn",
            type: "Boss-Relikt",
            name: "Dornenidol",
            description: "+2 Status-Tick-Schaden im Match",
            modifiers: { statusTickDelta: 2 }
        },
        {
            id: "boss_verdant_vial",
            type: "Boss-Relikt",
            name: "Fluchessenz",
            description: "+2 Heilung auf alle Heal-Effekte",
            modifiers: { healDelta: 2 }
        },
        {
            id: "boss_verdant_ward",
            type: "Boss-Relikt",
            name: "Smaragdwacht",
            description: "+1 Status-Tick-Schaden und +1 Schild",
            modifiers: { statusTickDelta: 1, shieldDelta: 1 }
        },
        {
            id: "boss_spire_sigil",
            type: "Boss-Relikt",
            name: "Siegel des Aetherturms",
            description: "+1 Direktschaden und +1 Heilung",
            modifiers: { directDamageDelta: 1, healDelta: 1 }
        },
        {
            id: "boss_spire_prism",
            type: "Boss-Relikt",
            name: "Prisma des Regenten",
            description: "+1 Mana und +1 Schild im Match",
            modifiers: { manaDelta: 1, shieldDelta: 1 }
        },
        {
            id: "boss_spire_edict",
            type: "Boss-Relikt",
            name: "Edikt der Sphaeren",
            description: "+1 Direktschaden und +1 Status-Tick-Schaden",
            modifiers: { directDamageDelta: 1, statusTickDelta: 1 }
        }
    ];
    const BOSS_RELIC_REWARDS_BY_NODE = {
        ash_3: ["boss_ash_crown", "boss_ash_core", "boss_ash_bastion"],
        verdant_3: ["boss_verdant_thorn", "boss_verdant_vial", "boss_verdant_ward"],
        spire_3: ["boss_spire_sigil", "boss_spire_prism", "boss_spire_edict"]
    };

    const DAILY_QUEST_POOL = [
        { id: "daily_cards", title: "Spiele 6 Karten", metric: "cardsPlayed", target: 6, rewardXp: 40 },
        { id: "daily_damage", title: "Verursache 28 Schaden", metric: "damageDealt", target: 28, rewardXp: 45 },
        { id: "daily_draws", title: "Ziehe 4 Karten", metric: "cardsDrawn", target: 4, rewardXp: 35 },
        { id: "daily_ability", title: "Nutze 3x Fokus", metric: "abilitiesUsed", target: 3, rewardXp: 35 },
        { id: "daily_win", title: "Gewinne 1 Match", metric: "wins", target: 1, rewardXp: 55 }
    ];

    const CHALLENGE_POOL = [
        { id: "challenge_hard_win", title: "Sieg auf Hard", metric: "winsHard", target: 1, rewardXp: 80 },
        { id: "challenge_big_damage", title: "Verursache 70 Schaden", metric: "damageDealt", target: 70, rewardXp: 85 },
        { id: "challenge_many_cards", title: "Spiele 14 Karten", metric: "cardsPlayed", target: 14, rewardXp: 75 },
        { id: "challenge_draw_focus", title: "Ziehe 8 Karten", metric: "cardsDrawn", target: 8, rewardXp: 65 }
    ];
    const WEEKLY_QUEST_POOL = [
        { id: "weekly_cards", title: "Spiele 40 Karten", metric: "cardsPlayed", target: 40, rewardXp: 180 },
        { id: "weekly_damage", title: "Verursache 260 Schaden", metric: "damageDealt", target: 260, rewardXp: 200 },
        { id: "weekly_wins", title: "Gewinne 6 Matches", metric: "wins", target: 6, rewardXp: 220 },
        { id: "weekly_hard_wins", title: "Gewinne 3 Hard-Matches", metric: "winsHard", target: 3, rewardXp: 250 }
    ];
    const COMBAT_SPEED_OPTIONS = {
        fast: { label: "Schnell", multiplier: 0.75 },
        normal: { label: "Normal", multiplier: 1 },
        slow: { label: "Langsam", multiplier: 1.35 }
    };
    const MAX_ACHIEVEMENT_TIER = 10;

    const ACHIEVEMENT_POOL = [
        { id: "ach_cards_100", title: "Kartensammler", description: "Spiele Karten insgesamt", metric: "cardsPlayed", target: 100, rewardXp: 120 },
        { id: "ach_damage_500", title: "Vernichter", description: "Verursache Gesamtschaden", metric: "damageDealt", target: 500, rewardXp: 140 },
        { id: "ach_wins_25", title: "Siegeszug", description: "Gewinne Matches insgesamt", metric: "wins", target: 25, rewardXp: 180 },
        { id: "ach_hard_10", title: "Hardcore", description: "Gewinne Matches auf Hard", metric: "winsHard", target: 10, rewardXp: 220 }
    ];

    const TUTORIAL_STEPS = [
        {
            title: "1. Ziel des Spiels",
            text: "Besiege den Gegner, indem du seine HP auf 0 bringst. Im Standard starten beide mit 50 HP, in der Kampagne koennen Boss-HP hoeher sein.",
            visualClass: "tutorial-visual-goal"
        },
        {
            title: "2. Ressourcen & Aktionen",
            text: "Du spielst mit Mana und Aktionen. Pro Runde hast du 3 Aktionen: Karte spielen, Karte ziehen oder Fokus nutzen (+2 Mana, +2 Schild).",
            visualClass: "tutorial-visual-resources"
        },
        {
            title: "3. Karten, Bedingungen & Rollen",
            text: "Karten kosten Mana und decken Schaden, Heilung, Schild, Status und Spezialeffekte ab. Manche Karten haben Bedingungen wie HP-Grenzen oder brauchen Setups.",
            visualClass: "tutorial-visual-cards"
        },
        {
            title: "4. Status, Kontrolle & Cleanse",
            text: "Burn, Hard-Burn und Poison machen Tick-Schaden ueber Runden. Shield fängt Schaden ab, Silence blockiert Status/Spezial/Fokus, und Cleanse entfernt Effekte.",
            visualClass: "tutorial-visual-status"
        },
        {
            title: "5. Spielmodi: Solo, Kampagne, LAN",
            text: "Neben normalen Matches gibt es die Kampagnen-Karte als Knotenpfad mit Events, Shop, Elite und Boss sowie Fortschritt pro Knoten. LAN 1v1 (Beta) läuft über Host/Join mit Session-Code.",
            visualClass: "tutorial-visual-turn"
        },
        {
            title: "6. Progression & Belohnungen",
            text: "Mit XP steigst du im Level auf und schaltest Relikte, Kosmetik und Titel frei. Tages-/Wochenquests, Challenges und Achievements geben zusätzliche XP.",
            visualClass: "tutorial-visual-events"
        },
        {
            title: "7. Menue, Settings & Feintuning",
            text: "Im Menue findest du Statistik, Kartenindex, Belohnungen und Settings wie Kampf-Tempo, Kombos, Audio und Accessibility. Im Mod-Bereich gibt es Admin-Tools fuer Resets/Testen.",
            visualClass: "tutorial-visual-progression"
        }
    ];
    const COSMETIC_REWARDS = [
        { id: "initiand", title: "Initiand", minLevel: 1, panelClass: "cosmetic-initiand" },
        { id: "ember", title: "Funkenrufer", minLevel: 3, panelClass: "cosmetic-ember" },
        { id: "ward", title: "Runenwächter", minLevel: 5, panelClass: "cosmetic-ward" },
        { id: "aether", title: "Aether-Champion", minLevel: 8, panelClass: "cosmetic-aether" },
        { id: "eclipse", title: "Eklipsenmeister", minLevel: 10, panelClass: "cosmetic-eclipse" },
        { id: "frost", title: "Frostseher", minLevel: 12, panelClass: "cosmetic-frost" },
        { id: "storm", title: "Sturmbringer", minLevel: 14, panelClass: "cosmetic-storm" },
        { id: "void", title: "Leerenwanderer", minLevel: 16, panelClass: "cosmetic-void" },
        { id: "dawn", title: "Morgenklinge", minLevel: 18, panelClass: "cosmetic-dawn" },
        { id: "mythic", title: "Mythischer Aetherlord", minLevel: 20, panelClass: "cosmetic-mythic" }
    ];

    const MENU_PANEL_COSMETIC_CLASSES = [...new Set(COSMETIC_REWARDS.map((reward) => reward.panelClass))];
    const GAME_BG_COSMETIC_CLASSES = COSMETIC_REWARDS.map((reward) => `game-cosmetic-${reward.id}`);
    const MOD_PASSWORD = "Levy_Otter";
    const CAMPAIGN_REGIONS = [
        {
            id: "ashen_frontier",
            name: "Aschenfront",
            description: "Verbrannte Lande mit aggressiven Feuerkultisten.",
            nodes: [
                {
                    id: "ash_event_1",
                    nodeType: "event",
                    title: "Funkenaltar",
                    description: "Du kanalisierst Restenergie aus alten Runen.",
                    rewards: { xp: 25, playerStartManaBonus: 1 }
                },
                { id: "ash_1", nodeType: "battle", enemyName: "Glutspäher", difficulty: "easy", enemyHp: 46, personalityId: "berserker", archetypeId: "burst" },
                {
                    id: "ash_shop_1",
                    nodeType: "shop",
                    title: "Karawanenmarkt",
                    description: "Ein wandernder Händler härtet deine Ausruestung.",
                    rewards: { xp: 20, playerMaxHpBonus: 4 }
                },
                { id: "ash_2", nodeType: "elite", enemyName: "Brandritter", difficulty: "hard", enemyHp: 56, personalityId: "tactician", archetypeId: "burst" },
                {
                    id: "ash_3",
                    nodeType: "boss",
                    enemyName: "Aschenfuerst",
                    difficulty: "hard",
                    enemyHp: 56,
                    personalityId: "berserker",
                    archetypeId: "burst",
                    signatureCardId: "asteroid",
                    phase2: {
                        name: "Aschenzorn",
                        onTrigger: { mana: 2, shield: 5 },
                        bonuses: { damage: 2, shield: 1 }
                    }
                }
            ]
        },
        {
            id: "verdant_hollows",
            name: "Smaragdtiefen",
            description: "Giftige Ruinen mit ausdauernden Gegnern.",
            nodes: [
                {
                    id: "verdant_event_1",
                    nodeType: "event",
                    title: "Moornexus",
                    description: "Ein uralter Geist segnet deinen Pfad.",
                    rewards: { xp: 25, playerMaxHpBonus: 3 }
                },
                { id: "verdant_1", nodeType: "battle", enemyName: "Mooralchimist", difficulty: "medium", enemyHp: 52, personalityId: "tactician", archetypeId: "poison" },
                {
                    id: "verdant_shop_1",
                    nodeType: "shop",
                    title: "Pilzhändler",
                    description: "Du tauschst Vorrat gegen fokussierte Essenzen.",
                    rewards: { xp: 20, playerStartManaBonus: 1 }
                },
                { id: "verdant_2", nodeType: "elite", enemyName: "Dornenwächter", difficulty: "hard", enemyHp: 60, personalityId: "guardian", archetypeId: "shield" },
                {
                    id: "verdant_3",
                    nodeType: "boss",
                    enemyName: "Gruenfluch-Orakel",
                    difficulty: "hard",
                    enemyHp: 60,
                    personalityId: "executioner",
                    archetypeId: "poison",
                    signatureCardId: "giftklinge",
                    phase2: {
                        name: "Smaragdhass",
                        onTrigger: { heal: 6, shield: 4 },
                        bonuses: { damage: 1, heal: 2 }
                    }
                }
            ]
        },
        {
            id: "aether_spire",
            name: "Aetherturm",
            description: "Elitemagier mit maximalem Druck im Endpfad.",
            nodes: [
                {
                    id: "spire_event_1",
                    nodeType: "event",
                    title: "Archivsplitter",
                    description: "Ein zersplittertes Archiv gibt taktisches Wissen frei.",
                    rewards: { xp: 30, bonusXpOnWin: 10 }
                },
                { id: "spire_1", nodeType: "battle", enemyName: "Runenarchivar", difficulty: "hard", enemyHp: 58, personalityId: "tactician", archetypeId: "shield" },
                {
                    id: "spire_shop_1",
                    nodeType: "shop",
                    title: "Aether-Basar",
                    description: "Du lässt deine Kanalisatoren neu ausrichten.",
                    rewards: { xp: 20, playerStartManaBonus: 1, playerMaxHpBonus: 2 }
                },
                { id: "spire_2", nodeType: "elite", enemyName: "Sphärenrichter", difficulty: "hard", enemyHp: 64, personalityId: "executioner", archetypeId: "burst" },
                {
                    id: "spire_3",
                    nodeType: "boss",
                    enemyName: "Aether-Regent",
                    difficulty: "hard",
                    enemyHp: 66,
                    personalityId: "executioner",
                    archetypeId: "burst",
                    signatureCardId: "hinrichtung",
                    phase2: {
                        name: "Aetherbruch",
                        onTrigger: { mana: 2, heal: 5 },
                        bonuses: { damage: 2, heal: 1, shield: 1 }
                    }
                }
            ]
        }
    ];
    const CAMPAIGN_TITLE_REWARDS = [
        { id: "title_wanderer", title: "Wanderer", regionId: "", requiredClears: 0 },
        { id: "title_ashen_conqueror", title: "Aschenbezwinger", regionId: "ashen_frontier", requiredClears: 3 },
        { id: "title_verdant_slayer", title: "Fluchbrecher der Tiefen", regionId: "verdant_hollows", requiredClears: 3 },
        { id: "title_aether_lord", title: "Aether-Überwinder", regionId: "aether_spire", requiredClears: 3 }
    ];
    const SHOP_CURRENCY_NAME = "Aether-Marken";
    const SHOP_BOSS_CURRENCY_NAME = "Boss-Siegel";
    const DAILY_FREE_REROLLS = 1;
    const DAILY_MAX_PAID_REROLLS = 4;
    const DAILY_BASE_REROLL_COST = 20;
    const RELIC_UPGRADE_MAX_LEVEL = 5;
    const RELIC_UPGRADE_MARK_COST = 80;
    const RELIC_UPGRADE_DUST_COST = 1;
    const CARD_BACK_REWARDS = [
        { id: "back_initiand", title: "Initianden-Ruecken", minLevel: 1 },
        { id: "back_ember", title: "Glutlauf-Ruecken", minLevel: 4 },
        { id: "back_verdant", title: "Smaragdrand-Ruecken", minLevel: 7 },
        { id: "back_ward", title: "Runenschild-Ruecken", minLevel: 10 },
        { id: "back_eclipse", title: "Eklipsen-Ruecken", minLevel: 13 },
        { id: "back_mythic", title: "Mythischer Ruecken", minLevel: 16 }
    ];
    const CARD_BACK_PREVIEW_CLASSES = CARD_BACK_REWARDS.map((entry) => `menu-cardback-theme-${entry.id.replace(/_/g, "-")}`);
    const SHOP_UTILITY_ITEMS = [
        {
            id: "utility_relic_dust",
            title: "Reliktstaub",
            rarity: "rare",
            description: "+1 Reliktstaub fuer Relikt-Upgrades.",
            grant: { relicDust: 1 }
        },
        {
            id: "utility_boost_mana",
            title: "Runenbooster: Mana",
            rarity: "epic",
            description: "Naechstes Match: +1 Start-Mana.",
            grant: { boosterStartMana: 1 }
        },
        {
            id: "utility_boost_vigor",
            title: "Runenbooster: Vitalitaet",
            rarity: "epic",
            description: "Naechstes Match: +6 Max-HP.",
            grant: { boosterMaxHp: 1 }
        }
    ];
    const DAILY_SHOP_SLOTS = [
        { id: "slot_cosmetic", type: "cosmetic", rarity: "rare", currency: "marks" },
        { id: "slot_title", type: "title", rarity: "epic", currency: "marks" },
        { id: "slot_card_back", type: "card_back", rarity: "rare", currency: "marks" }
    ];
    const WEEKLY_SHOP_SLOTS = [
        { id: "weekly_unlock", type: "unlockable", rarity: "legendary", currency: "seals" },
        { id: "weekly_utility", type: "utility", rarity: "epic", currency: "marks" }
    ];
    const SHOP_PRICE_BY_RARITY = {
        marks: { common: 70, rare: 110, epic: 170, legendary: 260 },
        seals: { common: 1, rare: 2, epic: 3, legendary: 4 }
    };
    const BOSS_SEALS_PER_BOSS_WIN = 1;

    const Utils = {
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        classNameFromCard(cardName) {
            return cardName.replace(/[^a-zA-Z]/g, "");
        }
    };

    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.masterVolume = 0.06;
            this.volume = 1;
            this.muted = false;
            this.channelVolumes = {
                ui: 1,
                combat: 1,
                events: 1
            };
        }

        initFromUserGesture() {
            try {
                this.ensureContext();
            } catch (error) {
                // Ignore audio init issues on unsupported/blocked environments.
            }
        }

        ensureContext() {
            if (!this.ctx) {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (!Ctx) {
                    return null;
                }
                this.ctx = new Ctx();
            }
            if (this.ctx.state === "suspended") {
                this.ctx.resume();
            }
            return this.ctx;
        }

        tone(freq, duration, type = "sine", volumeScale = 1, delay = 0, channel = "combat") {
            if (this.muted || this.volume <= 0) {
                return;
            }
            const ctx = this.ensureContext();
            if (!ctx) {
                return;
            }
            const channelVolume = this.getChannelVolume(channel);
            if (channelVolume <= 0) {
                return;
            }
            const now = ctx.currentTime + Math.max(0, delay);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(this.masterVolume * this.volume * channelVolume * volumeScale, now + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + duration + 0.03);
        }

        play(name) {
            if (this.muted) {
                return;
            }
            const ctx = this.ensureContext();
            if (!ctx) {
                return;
            }

            if (name === "uiClick") {
                this.tone(620, 0.08, "triangle", 0.55, 0, "ui");
                return;
            }
            if (name === "hit") {
                this.tone(170, 0.11, "sawtooth", 0.85, 0, "combat");
                return;
            }
            if (name === "heal") {
                this.tone(500, 0.12, "sine", 0.75, 0, "combat");
                this.tone(650, 0.15, "sine", 0.55, 0.03, "combat");
                return;
            }
            if (name === "tick") {
                this.tone(240, 0.09, "square", 0.62, 0, "combat");
                return;
            }
            if (name === "crit") {
                this.tone(280, 0.12, "sawtooth", 0.95, 0, "combat");
                this.tone(860, 0.16, "triangle", 0.7, 0.03, "combat");
                return;
            }
            if (name === "shieldBreak") {
                this.tone(900, 0.08, "triangle", 0.75, 0, "combat");
                this.tone(420, 0.14, "square", 0.7, 0.02, "combat");
                return;
            }
            if (name === "turnToAi") {
                this.tone(320, 0.11, "triangle", 0.7, 0, "events");
                this.tone(240, 0.11, "triangle", 0.62, 0.06, "events");
                return;
            }
            if (name === "turnToPlayer") {
                this.tone(300, 0.1, "triangle", 0.66, 0, "events");
                this.tone(470, 0.12, "triangle", 0.74, 0.06, "events");
            }
        }

        setVolume(value) {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) {
                return;
            }
            this.volume = Math.max(0, Math.min(1, parsed));
        }

        setMuted(flag) {
            this.muted = Boolean(flag);
        }

        setChannelVolume(channel, value) {
            if (!this.channelVolumes || !Object.prototype.hasOwnProperty.call(this.channelVolumes, channel)) {
                return;
            }
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) {
                return;
            }
            this.channelVolumes[channel] = Math.max(0, Math.min(1, parsed));
        }

        getChannelVolume(channel) {
            if (!this.channelVolumes || !Object.prototype.hasOwnProperty.call(this.channelVolumes, channel)) {
                return 1;
            }
            return this.channelVolumes[channel];
        }

        getSettings() {
            return {
                volume: this.volume,
                muted: this.muted,
                channels: {
                    ui: this.getChannelVolume("ui"),
                    combat: this.getChannelVolume("combat"),
                    events: this.getChannelVolume("events")
                }
            };
        }

        applySettings(settings) {
            if (!settings || typeof settings !== "object") {
                return;
            }
            this.setVolume(settings.volume);
            this.setMuted(settings.muted);
            const channels = settings.channels || {};
            this.setChannelVolume("ui", Number.isFinite(channels.ui) ? channels.ui : 1);
            this.setChannelVolume("combat", Number.isFinite(channels.combat) ? channels.combat : 1);
            this.setChannelVolume("events", Number.isFinite(channels.events) ? channels.events : 1);
        }
    }

    class Deck {
        constructor(seedCards) {
            this.baseCards = seedCards;
            this.drawPile = [];
            this.discardPile = [];
            this.reset();
        }

        reset() {
            this.drawPile = [];
            this.discardPile = [];

            this.baseCards.forEach((cardDef) => {
                for (let i = 0; i < cardDef.copies; i++) {
                    this.drawPile.push({ ...cardDef });
                }
            });

            Utils.shuffle(this.drawPile);
        }

        draw() {
            if (this.drawPile.length === 0 && this.discardPile.length > 0) {
                this.drawPile = Utils.shuffle([...this.discardPile]);
                this.discardPile = [];
            }

            if (this.drawPile.length === 0) {
                return null;
            }

            return this.drawPile.pop();
        }

        discard(card) {
            this.discardPile.push(card);
        }
    }

    class Combatant {
        constructor(maxHp, startMana) {
            this.maxHp = maxHp;
            this.hp = maxHp;
            this.mana = startMana;
            this.hand = [];
            this.statuses = {};
            this.resetStatuses();
        }

        reset(startMana) {
            this.hp = this.maxHp;
            this.mana = startMana;
            this.hand = [];
            this.resetStatuses();
        }

        resetStatuses() {
            this.statuses = {
                burn: { turns: 0, damage: 0 },
                hardBurn: { turns: 0, damage: 0 },
                poison: { turns: 0, damage: 0 },
                shield: 0,
                silenceTurns: 0,
                tauntTurns: 0
            };
        }

        getTotalDotDamage() {
            return this.statuses.burn.damage + this.statuses.hardBurn.damage + this.statuses.poison.damage;
        }

        addStatusEffect(kind, turns, damage) {
            const current = this.statuses[kind];
            if (!current || turns <= 0 || damage <= 0) {
                return;
            }
            current.turns += turns;
            current.damage = Math.max(current.damage, damage);
        }

        addShield(value) {
            if (value > 0) {
                this.statuses.shield += value;
            }
        }

        hasNegativeStatus() {
            return this.statuses.burn.turns > 0 || this.statuses.hardBurn.turns > 0 || this.statuses.poison.turns > 0;
        }

        clearNegativeStatuses() {
            let removed = 0;
            ["burn", "hardBurn", "poison"].forEach((kind) => {
                if (this.statuses[kind].turns > 0 || this.statuses[kind].damage > 0) {
                    removed += 1;
                }
                this.statuses[kind].turns = 0;
                this.statuses[kind].damage = 0;
            });
            return removed;
        }

        addSilence(turns) {
            const value = Math.max(0, Math.floor(turns || 0));
            if (value > 0) {
                this.statuses.silenceTurns += value;
            }
        }

        addTaunt(turns) {
            const value = Math.max(0, Math.floor(turns || 0));
            if (value > 0) {
                this.statuses.tauntTurns += value;
            }
        }

        clearControlStatuses() {
            let removed = 0;
            if (this.statuses.silenceTurns > 0) {
                removed += 1;
            }
            if (this.statuses.tauntTurns > 0) {
                removed += 1;
            }
            this.statuses.silenceTurns = 0;
            this.statuses.tauntTurns = 0;
            return removed;
        }

        clearDispellableEffects(removeShield = true) {
            const negative = this.clearNegativeStatuses();
            const control = this.clearControlStatuses();
            let shieldRemoved = 0;
            if (removeShield && this.statuses.shield > 0) {
                shieldRemoved = this.statuses.shield;
                this.statuses.shield = 0;
            }
            return {
                negativeRemoved: negative,
                controlRemoved: control,
                shieldRemoved
            };
        }

        receiveDamage(value) {
            let pendingDamage = Math.max(0, value);
            let absorbed = 0;
            const shieldBefore = this.statuses.shield;
            if (this.statuses.shield > 0 && pendingDamage > 0) {
                absorbed = Math.min(this.statuses.shield, pendingDamage);
                this.statuses.shield -= absorbed;
                pendingDamage -= absorbed;
            }
            this.hp = Math.max(0, this.hp - pendingDamage);
            return {
                dealt: pendingDamage,
                absorbed,
                shieldBroken: shieldBefore > 0 && this.statuses.shield <= 0
            };
        }

        receiveHeal(value) {
            this.hp = Math.min(this.maxHp, this.hp + value);
        }
    }

    class UI {
        constructor() {
            this.pauseMenu = document.getElementById("pause-menu");
            this.pauseResumeBtn = document.getElementById("pause-resume-btn");
            this.pauseMainMenuBtn = document.getElementById("pause-mainmenu-btn");
            this.mainMenu = document.getElementById("main-menu");
            this.menuPanel = document.querySelector(".menu-panel");
            this.menuHome = document.getElementById("menu-home");
            this.menuIndex = document.getElementById("menu-index");
            this.menuResult = document.getElementById("menu-result");
            this.menuRecord = document.getElementById("menu-record");
            this.menuLevel = document.getElementById("menu-level");
            this.menuCosmeticCurrent = document.getElementById("menu-cosmetic-current");
            this.menuCosmeticUnlocked = document.getElementById("menu-cosmetic-unlocked");
            this.menuCosmeticPrevBtn = document.getElementById("menu-cosmetic-prev-btn");
            this.menuCosmeticNextBtn = document.getElementById("menu-cosmetic-next-btn");
            this.menuRelicCurrent = document.getElementById("menu-relic-current");
            this.menuRelicUnlocked = document.getElementById("menu-relic-unlocked");
            this.menuCampaignTitleCurrent = document.getElementById("menu-campaign-title-current");
            this.menuCampaignTitleUnlocked = document.getElementById("menu-campaign-title-unlocked");
            this.menuTitlePrevBtn = document.getElementById("menu-title-prev-btn");
            this.menuTitleNextBtn = document.getElementById("menu-title-next-btn");
            this.menuRelicPrevBtn = document.getElementById("menu-relic-prev-btn");
            this.menuRelicNextBtn = document.getElementById("menu-relic-next-btn");
            this.menuXpFill = document.getElementById("menu-xp-fill");
            this.menuXpText = document.getElementById("menu-xp-text");
            this.menuDailyQuestTitle = document.getElementById("menu-daily-quest-title");
            this.menuDailyQuestProgress = document.getElementById("menu-daily-quest-progress");
            this.menuDailyQuestReward = document.getElementById("menu-daily-quest-reward");
            this.menuChallengeTitle = document.getElementById("menu-challenge-title");
            this.menuChallengeProgress = document.getElementById("menu-challenge-progress");
            this.menuChallengeReward = document.getElementById("menu-challenge-reward");
            this.menuWeeklyQuestTitle = document.getElementById("menu-weekly-quest-title");
            this.menuWeeklyQuestProgress = document.getElementById("menu-weekly-quest-progress");
            this.menuWeeklyQuestReward = document.getElementById("menu-weekly-quest-reward");
            this.menuAchievementSummary = document.getElementById("menu-achievement-summary");
            this.menuAchievementList = document.getElementById("menu-achievement-list");
            this.menuStartBtn = document.getElementById("menu-start-btn");
            this.menuFullscreenBtn = document.getElementById("menu-fullscreen-btn");
            this.menuIndexBtn = document.getElementById("menu-index-btn");
            this.menuBackBtn = document.getElementById("menu-back-btn");
            this.menuTutorialBtn = document.getElementById("menu-tutorial-btn");
            this.menuRewardsBtn = document.getElementById("menu-rewards-btn");
            this.menuStatsBtn = document.getElementById("menu-stats-btn");
            this.menuSettingsBtn = document.getElementById("menu-settings-btn");
            this.menuModBtn = document.getElementById("menu-mod-btn");
            this.menuLanBtn = document.getElementById("menu-lan-btn");
            this.menuCustomizeBtn = document.getElementById("menu-customize-btn");
            this.menuCampaignStatus = document.getElementById("menu-campaign-status");
            this.menuLan = document.getElementById("menu-lan");
            this.menuLanLobby = document.getElementById("menu-lan-lobby");
            this.menuLanPlayerName = document.getElementById("menu-lan-player-name");
            this.menuLanHostAddress = document.getElementById("menu-lan-host-address");
            this.menuLanShareUrl = document.getElementById("menu-lan-share-url");
            this.menuLanStatus = document.getElementById("menu-lan-status");
            this.menuLanHostBtn = document.getElementById("menu-lan-host-btn");
            this.menuLanJoinBtn = document.getElementById("menu-lan-join-btn");
            this.menuLanCopyUrlBtn = document.getElementById("menu-lan-copy-url-btn");
            this.menuLanBackBtn = document.getElementById("menu-lan-back-btn");
            this.menuLanLobbyStatus = document.getElementById("menu-lan-lobby-status");
            this.menuLanReadyBtn = document.getElementById("menu-lan-ready-btn");
            this.menuLanCancelBtn = document.getElementById("menu-lan-cancel-btn");
            this.menuCustomize = document.getElementById("menu-customize");
            this.menuCustomizeCosmeticCurrent = document.getElementById("menu-customize-cosmetic-current");
            this.menuCustomizeCosmeticUnlocked = document.getElementById("menu-customize-cosmetic-unlocked");
            this.menuCustomizeCosmeticPrevBtn = document.getElementById("menu-customize-cosmetic-prev-btn");
            this.menuCustomizeCosmeticNextBtn = document.getElementById("menu-customize-cosmetic-next-btn");
            this.menuCustomizeCardBackCurrent = document.getElementById("menu-customize-cardback-current");
            this.menuCustomizeCardBackUnlocked = document.getElementById("menu-customize-cardback-unlocked");
            this.menuCustomizeCardBackPreview = document.getElementById("menu-customize-cardback-preview");
            this.menuCustomizeCardBackPrevBtn = document.getElementById("menu-customize-cardback-prev-btn");
            this.menuCustomizeCardBackNextBtn = document.getElementById("menu-customize-cardback-next-btn");
            this.menuCustomizeTitleCurrent = document.getElementById("menu-customize-title-current");
            this.menuCustomizeTitleUnlocked = document.getElementById("menu-customize-title-unlocked");
            this.menuCustomizeTitlePrevBtn = document.getElementById("menu-customize-title-prev-btn");
            this.menuCustomizeTitleNextBtn = document.getElementById("menu-customize-title-next-btn");
            this.menuCustomizeBackBtn = document.getElementById("menu-customize-back-btn");
            this.menuCampaignBtn = document.getElementById("menu-campaign-btn");
            this.menuShopBtn = document.getElementById("menu-shop-btn");
            this.menuCampaign = document.getElementById("menu-campaign");
            this.menuCampaignRun = document.getElementById("menu-campaign-run");
            this.menuCampaignRegion = document.getElementById("menu-campaign-region");
            this.menuCampaignPath = document.getElementById("menu-campaign-path");
            this.menuCampaignStartBtn = document.getElementById("menu-campaign-start-btn");
            this.menuCampaignBackBtn = document.getElementById("menu-campaign-back-btn");
            this.menuBossRelic = document.getElementById("menu-boss-relic");
            this.menuBossRelicText = document.getElementById("menu-boss-relic-text");
            this.menuBossRelicOffers = document.getElementById("menu-boss-relic-offers");
            this.menuShop = document.getElementById("menu-shop");
            this.menuShopCurrency = document.getElementById("menu-shop-currency");
            this.menuShopDate = document.getElementById("menu-shop-date");
            this.menuShopOffers = document.getElementById("menu-shop-offers");
            this.menuShopWeeklyOffers = document.getElementById("menu-shop-weekly-offers");
            this.menuShopRerollBtn = document.getElementById("menu-shop-reroll-btn");
            this.menuShopRerollInfo = document.getElementById("menu-shop-reroll-info");
            this.menuShopRelicUpgradeBtn = document.getElementById("menu-shop-relic-upgrade-btn");
            this.menuShopRelicUpgradeInfo = document.getElementById("menu-shop-relic-upgrade-info");
            this.menuShopBackBtn = document.getElementById("menu-shop-back-btn");
            this.menuTutorial = document.getElementById("menu-tutorial");
            this.menuTutorialVisual = document.getElementById("menu-tutorial-visual");
            this.menuTutorialTitle = document.getElementById("menu-tutorial-title");
            this.menuTutorialText = document.getElementById("menu-tutorial-text");
            this.menuTutorialPrevBtn = document.getElementById("menu-tutorial-prev-btn");
            this.menuTutorialNextBtn = document.getElementById("menu-tutorial-next-btn");
            this.menuTutorialBackBtn = document.getElementById("menu-tutorial-back-btn");
            this.menuRewards = document.getElementById("menu-rewards");
            this.menuRewardsCurrentLevel = document.getElementById("menu-rewards-current-level");
            this.menuRewardsList = document.getElementById("menu-rewards-list");
            this.menuRewardsBackBtn = document.getElementById("menu-rewards-back-btn");
            this.menuStats = document.getElementById("menu-stats");
            this.menuStatsDifficulty = document.getElementById("menu-stats-difficulty");
            this.menuStatsCards = document.getElementById("menu-stats-cards");
            this.menuStatsBackBtn = document.getElementById("menu-stats-back-btn");
            this.menuSynergyIndex = document.getElementById("menu-synergy-index");
            this.menuSynergyList = document.getElementById("menu-synergy-list");
            this.menuSynergyBackBtn = document.getElementById("menu-synergy-back-btn");
            this.menuSettings = document.getElementById("menu-settings");
            this.menuSoundVolume = document.getElementById("menu-sound-volume");
            this.menuSoundVolumeText = document.getElementById("menu-sound-volume-text");
            this.menuSoundUiVolume = document.getElementById("menu-sound-ui-volume");
            this.menuSoundUiVolumeText = document.getElementById("menu-sound-ui-volume-text");
            this.menuSoundCombatVolume = document.getElementById("menu-sound-combat-volume");
            this.menuSoundCombatVolumeText = document.getElementById("menu-sound-combat-volume-text");
            this.menuSoundEventsVolume = document.getElementById("menu-sound-events-volume");
            this.menuSoundEventsVolumeText = document.getElementById("menu-sound-events-volume-text");
            this.menuSoundMute = document.getElementById("menu-sound-mute");
            this.menuSoundTestBtn = document.getElementById("menu-sound-test-btn");
            this.menuCombatSpeed = document.getElementById("menu-combat-speed");
            this.menuCombatSynergyEnabled = document.getElementById("menu-combat-synergy-enabled");
            this.menuCombatSynergyInfoBtn = document.getElementById("menu-combat-synergy-info-btn");
            this.menuSettingsTabSound = document.getElementById("menu-settings-tab-sound");
            this.menuSettingsTabCombat = document.getElementById("menu-settings-tab-combat");
            this.menuSettingsTabCosmetic = document.getElementById("menu-settings-tab-cosmetic");
            this.menuSettingsTabCampaignTitle = document.getElementById("menu-settings-tab-campaign-title");
            this.menuSettingsTabAccessibility = document.getElementById("menu-settings-tab-accessibility");
            this.menuSettingsPanelSound = document.getElementById("menu-settings-panel-sound");
            this.menuSettingsPanelCombat = document.getElementById("menu-settings-panel-combat");
            this.menuSettingsPanelCosmetic = document.getElementById("menu-settings-panel-cosmetic");
            this.menuSettingsPanelCampaignTitle = document.getElementById("menu-settings-panel-campaign-title");
            this.menuSettingsPanelAccessibility = document.getElementById("menu-settings-panel-accessibility");
            this.menuAccessibilityFontScale = document.getElementById("menu-accessibility-font-scale");
            this.menuAccessibilityColorblind = document.getElementById("menu-accessibility-colorblind");
            this.menuAccessibilityReducedMotion = document.getElementById("menu-accessibility-reduced-motion");
            this.menuSettingsBackBtn = document.getElementById("menu-settings-back-btn");
            this.menuMod = document.getElementById("menu-mod");
            this.menuModPassword = document.getElementById("menu-mod-password");
            this.menuModUnlockBtn = document.getElementById("menu-mod-unlock-btn");
            this.menuModFeedback = document.getElementById("menu-mod-feedback");
            this.menuModTools = document.getElementById("menu-mod-tools");
            this.menuModCurrentLevel = document.getElementById("menu-mod-current-level");
            this.menuModLevelInput = document.getElementById("menu-mod-level-input");
            this.menuModSetLevelBtn = document.getElementById("menu-mod-set-level-btn");
            this.menuModResetRecordBtn = document.getElementById("menu-mod-reset-record-btn");
            this.menuModResetCampaignBtn = document.getElementById("menu-mod-reset-campaign-btn");
            this.menuModAchievementSelect = document.getElementById("menu-mod-achievement-select");
            this.menuModAchievementPreview = document.getElementById("menu-mod-achievement-preview");
            this.menuModAchievementTierInput = document.getElementById("menu-mod-achievement-tier-input");
            this.menuModSetAchievementTierBtn = document.getElementById("menu-mod-set-achievement-tier-btn");
            this.menuModResetAchievementsBtn = document.getElementById("menu-mod-reset-achievements-btn");
            this.menuModBackBtn = document.getElementById("menu-mod-back-btn");
            this.menuCardIndexList = document.getElementById("menu-card-index-list");
            this.menuSelectedCard = document.getElementById("menu-selected-card");
            this.menuCurrency = document.getElementById("menu-currency");
            this.menuDifficulty = document.getElementById("menu-difficulty");
            this.pauseBtn = document.getElementById("pause-btn");
            this.playerHP = document.getElementById("player-hp");
            this.playerTitle = document.getElementById("player-title");
            this.playerMana = document.getElementById("player-mana");
            this.playerActions = document.getElementById("player-actions");
            this.enemyHP = document.getElementById("enemy-hp");
            this.enemyName = document.getElementById("enemy-name");
            this.enemyMana = document.getElementById("enemy-mana");
            this.enemyActions = document.getElementById("enemy-actions");
            this.playerStatusEffects = document.getElementById("player-status-effects");
            this.enemyStatusEffects = document.getElementById("enemy-status-effects");
            this.playerDamageLog = document.getElementById("player-damage-log");
            this.enemyDamageLog = document.getElementById("enemy-damage-log");
            this.playerActor = document.querySelector(".actor.player");
            this.enemyActor = document.querySelector(".actor.enemy");
            this.playerHand = document.getElementById("player-hand");
            this.aiHand = document.querySelector(".ai-hand");
            this.logMessages = document.getElementById("log-messages");
            this.endTurnBtn = document.getElementById("end-turn");
            this.drawCardBtn = document.getElementById("draw-card");
            this.useAbilityBtn = document.getElementById("use-ability");
            this.difficulty = document.getElementById("difficulty");
            this.roundEvent = document.getElementById("round-event");
            this.matchRelic = document.getElementById("match-relic");
            this.overlay = document.getElementById("message-overlay");
            this.resultTransitionOverlay = document.getElementById("result-transition-overlay");
            this.resultTransitionText = document.getElementById("result-transition-text");
            this.uiTooltip = document.getElementById("ui-tooltip");
            this.fullscreenBtn = document.getElementById("fullscreen-btn");
            this.exitFullscreenBtn = document.getElementById("exit-fullscreen-btn");
            this.fullscreenHint = document.getElementById("fullscreen-hint");
            this.impactQueueDepth = { player: 0, enemy: 0 };
            this.combatSpeedMultiplier = 1;
            this.reducedMotion = false;
            this.activeTooltipAnchor = null;
            this.bindTooltipDelegation();
        }

        bindControls(handlers) {
            this.endTurnBtn.addEventListener("click", handlers.onEndTurn);
            this.drawCardBtn.addEventListener("click", handlers.onDrawCard);
            this.useAbilityBtn.addEventListener("click", handlers.onUseAbility);
            this.difficulty.addEventListener("change", handlers.onDifficultyChange);
            this.menuDifficulty.addEventListener("change", handlers.onMenuDifficultyChange);
            this.menuStartBtn.addEventListener("click", handlers.onMenuStart);
            this.menuFullscreenBtn.addEventListener("click", handlers.onFullscreenStart);
            this.menuIndexBtn.addEventListener("click", handlers.onMenuOpenIndex);
            this.menuTutorialBtn.addEventListener("click", handlers.onMenuOpenTutorial);
            this.menuRewardsBtn.addEventListener("click", handlers.onMenuOpenRewards);
            this.menuStatsBtn.addEventListener("click", handlers.onMenuOpenStats);
            this.menuSettingsBtn.addEventListener("click", handlers.onMenuOpenSettings);
            this.menuModBtn.addEventListener("click", handlers.onMenuOpenMod);
            this.menuLanBtn.addEventListener("click", handlers.onMenuOpenLan);
            if (this.menuCustomizeBtn && handlers.onMenuOpenCustomize) {
                this.menuCustomizeBtn.addEventListener("click", handlers.onMenuOpenCustomize);
            }
            this.menuCampaignBtn.addEventListener("click", handlers.onMenuOpenCampaign);
            if (this.menuShopBtn && handlers.onMenuOpenShop) {
                this.menuShopBtn.addEventListener("click", handlers.onMenuOpenShop);
            }
            this.menuBackBtn.addEventListener("click", handlers.onMenuBackHome);
            if (this.menuCosmeticPrevBtn && this.menuCosmeticNextBtn) {
                this.menuCosmeticPrevBtn.addEventListener("click", handlers.onMenuCosmeticPrev);
                this.menuCosmeticNextBtn.addEventListener("click", handlers.onMenuCosmeticNext);
            }
            if (this.menuTitlePrevBtn && this.menuTitleNextBtn) {
                this.menuTitlePrevBtn.addEventListener("click", handlers.onMenuTitlePrev);
                this.menuTitleNextBtn.addEventListener("click", handlers.onMenuTitleNext);
            }
            this.menuRelicPrevBtn.addEventListener("click", handlers.onMenuRelicPrev);
            this.menuRelicNextBtn.addEventListener("click", handlers.onMenuRelicNext);
            this.menuTutorialPrevBtn.addEventListener("click", handlers.onTutorialPrev);
            this.menuTutorialNextBtn.addEventListener("click", handlers.onTutorialNext);
            this.menuTutorialBackBtn.addEventListener("click", handlers.onTutorialBackHome);
            this.menuRewardsBackBtn.addEventListener("click", handlers.onRewardsBackHome);
            this.menuStatsBackBtn.addEventListener("click", handlers.onStatsBackHome);
            this.menuSettingsBackBtn.addEventListener("click", handlers.onSettingsBackHome);
            this.menuSynergyBackBtn.addEventListener("click", handlers.onSynergyBackSettings);
            this.menuLanPlayerName.addEventListener("input", handlers.onLanPlayerNameInput);
            this.menuLanHostAddress.addEventListener("input", handlers.onLanHostAddressInput);
            this.menuLanHostBtn.addEventListener("click", handlers.onLanHostStart);
            this.menuLanJoinBtn.addEventListener("click", handlers.onLanJoin);
            this.menuLanCopyUrlBtn.addEventListener("click", handlers.onLanCopyUrl);
            this.menuLanBackBtn.addEventListener("click", handlers.onLanBackHome);
            this.menuLanReadyBtn.addEventListener("click", handlers.onLanReady);
            this.menuLanCancelBtn.addEventListener("click", handlers.onLanCancelToSetup);
            this.menuSoundVolume.addEventListener("input", handlers.onSettingsVolumeInput);
            this.menuSoundUiVolume.addEventListener("input", handlers.onSettingsUiVolumeInput);
            this.menuSoundCombatVolume.addEventListener("input", handlers.onSettingsCombatVolumeInput);
            this.menuSoundEventsVolume.addEventListener("input", handlers.onSettingsEventsVolumeInput);
            this.menuSoundMute.addEventListener("change", handlers.onSettingsMuteChange);
            this.menuSoundTestBtn.addEventListener("click", handlers.onSettingsTest);
            this.menuCombatSpeed.addEventListener("change", handlers.onSettingsCombatSpeedChange);
            this.menuCombatSynergyEnabled.addEventListener("change", handlers.onSettingsCombatSynergyChange);
            this.menuCombatSynergyInfoBtn.addEventListener("click", handlers.onSettingsOpenSynergyIndex);
            this.menuSettingsTabSound.addEventListener("click", handlers.onSettingsTabSound);
            this.menuSettingsTabCombat.addEventListener("click", handlers.onSettingsTabCombat);
            this.menuSettingsTabCosmetic.addEventListener("click", handlers.onSettingsTabCosmetic);
            this.menuSettingsTabCampaignTitle.addEventListener("click", handlers.onSettingsTabCampaignTitle);
            this.menuSettingsTabAccessibility.addEventListener("click", handlers.onSettingsTabAccessibility);
            this.menuAccessibilityFontScale.addEventListener("change", handlers.onSettingsFontScaleChange);
            this.menuAccessibilityColorblind.addEventListener("change", handlers.onSettingsColorblindChange);
            this.menuAccessibilityReducedMotion.addEventListener("change", handlers.onSettingsReducedMotionChange);
            this.menuModUnlockBtn.addEventListener("click", handlers.onModUnlock);
            this.menuModSetLevelBtn.addEventListener("click", handlers.onModSetLevel);
            this.menuModResetRecordBtn.addEventListener("click", handlers.onModResetRecord);
            this.menuModResetCampaignBtn.addEventListener("click", handlers.onModResetCampaign);
            this.menuModAchievementSelect.addEventListener("change", handlers.onModAchievementSelectionChange);
            this.menuModSetAchievementTierBtn.addEventListener("click", handlers.onModSetAchievementTier);
            this.menuModResetAchievementsBtn.addEventListener("click", handlers.onModResetAchievements);
            this.menuModBackBtn.addEventListener("click", handlers.onModBackHome);
            this.menuCustomizeCosmeticPrevBtn.addEventListener("click", handlers.onCustomizeCosmeticPrev);
            this.menuCustomizeCosmeticNextBtn.addEventListener("click", handlers.onCustomizeCosmeticNext);
            if (this.menuCustomizeCardBackPrevBtn && handlers.onCustomizeCardBackPrev) {
                this.menuCustomizeCardBackPrevBtn.addEventListener("click", handlers.onCustomizeCardBackPrev);
            }
            if (this.menuCustomizeCardBackNextBtn && handlers.onCustomizeCardBackNext) {
                this.menuCustomizeCardBackNextBtn.addEventListener("click", handlers.onCustomizeCardBackNext);
            }
            this.menuCustomizeTitlePrevBtn.addEventListener("click", handlers.onCustomizeTitlePrev);
            this.menuCustomizeTitleNextBtn.addEventListener("click", handlers.onCustomizeTitleNext);
            if (this.menuCustomizeBackBtn && handlers.onCustomizeBackHome) {
                this.menuCustomizeBackBtn.addEventListener("click", handlers.onCustomizeBackHome);
            }
            this.menuCampaignRegion.addEventListener("change", handlers.onCampaignRegionChange);
            this.menuCampaignStartBtn.addEventListener("click", handlers.onCampaignStart);
            this.menuCampaignBackBtn.addEventListener("click", handlers.onCampaignBackHome);
            if (this.menuShopOffers && handlers.onShopBuyOffer) {
                const shopBuyHandler = (event) => {
                    const btn = event.target?.closest?.(".menu-shop-buy-btn");
                    if (!btn) {
                        return;
                    }
                    handlers.onShopBuyOffer(btn.dataset.offerId || "", btn.dataset.scope || "daily");
                };
                this.menuShopOffers.addEventListener("click", shopBuyHandler);
                if (this.menuShopWeeklyOffers) {
                    this.menuShopWeeklyOffers.addEventListener("click", shopBuyHandler);
                }
            }
            if (this.menuShopRerollBtn && handlers.onShopRerollDaily) {
                this.menuShopRerollBtn.addEventListener("click", handlers.onShopRerollDaily);
            }
            if (this.menuShopRelicUpgradeBtn && handlers.onShopRelicUpgrade) {
                this.menuShopRelicUpgradeBtn.addEventListener("click", handlers.onShopRelicUpgrade);
            }
            if (this.menuShopBackBtn && handlers.onShopBackHome) {
                this.menuShopBackBtn.addEventListener("click", handlers.onShopBackHome);
            }
            if (this.menuBossRelicOffers && handlers.onBossRelicPick) {
                this.menuBossRelicOffers.addEventListener("click", (event) => {
                    const btn = event.target?.closest?.(".menu-boss-relic-pick-btn");
                    if (!btn) return;
                    handlers.onBossRelicPick(btn.dataset.relicId || "");
                });
            }
            this.pauseBtn.addEventListener("click", handlers.onPauseToggle);
            this.pauseResumeBtn.addEventListener("click", handlers.onPauseResume);
            this.pauseMainMenuBtn.addEventListener("click", handlers.onPauseMainMenu);
            this.fullscreenBtn.addEventListener("click", handlers.onFullscreenStart);
            this.exitFullscreenBtn.addEventListener("click", handlers.onFullscreenEnd);
            document.addEventListener("fullscreenchange", handlers.onFullscreenChanged);
        }

        syncDifficulty(value) {
            this.difficulty.value = value;
            this.menuDifficulty.value = value;
        }

        showMainMenu(resultText = "Bereit für eine neue Runde?") {
            this.menuResult.textContent = resultText;
            this.showMenuHome();
            this.mainMenu.classList.add("show");
        }

        setMenuRecord(record) {
            if (!this.menuRecord) {
                return;
            }
            const easy = record.byDifficulty.easy;
            const medium = record.byDifficulty.medium;
            const hard = record.byDifficulty.hard;

            this.menuRecord.innerHTML = [
                `Gesamt: ${record.totalWins}W / ${record.totalLosses}L`,
                `Easy: ${easy.wins}W / ${easy.losses}L`,
                `Medium: ${medium.wins}W / ${medium.losses}L`,
                `Hard: ${hard.wins}W / ${hard.losses}L`
            ].join("<br>");
        }

        setMenuProgression(progression) {
            if (!this.menuLevel || !progression) {
                return;
            }
            const dailyQuest = progression.daily || { title: "-", progress: 0, target: 0, rewardXp: 0, completed: false };
            const challengeQuest = progression.challenge || { title: "-", progress: 0, target: 0, rewardXp: 0, completed: false };
            const weeklyQuest = progression.weekly || { title: "-", progress: 0, target: 0, rewardXp: 0, completed: false };

            const xpIntoLevel = progression.xp % 100;
            const xpToNext = 100 - xpIntoLevel;
            const levelProgressPercent = Math.max(0, Math.min(100, xpIntoLevel));
            this.menuLevel.textContent = `Level ${progression.level} - ${progression.xp} XP`;
            if (this.menuCurrency) {
                this.menuCurrency.textContent = `Aether-Marken: ${progression.currency} | Boss-Siegel: ${progression.bossCurrency || 0}`;
            }
            if (this.menuCosmeticCurrent) {
                this.menuCosmeticCurrent.textContent = `Kosmetik: ${progression.cosmetics.activeTitle}`;
            }
            if (this.menuCosmeticUnlocked) {
                this.menuCosmeticUnlocked.textContent = `Freigeschaltet: ${progression.cosmetics.unlockedCount}`;
            }
            if (this.menuRelicCurrent) {
                this.menuRelicCurrent.textContent = `Relikt: ${progression.relics.activeName}`;
            }
            if (this.menuRelicUnlocked) {
                this.menuRelicUnlocked.textContent = `Relikte freigeschaltet: ${progression.relics.unlockedCount}`;
            }
            if (this.menuCampaignTitleCurrent) {
                this.menuCampaignTitleCurrent.textContent = `Kampagnen-Titel: ${progression.campaignTitles.activeTitle}`;
            }
            if (this.menuCampaignTitleUnlocked) {
                this.menuCampaignTitleUnlocked.textContent = `Kampagnen-Titel freigeschaltet: ${progression.campaignTitles.unlockedCount}`;
            }
            if (this.menuCustomizeCosmeticCurrent) {
                this.menuCustomizeCosmeticCurrent.textContent = `Kosmetik: ${progression.cosmetics.activeTitle}`;
            }
            if (this.menuCustomizeCosmeticUnlocked) {
                this.menuCustomizeCosmeticUnlocked.textContent = `Freigeschaltet: ${progression.cosmetics.unlockedCount}`;
            }
            if (this.menuCustomizeCardBackCurrent) {
                this.menuCustomizeCardBackCurrent.textContent = `Kartenruecken: ${progression.cardBacks.activeTitle}`;
            }
            if (this.menuCustomizeCardBackUnlocked) {
                this.menuCustomizeCardBackUnlocked.textContent = `Freigeschaltet: ${progression.cardBacks.unlockedCount}`;
            }
            this.applyCardBackPreviewTheme(progression.cardBacks.activeId);
            if (this.menuCustomizeTitleCurrent) {
                this.menuCustomizeTitleCurrent.textContent = `Kampagnen-Titel: ${progression.campaignTitles.activeTitle}`;
            }
            if (this.menuCustomizeTitleUnlocked) {
                this.menuCustomizeTitleUnlocked.textContent = `Freigeschaltet: ${progression.campaignTitles.unlockedCount}`;
            }
            this.applyMenuCosmeticTheme(progression.cosmetics.panelClass);
            this.applyGameCosmeticTheme(progression.cosmetics.activeId);

            if (this.menuXpFill) {
                this.menuXpFill.style.width = `${levelProgressPercent}%`;
            }
            if (this.menuXpText) {
                this.menuXpText.textContent = `Noch ${xpToNext} XP bis Level ${progression.level + 1}`;
            }

            if (this.menuDailyQuestTitle) {
                this.menuDailyQuestTitle.textContent = `Tagesquest: ${dailyQuest.title}`;
            }
            if (this.menuDailyQuestProgress) {
                this.menuDailyQuestProgress.textContent = `${dailyQuest.progress}/${dailyQuest.target}${dailyQuest.completed ? " (Erledigt)" : ""}`;
            }
            if (this.menuDailyQuestReward) {
                this.menuDailyQuestReward.textContent = `Belohnung: ${dailyQuest.rewardXp} XP`;
            }

            if (this.menuChallengeTitle) {
                this.menuChallengeTitle.textContent = `Challenge: ${challengeQuest.title}`;
            }
            if (this.menuChallengeProgress) {
                this.menuChallengeProgress.textContent = `${challengeQuest.progress}/${challengeQuest.target}${challengeQuest.completed ? " (Erledigt)" : ""}`;
            }
            if (this.menuChallengeReward) {
                this.menuChallengeReward.textContent = `Belohnung: ${challengeQuest.rewardXp} XP`;
            }
            if (this.menuWeeklyQuestTitle) {
                this.menuWeeklyQuestTitle.textContent = `Wochenquest: ${weeklyQuest.title}`;
            }
            if (this.menuWeeklyQuestProgress) {
                this.menuWeeklyQuestProgress.textContent = `${weeklyQuest.progress}/${weeklyQuest.target}${weeklyQuest.completed ? " (Erledigt)" : ""}`;
            }
            if (this.menuWeeklyQuestReward) {
                this.menuWeeklyQuestReward.textContent = `Belohnung: ${weeklyQuest.rewardXp} XP`;
            }
            if (this.menuAchievementSummary) {
                this.menuAchievementSummary.textContent = `Achievements abgeschlossen: ${progression.achievements.completedTiers}`;
            }
            if (this.menuAchievementList) {
                this.menuAchievementList.innerHTML = progression.achievements.entries
                    .map((entry) => `
                        <article class="menu-achievement-item ${entry.completed ? "done" : "pending"}">
                            <p><strong>${entry.title}</strong></p>
                            <p>${entry.description}</p>
                            <p>Ziel: ${entry.target}</p>
                            <p>${entry.progress}/${entry.target}${entry.completed ? " (Max erreicht)" : ""}</p>
                            <p>Belohnung: ${entry.rewardXp} XP</p>
                        </article>
                    `)
                    .join("");
            }
        }

        applyMenuCosmeticTheme(panelClass) {
            if (!this.menuPanel) {
                return;
            }
            this.menuPanel.classList.remove(...MENU_PANEL_COSMETIC_CLASSES);
            if (panelClass) {
                this.menuPanel.classList.add(panelClass);
            }
        }

        applyGameCosmeticTheme(activeId) {
            const body = document.body;
            if (!body) {
                return;
            }
            body.classList.remove(...GAME_BG_COSMETIC_CLASSES);
            if (activeId) {
                body.classList.add(`game-cosmetic-${activeId}`);
            }
        }

        applyCardBackPreviewTheme(activeId) {
            if (!this.menuCustomizeCardBackPreview) {
                return;
            }
            this.menuCustomizeCardBackPreview.classList.remove(...CARD_BACK_PREVIEW_CLASSES);
            if (activeId) {
                this.menuCustomizeCardBackPreview.classList.add(`menu-cardback-theme-${String(activeId).replace(/_/g, "-")}`);
            }
        }

        hideMainMenu() {
            this.mainMenu.classList.remove("show");
        }

        showPauseMenu() {
            this.pauseMenu.classList.add("show");
        }

        hidePauseMenu() {
            this.pauseMenu.classList.remove("show");
        }

        showMenuHome() {
            this.menuHome.style.display = "grid";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        showMenuIndex(cards) {
            this.renderCardIndex(cards);
            this.menuHome.style.display = "none";
            this.menuIndex.classList.add("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        showMenuTutorial(step, total) {
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.add("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
            if (this.menuTutorialVisual) {
                this.menuTutorialVisual.className = `menu-tutorial-visual ${step.visualClass || ""}`;
            }
            this.menuTutorialTitle.textContent = step.title;
            this.menuTutorialText.textContent = step.text;
            this.menuTutorialPrevBtn.disabled = step.index <= 0;
            this.menuTutorialNextBtn.disabled = step.index >= total - 1;
        }

        showMenuRewards(rewardEntries, currentLevel) {
            this.renderRewardsList(rewardEntries);
            if (this.menuRewardsCurrentLevel) {
                this.menuRewardsCurrentLevel.textContent = `Dein aktuelles Level: ${currentLevel}`;
            }
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.add("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        renderRewardsList(rewardEntries) {
            if (!this.menuRewardsList) {
                return;
            }
            this.menuRewardsList.innerHTML = rewardEntries
                .map((entry) => `
                    <article class="menu-reward-item ${entry.unlocked ? "unlocked" : "locked"}">
                        <p><strong>Level ${entry.level}</strong> - [${entry.category}] ${entry.title}</p>
                        ${entry.category === "Relikt" ? `<p>${entry.description}</p>` : ""}
                        <p>XP benoetigt: ${entry.requiredXp}</p>
                        <p>Status: ${entry.unlocked ? "Freigeschaltet" : "Gesperrt"}</p>
                    </article>
                `)
                .join("");
        }

        showMenuStats(stats) {
            this.renderStatsPage(stats);
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.add("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        showMenuLan(snapshot) {
            if (snapshot) {
                if (this.menuLanPlayerName) this.menuLanPlayerName.value = snapshot.playerName || "";
                if (this.menuLanHostAddress) this.menuLanHostAddress.value = snapshot.hostAddress || "";
                if (this.menuLanShareUrl) this.menuLanShareUrl.value = snapshot.shareUrl || "";
                if (this.menuLanStatus) this.menuLanStatus.textContent = snapshot.statusText || "Wähle Host oder Beitreten.";
            }
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.add("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        showMenuLanLobby(snapshot) {
            if (this.menuLanLobbyStatus) {
                this.menuLanLobbyStatus.textContent = snapshot?.statusText || "Lobby geöffnet.";
            }
            if (this.menuLanReadyBtn) {
                this.menuLanReadyBtn.textContent = snapshot?.ready ? "Bereit (aktiv)" : "Bereit";
            }
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.add("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        showMenuSynergyIndex(entries) {
            this.renderSynergyList(entries);
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.add("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        renderSynergyList(entries) {
            if (!this.menuSynergyList) {
                return;
            }
            this.menuSynergyList.innerHTML = entries
                .map((entry) => `
                    <article class="menu-synergy-item">
                        <p><strong>${entry.cardName}</strong></p>
                        <p>Trigger: ${entry.triggerText}</p>
                        <p>Effekt: ${entry.effectText}</p>
                    </article>
                `)
                .join("");
        }

        showMenuSettings(settings) {
            this.setMenuSoundSettings(settings);
            this.setMenuAccessibilitySettings(settings);
            this.showSettingsTab("sound");
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.add("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        setMenuSoundSettings(settings) {
            if (!this.menuSoundVolume || !this.menuSoundMute || !this.menuSoundVolumeText) {
                return;
            }
            const volume = Number.isFinite(settings?.volume) ? settings.volume : 1;
            const clampedVolume = Math.max(0, Math.min(1, volume));
            const volumePercent = Math.round(clampedVolume * 100);
            const uiVolumePercent = Math.round(Math.max(0, Math.min(1, settings?.channels?.ui ?? 1)) * 100);
            const combatVolumePercent = Math.round(Math.max(0, Math.min(1, settings?.channels?.combat ?? 1)) * 100);
            const eventsVolumePercent = Math.round(Math.max(0, Math.min(1, settings?.channels?.events ?? 1)) * 100);
            this.menuSoundVolume.value = String(volumePercent);
            this.menuSoundMute.checked = Boolean(settings?.muted);
            this.menuSoundVolumeText.textContent = `Lautstärke: ${volumePercent}%`;
            if (this.menuSoundUiVolume && this.menuSoundUiVolumeText) {
                this.menuSoundUiVolume.value = String(uiVolumePercent);
                this.menuSoundUiVolumeText.textContent = `UI: ${uiVolumePercent}%`;
            }
            if (this.menuSoundCombatVolume && this.menuSoundCombatVolumeText) {
                this.menuSoundCombatVolume.value = String(combatVolumePercent);
                this.menuSoundCombatVolumeText.textContent = `Kampf: ${combatVolumePercent}%`;
            }
            if (this.menuSoundEventsVolume && this.menuSoundEventsVolumeText) {
                this.menuSoundEventsVolume.value = String(eventsVolumePercent);
                this.menuSoundEventsVolumeText.textContent = `Events: ${eventsVolumePercent}%`;
            }
            if (this.menuCombatSpeed) {
                const combatSpeed = typeof settings?.combatSpeed === "string" && COMBAT_SPEED_OPTIONS[settings.combatSpeed]
                    ? settings.combatSpeed
                    : "normal";
                this.menuCombatSpeed.value = combatSpeed;
            }
            if (this.menuCombatSynergyEnabled) {
                this.menuCombatSynergyEnabled.checked = settings?.synergyEnabled !== false;
            }
            if (this.menuSoundTestBtn) {
                this.menuSoundTestBtn.disabled = this.menuSoundMute.checked || volumePercent <= 0 || uiVolumePercent <= 0;
            }
        }

        showSettingsTab(tabId) {
            const selected = ["sound", "combat", "cosmetic", "campaignTitle", "accessibility"].includes(tabId) ? tabId : "sound";
            if (this.menuSettingsTabSound) this.menuSettingsTabSound.classList.toggle("active", selected === "sound");
            if (this.menuSettingsTabCombat) this.menuSettingsTabCombat.classList.toggle("active", selected === "combat");
            if (this.menuSettingsTabCosmetic) this.menuSettingsTabCosmetic.classList.toggle("active", selected === "cosmetic");
            if (this.menuSettingsTabCampaignTitle) this.menuSettingsTabCampaignTitle.classList.toggle("active", selected === "campaignTitle");
            if (this.menuSettingsTabAccessibility) this.menuSettingsTabAccessibility.classList.toggle("active", selected === "accessibility");
            if (this.menuSettingsPanelSound) this.menuSettingsPanelSound.classList.toggle("show", selected === "sound");
            if (this.menuSettingsPanelCombat) this.menuSettingsPanelCombat.classList.toggle("show", selected === "combat");
            if (this.menuSettingsPanelCosmetic) this.menuSettingsPanelCosmetic.classList.toggle("show", selected === "cosmetic");
            if (this.menuSettingsPanelCampaignTitle) this.menuSettingsPanelCampaignTitle.classList.toggle("show", selected === "campaignTitle");
            if (this.menuSettingsPanelAccessibility) this.menuSettingsPanelAccessibility.classList.toggle("show", selected === "accessibility");
        }

        setMenuAccessibilitySettings(settings) {
            const accessibility = settings?.accessibility || {};
            const fontScale = typeof accessibility.fontScale === "string" ? accessibility.fontScale : "normal";
            if (this.menuAccessibilityFontScale) {
                this.menuAccessibilityFontScale.value = ["normal", "large", "xlarge"].includes(fontScale) ? fontScale : "normal";
            }
            if (this.menuAccessibilityColorblind) {
                this.menuAccessibilityColorblind.checked = Boolean(accessibility.colorBlind);
            }
            if (this.menuAccessibilityReducedMotion) {
                this.menuAccessibilityReducedMotion.checked = Boolean(accessibility.reducedMotion);
            }
        }

        applyAccessibilitySettings(accessibility) {
            const body = document.body;
            if (!body || !accessibility) {
                return;
            }
            const fontScale = typeof accessibility.fontScale === "string" ? accessibility.fontScale : "normal";
            body.classList.toggle("accessibility-font-large", fontScale === "large");
            body.classList.toggle("accessibility-font-xlarge", fontScale === "xlarge");
            body.classList.toggle("accessibility-colorblind", Boolean(accessibility.colorBlind));
            body.classList.toggle("accessibility-reduced-motion", Boolean(accessibility.reducedMotion));
            this.reducedMotion = Boolean(accessibility.reducedMotion);
        }

        setCombatSpeedMultiplier(multiplier) {
            const parsed = Number(multiplier);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                this.combatSpeedMultiplier = 1;
                return;
            }
            this.combatSpeedMultiplier = parsed;
        }

        showMenuMod(currentLevel) {
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.add("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
            this.setModUnlocked(false);
            this.setModFeedback("");
            if (this.menuModPassword) {
                this.menuModPassword.value = "";
            }
            this.setModCurrentLevel(currentLevel);
        }

        setMenuCampaignStatus(text) {
            if (!this.menuCampaignStatus) {
                return;
            }
            this.menuCampaignStatus.textContent = text;
        }

        showMenuCustomize() {
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.add("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        showMenuCampaign(snapshot) {
            if (!snapshot) {
                return;
            }
            this.renderCampaign(snapshot);
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.add("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
        }

        renderCampaign(snapshot) {
            if (this.menuCampaignRun) {
                this.menuCampaignRun.textContent = snapshot.runText;
            }

            if (this.menuCampaignRegion) {
                this.menuCampaignRegion.innerHTML = snapshot.regions
                    .map((region) => `<option value="${region.id}">${region.name}</option>`)
                    .join("");
                this.menuCampaignRegion.value = snapshot.selectedRegionId;
            }

            if (this.menuCampaignPath) {
                this.menuCampaignPath.innerHTML = snapshot.selectedRegionNodes
                    .map((node) => `
                        <article class="menu-campaign-node ${node.stateClass} ${node.nodeTypeClass || ""}">
                            <strong>${node.index}. ${node.title}</strong><br>
                            ${node.detailLine}<br>
                            Status: ${node.stateLabel}
                        </article>
                    `)
                    .join("");
            }

            if (this.menuCampaignStartBtn) {
                this.menuCampaignStartBtn.textContent = snapshot.startButtonText;
            }
        }

        showMenuShop(snapshot) {
            this.renderShop(snapshot);
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.add("show");
        }

        renderShop(snapshot) {
            if (!snapshot) {
                return;
            }
            if (this.menuShopCurrency) {
                this.menuShopCurrency.textContent = `Aether-Marken: ${snapshot.currency} | Boss-Siegel: ${snapshot.bossCurrency} | Reliktstaub: ${snapshot.relicDust}`;
            }
            if (this.menuShopDate) {
                this.menuShopDate.textContent = `Daily Reset: ${snapshot.nextResetText} | Weekly Reset: ${snapshot.weeklyResetText}`;
            }
            if (this.menuShopRerollBtn && snapshot.reroll) {
                this.menuShopRerollBtn.textContent = snapshot.reroll.label || "Daily neu rollen";
                this.menuShopRerollBtn.disabled = Boolean(snapshot.reroll.disabled);
            }
            if (this.menuShopRerollInfo && snapshot.reroll) {
                this.menuShopRerollInfo.textContent = `Rerolls heute: kostenlos ${snapshot.reroll.freeLeft}x, bezahlt ${snapshot.reroll.paidUsed}/${snapshot.reroll.paidMax}`;
            }
            if (this.menuShopRelicUpgradeBtn && snapshot.relicUpgrade) {
                this.menuShopRelicUpgradeBtn.textContent = `Relikt verbessern (${snapshot.relicUpgrade.markCost} ${SHOP_CURRENCY_NAME} + ${snapshot.relicUpgrade.dustCost} Staub)`;
                this.menuShopRelicUpgradeBtn.disabled = Boolean(snapshot.relicUpgrade.disabled);
            }
            if (this.menuShopRelicUpgradeInfo && snapshot.relicUpgrade) {
                this.menuShopRelicUpgradeInfo.textContent = `Relikt-Upgrade: Stufe ${snapshot.relicUpgrade.level}/${snapshot.relicUpgrade.maxLevel}`;
            }
            if (this.menuShopOffers) {
                this.menuShopOffers.innerHTML = (snapshot.offers || [])
                    .map((offer) => `
                        <article class="menu-shop-item ${offer.owned ? "owned" : ""}">
                            <p><strong>[${offer.typeLabel}] ${offer.title}</strong></p>
                            <p>${offer.description}</p>
                            <p>Kosten: ${offer.price} ${offer.currencyLabel}</p>
                            <button class="menu-shop-buy-btn" type="button" data-offer-id="${offer.id}" data-scope="daily" ${offer.buyDisabled ? "disabled" : ""}>
                                ${offer.buyLabel}
                            </button>
                        </article>
                    `)
                    .join("");
            }
            if (this.menuShopWeeklyOffers) {
                this.menuShopWeeklyOffers.innerHTML = (snapshot.weeklyOffers || [])
                    .map((offer) => `
                        <article class="menu-shop-item ${offer.owned ? "owned" : ""}">
                            <p><strong>[${offer.typeLabel}] ${offer.title}</strong></p>
                            <p>${offer.description}</p>
                            <p>Kosten: ${offer.price} ${offer.currencyLabel}</p>
                            <button class="menu-shop-buy-btn" type="button" data-offer-id="${offer.id}" data-scope="weekly" ${offer.buyDisabled ? "disabled" : ""}>
                                ${offer.buyLabel}
                            </button>
                        </article>
                    `)
                    .join("");
            }
        }

        showMenuBossRelic(snapshot) {
            this.renderBossRelicMenu(snapshot);
            this.menuHome.style.display = "none";
            this.menuIndex.classList.remove("show");
            this.menuTutorial.classList.remove("show");
            this.menuRewards.classList.remove("show");
            this.menuStats.classList.remove("show");
            this.menuLan.classList.remove("show");
            this.menuLanLobby.classList.remove("show");
            this.menuSynergyIndex.classList.remove("show");
            this.menuSettings.classList.remove("show");
            this.menuMod.classList.remove("show");
            this.menuCustomize.classList.remove("show");
            this.menuCampaign.classList.remove("show");
            if (this.menuShop) this.menuShop.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.remove("show");
            if (this.menuBossRelic) this.menuBossRelic.classList.add("show");
        }

        renderBossRelicMenu(snapshot) {
            if (!snapshot) return;
            if (this.menuBossRelicText) {
                this.menuBossRelicText.textContent = snapshot.text || "Wähle 1 von 3 Relikten.";
            }
            if (this.menuBossRelicOffers) {
                this.menuBossRelicOffers.innerHTML = (snapshot.choices || [])
                    .map((choice) => `
                        <article class="menu-boss-relic-item">
                            <p><strong>${choice.name}</strong></p>
                            <p>${choice.description}</p>
                            <button class="menu-boss-relic-pick-btn" type="button" data-relic-id="${choice.id}" ${choice.pickDisabled ? "disabled" : ""}>${choice.pickLabel || "Dieses Relikt nehmen"}</button>
                        </article>
                    `)
                    .join("");
            }
        }

        setModUnlocked(unlocked) {
            if (!this.menuModTools) {
                return;
            }
            this.menuModTools.classList.toggle("show", Boolean(unlocked));
        }

        setModFeedback(message, isError = false) {
            if (!this.menuModFeedback) {
                return;
            }
            this.menuModFeedback.textContent = message;
            this.menuModFeedback.classList.toggle("error", Boolean(isError));
        }

        setModCurrentLevel(level) {
            if (this.menuModCurrentLevel) {
                this.menuModCurrentLevel.textContent = `Aktuelles Level: ${level}`;
            }
            if (this.menuModLevelInput) {
                this.menuModLevelInput.value = String(level);
            }
        }

        setModAchievementOptions(options, selectedId) {
            if (!this.menuModAchievementSelect) {
                return;
            }
            this.menuModAchievementSelect.innerHTML = options
                .map((entry) => `<option value="${entry.id}">${entry.label}</option>`)
                .join("");
            if (selectedId) {
                this.menuModAchievementSelect.value = selectedId;
            }
        }

        setModAchievementTierInput(tier) {
            if (!this.menuModAchievementTierInput) {
                return;
            }
            this.menuModAchievementTierInput.value = String(tier);
        }

        setModAchievementPreview(text) {
            if (!this.menuModAchievementPreview) {
                return;
            }
            this.menuModAchievementPreview.textContent = text;
        }

        renderStatsPage(stats) {
            if (this.menuStatsDifficulty) {
                this.menuStatsDifficulty.innerHTML = `
                    <h4>Winrate pro Schwierigkeit</h4>
                    ${stats.difficultyRows.map((row) => `
                        <p>${row.label}: ${row.wins}W/${row.losses}L (${row.winrate}%)</p>
                    `).join("")}
                `;
            }

            if (this.menuStatsCards) {
                if (stats.topCards.length === 0) {
                    this.menuStatsCards.innerHTML = `
                        <h4>Meistgespielte Karten</h4>
                        <p>Noch keine gespielten Karten.</p>
                    `;
                    return;
                }

                this.menuStatsCards.innerHTML = `
                    <h4>Meistgespielte Karten</h4>
                    ${stats.topCards.map((entry, idx) => `
                        <p>${idx + 1}. ${entry.name} - ${entry.count}x gespielt</p>
                    `).join("")}
                `;
            }
        }

        renderCardIndex(cards) {
            this.menuCardIndexList.innerHTML = "";
            cards.forEach((entry) => {
                const row = document.createElement("article");
                row.className = "menu-card-item";
                row.innerHTML = `
                    <button type="button" class="menu-card-header">
                        <span class="index-card-preview ${entry.className}"></span>
                        <span class="index-card-title">${entry.name}</span>
                    </button>
                `;
                const header = row.querySelector(".menu-card-header");
                header.addEventListener("click", () => {
                    this.menuCardIndexList.querySelectorAll(".menu-card-item.active").forEach((item) => {
                        item.classList.remove("active");
                    });
                    row.classList.add("active");
                    this.showSelectedCardDetails(entry);
                });
                this.menuCardIndexList.appendChild(row);
            });

            const first = cards[0];
            if (first) {
                this.showSelectedCardDetails(first);
                const firstRow = this.menuCardIndexList.querySelector(".menu-card-item");
                if (firstRow) firstRow.classList.add("active");
            }
        }

        showSelectedCardDetails(entry) {
            this.menuSelectedCard.innerHTML = `
                <h4>${entry.name}</h4>
                <ul>
                    ${entry.details.map((line) => `<li>${line}</li>`).join("")}
                </ul>
            `;
        }

        renderStats(player, enemy, turnState) {
            this.playerHP.textContent = String(player.hp);
            if (this.playerTitle && turnState.playerTitle) {
                this.playerTitle.textContent = turnState.playerTitle;
            }
            this.playerMana.textContent = String(player.mana);
            this.playerActions.textContent = String(turnState.playerActionsRemaining);
            this.enemyHP.textContent = String(enemy.hp);
            if (this.enemyName && turnState.enemyName) {
                this.enemyName.textContent = turnState.enemyName;
            }
            this.enemyMana.textContent = String(enemy.mana);
            this.enemyActions.textContent = String(turnState.enemyActionsRemaining);
            this.renderStatusEffects(player, enemy);
            this.syncActionUi(turnState);
        }

        syncActionUi(turnState) {
            const playerTurnActive = Boolean(turnState.playerTurn);
            const actionsAllowed = !turnState.isPaused;
            const canDrawCard = turnState.playerHandSize < CONFIG.HAND_SIZE;
            this.drawCardBtn.disabled = !actionsAllowed || !playerTurnActive || turnState.playerActionsRemaining <= 0 || !canDrawCard;
            this.useAbilityBtn.disabled = !actionsAllowed || !playerTurnActive || turnState.playerActionsRemaining <= 0 || turnState.playerAbilityUsed;
            this.endTurnBtn.disabled = !actionsAllowed || !playerTurnActive;
            this.pauseBtn.style.display = turnState.gameActive && !turnState.isPaused ? "inline-block" : "none";
            this.pauseBtn.textContent = "Pause";
        }

        renderStatusEffects(player, enemy) {
            this.renderCombatantEffects(this.playerStatusEffects, player.statuses);
            this.renderCombatantEffects(this.enemyStatusEffects, enemy.statuses);
        }

        renderCombatantEffects(container, statuses) {
            const badges = [];

            if (statuses.burn.turns > 0 && statuses.burn.damage > 0) {
                badges.push({ kind: "burn", label: `Burn ${statuses.burn.damage}x${statuses.burn.turns}` });
            }

            if (statuses.hardBurn.turns > 0 && statuses.hardBurn.damage > 0) {
                badges.push({ kind: "hardburn", label: `Hard-Burn ${statuses.hardBurn.damage}x${statuses.hardBurn.turns}` });
            }

            if (statuses.poison.turns > 0 && statuses.poison.damage > 0) {
                badges.push({ kind: "poison", label: `Poison ${statuses.poison.damage}x${statuses.poison.turns}` });
            }

            if (statuses.shield > 0) {
                badges.push({ kind: "shield", label: `Schild ${statuses.shield}` });
            }

            if (statuses.silenceTurns > 0) {
                badges.push({ kind: "silence", label: `Silence ${statuses.silenceTurns}` });
            }

            if (statuses.tauntTurns > 0) {
                badges.push({ kind: "taunt", label: `Taunt ${statuses.tauntTurns}` });
            }

            container.innerHTML = "";
            if (badges.length === 0) {
                container.classList.remove("visible");
                return;
            }

            container.classList.add("visible");
            badges.forEach((badge) => {
                const tag = document.createElement("span");
                tag.className = `status-badge status-${badge.kind}`;
                tag.textContent = badge.label;
                this.setTooltip(tag, this.getStatusTooltip(badge.kind, badge.label));
                container.appendChild(tag);
            });
        }

        renderPlayerHand(cards, playerMana, onCardPlayed) {
            this.playerHand.innerHTML = "";

            cards.forEach((card, index) => {
                const cardElement = this.createCardElement(card);
                const canPay = playerMana >= card.cost;
                if (playerMana < card.cost) {
                    cardElement.classList.add("used");
                }
                cardElement.addEventListener("click", () => onCardPlayed(index, cardElement));
                cardElement.addEventListener("mousemove", (event) => {
                    if (cardElement.classList.contains("card-play-animating")) {
                        return;
                    }
                    this.applyTilt(cardElement, event);
                });
                cardElement.addEventListener("mouseenter", () => this.showManaHint(cardElement, card.cost, playerMana, canPay));
                cardElement.addEventListener("mouseleave", () => {
                    if (cardElement.classList.contains("card-play-animating")) {
                        return;
                    }
                    cardElement.style.transform = "scale(1)";
                    this.hideManaHint(cardElement);
                });
                this.playerHand.appendChild(cardElement);
            });
        }

        animatePlayedCard(cardElement, onDone, speedMultiplier = 1,) {
            if (this.reducedMotion) {
                if (typeof onDone === "function") {
                    onDone();
                }
                return;
            }
            if (!cardElement) {
                if (typeof onDone === "function") {
                    onDone();
                }
                return;
            }

            this.hideManaHint(cardElement);
            cardElement.classList.add("card-play-animating");
            const rect = cardElement.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            const translateX = centerX - cardCenterX;
            const translateY = centerY - cardCenterY;
            const effectiveMultiplier = Number.isFinite(speedMultiplier) && speedMultiplier > 0
                ? speedMultiplier
                : this.combatSpeedMultiplier || 1;
            const travelDurationMs = Math.round(700 * effectiveMultiplier);
            const fadeDurationMs = Math.round(260 * effectiveMultiplier);
            cardElement.style.transform = "translate(0, 0) scale(1)";
            cardElement.style.opacity = "1";
            cardElement.style.transition = `transform ${travelDurationMs / 1000}s cubic-bezier(0.2, 0.75, 0.15, 1), opacity ${fadeDurationMs / 1000}s ease`;

            window.setTimeout(() => {
                cardElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.16)`;
            }, 20);

            window.setTimeout(() => {
               
                cardElement.style.opacity = "0";
            cardElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.28)`;
            }, travelDurationMs + 20);

            window.setTimeout(() => {
                cardElement.classList.remove("card-play-animating");
                cardElement.style.transform = "";
                cardElement.style.opacity = "";
                cardElement.style.transition = "";
                if (typeof onDone === "function") {
                    onDone();
                }
            }, travelDurationMs + fadeDurationMs + 60);
        }

        renderAIHand(cards) {
            this.aiHand.innerHTML = "";
            cards.forEach((card) => {
                const cardElement = this.createCardElement(card);
                this.aiHand.appendChild(cardElement);
            });
        }

        createCardElement(card) {
            const cardElement = document.createElement("div");
            const rarity = card.rarity || "common";
            const conditionLabel = this.getConditionLabel(card.condition);
            const attackValue = card.damage || card.special?.damage || 0;
            const utilityValue = card.heal || card.shield || card.special?.heal || 0;
            cardElement.classList.add("card", Utils.classNameFromCard(card.name), `rarity-${rarity}`);
            cardElement.innerHTML = `
                <div class="rarity-badge">${rarity.toUpperCase()}</div>
                <div class="name">${card.name}</div>
                ${conditionLabel ? `<div class="card-condition">${conditionLabel}</div>` : ""}
                <div class="stats">
                    <div class="attack">${attackValue}</div>
                    <div class="health">${utilityValue}</div>
                    <div class="mana">${card.cost}</div>
                </div>
            `;

            const attackStat = cardElement.querySelector(".attack");
            const utilityStat = cardElement.querySelector(".health");
            const manaStat = cardElement.querySelector(".mana");
            const nameLabel = cardElement.querySelector(".name");
            const conditionNode = cardElement.querySelector(".card-condition");

            this.setTooltip(attackStat, "Schaden: Direkter Schaden, der sofort angewendet wird.");
            this.setTooltip(manaStat, "Mana: Diese Kosten brauchst du zum Ausspielen der Karte.");

            if (card.heal) {
                this.setTooltip(utilityStat, "Heilung: Stellt eigene HP wieder her.");
            } else if (card.shield) {
                this.setTooltip(utilityStat, "Schild: Blockt eingehenden Schaden zuerst.");
            } else if (card.special?.heal) {
                this.setTooltip(utilityStat, "Spezial-Heilung: Teil des Spezialeffekts.");
            } else {
                this.setTooltip(utilityStat, "Nutzen: Sekundärer Kartenwert.");
            }

            if (conditionNode) {
                this.setTooltip(conditionNode, "Keyword Bedingung: Karte ist nur unter dieser Bedingung spielbar.");
            }
            if (card.school && ELEMENT_SCHOOL_LABELS[card.school]) {
                const schoolLabel = ELEMENT_SCHOOL_LABELS[card.school];
                const schoolRule = ELEMENT_SET_BONUS_RULES[card.school];
                const schoolText = schoolRule ? `${schoolRule.description}` : "";
                const statusText = card.status?.kind
                    ? `Status: ${card.status.kind === "hardBurn" ? "Hard-Burn" : card.status.kind}.`
                    : "";
                this.setTooltip(nameLabel, `Schule ${schoolLabel}. ${schoolText} ${statusText}`.trim());
            } else if (card.status?.kind) {
                const keyword = card.status.kind === "hardBurn" ? "Hard-Burn" : card.status.kind;
                this.setTooltip(nameLabel, `Keyword ${keyword}: Die Karte erzeugt einen Status-Effekt.`);
            } else if (card.comboGroup === "fire") {
                this.setTooltip(nameLabel, "Keyword Feuer-Kombo: Mehrere Feuerkarten hintereinander werden stärker.");
            } else if (card.type === "special") {
                this.setTooltip(nameLabel, "Keyword Spezialkarte: Starker Effekt mit Bedingung.");
            }
            return cardElement;
        }

        getConditionLabel(condition) {
            if (!condition) {
                return "";
            }

            if (condition.kind === "self_hp_at_or_below") {
                return `Wenn eigene HP <= ${condition.value}`;
            }
            if (condition.kind === "target_hp_at_or_below") {
                return `Wenn Gegner-HP <= ${condition.value}`;
            }
            if (condition.kind === "self_has_negative_status") {
                return "Wenn du Brand/Gift hast";
            }

            return "";
        }

        applyTilt(cardElement, event) {
            const rect = cardElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = (rect.height / 2 - y) / 5;
            const rotateY = (x - rect.width / 2) / 5;
            cardElement.style.transform = `scale(1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        showManaHint(cardElement, cost, mana, canPay) {
            this.hideManaHint(cardElement);
            const hint = document.createElement("div");
            hint.className = `mana-hover-hint ${canPay ? "ok" : "low"}`;
            if (canPay) {
                hint.textContent = `Kosten ${cost} | Mana ${mana}`;
            } else {
                hint.textContent = `Fehlt ${cost - mana} Mana (${mana}/${cost})`;
            }
            cardElement.appendChild(hint);
        }

        hideManaHint(cardElement) {
            const hint = cardElement.querySelector(".mana-hover-hint");
            if (hint) {
                hint.remove();
            }
        }

        bindTooltipDelegation() {
            if (!this.uiTooltip) {
                return;
            }

            document.addEventListener("mouseover", (event) => {
                const anchor = event.target?.closest ? event.target.closest("[data-ui-tooltip]") : null;
                if (!anchor) {
                    return;
                }
                this.showTooltip(anchor, event.clientX, event.clientY);
            });

            document.addEventListener("mousemove", (event) => {
                if (!this.activeTooltipAnchor) {
                    return;
                }
                this.positionTooltip(event.clientX, event.clientY);
            });

            document.addEventListener("mouseout", (event) => {
                if (!this.activeTooltipAnchor) {
                    return;
                }
                const leaving = event.target?.closest ? event.target.closest("[data-ui-tooltip]") : null;
                if (!leaving || leaving !== this.activeTooltipAnchor) {
                    return;
                }
                const next = event.relatedTarget?.closest ? event.relatedTarget.closest("[data-ui-tooltip]") : null;
                if (next === this.activeTooltipAnchor) {
                    return;
                }
                this.hideTooltip();
            });

            document.addEventListener("focusin", (event) => {
                const anchor = event.target?.closest ? event.target.closest("[data-ui-tooltip]") : null;
                if (!anchor) {
                    return;
                }
                const rect = anchor.getBoundingClientRect();
                this.showTooltip(anchor, rect.left + (rect.width / 2), rect.bottom + 8);
            });

            document.addEventListener("focusout", (event) => {
                const anchor = event.target?.closest ? event.target.closest("[data-ui-tooltip]") : null;
                if (anchor && anchor === this.activeTooltipAnchor) {
                    this.hideTooltip();
                }
            });

            window.addEventListener("scroll", () => this.hideTooltip(), { passive: true });
        }

        setTooltip(element, text) {
            if (!element) {
                return;
            }
            if (!text) {
                element.removeAttribute("data-ui-tooltip");
                element.classList.remove("ui-tooltip-anchor");
                if (this.activeTooltipAnchor === element) {
                    this.hideTooltip();
                }
                return;
            }
            element.setAttribute("data-ui-tooltip", text);
            element.classList.add("ui-tooltip-anchor");
        }

        showTooltip(anchor, x, y) {
            if (!this.uiTooltip || !anchor) {
                return;
            }
            const text = anchor.getAttribute("data-ui-tooltip");
            if (!text) {
                return;
            }
            this.activeTooltipAnchor = anchor;
            this.uiTooltip.textContent = text;
            this.uiTooltip.setAttribute("aria-hidden", "false");
            this.uiTooltip.classList.add("show");
            this.positionTooltip(x, y);
        }

        positionTooltip(x, y) {
            if (!this.uiTooltip) {
                return;
            }
            const offsetX = 14;
            const offsetY = 18;
            const tooltipRect = this.uiTooltip.getBoundingClientRect();
            let left = (Number.isFinite(x) ? x : 0) + offsetX;
            let top = (Number.isFinite(y) ? y : 0) + offsetY;

            if (left + tooltipRect.width > window.innerWidth - 8) {
                left = Math.max(8, window.innerWidth - tooltipRect.width - 8);
            }
            if (top + tooltipRect.height > window.innerHeight - 8) {
                top = Math.max(8, (Number.isFinite(y) ? y : 0) - tooltipRect.height - 10);
            }

            this.uiTooltip.style.left = `${Math.round(left)}px`;
            this.uiTooltip.style.top = `${Math.round(top)}px`;
        }

        hideTooltip() {
            if (!this.uiTooltip) {
                return;
            }
            this.activeTooltipAnchor = null;
            this.uiTooltip.classList.remove("show");
            this.uiTooltip.setAttribute("aria-hidden", "true");
        }

        getStatusTooltip(kind, label) {
            const map = {
                burn: "Burn: Verursacht am Zugstart Schaden.",
                hardburn: "Hard-Burn: Stärkerer Burn-Effekt pro Tick.",
                poison: "Poison: Verursacht am Zugstart Giftschaden.",
                shield: "Schild: Blockt eingehenden Schaden zuerst.",
                silence: "Silence: Blockiert Spezial- und Statuskarten sowie Fokus.",
                taunt: "Taunt: Erzwingt eine Schadenskarte, falls moeglich."
            };
            return `${label}. ${map[kind] || "Status-Effekt."}`;
        }

        addLog(message, source = "system") {
            const row = document.createElement("div");
            row.textContent = message;
            row.classList.add("log-message");
            if (source === "player") row.classList.add("log-player");
            if (source === "ai") row.classList.add("log-ai");
            if (source === "ai-boss") row.classList.add("log-ai-boss");
            this.logMessages.appendChild(row);
            this.logMessages.scrollTop = this.logMessages.scrollHeight;
        }

        clearLog() {
            this.logMessages.innerHTML = "";
        }

        clearDamageLogs() {
            this.playerDamageLog.innerHTML = "";
            this.enemyDamageLog.innerHTML = "";
            this.playerDamageLog.classList.remove("visible");
            this.enemyDamageLog.classList.remove("visible");
        }

        addDamageLog(target, source, damage) {
            if (damage <= 0) {
                return;
            }

            const container = target === "player" ? this.playerDamageLog : this.enemyDamageLog;
            container.classList.add("visible");

            const row = document.createElement("div");
            row.className = "damage-entry";
            row.textContent = `${source}: -${damage}`;
            container.prepend(row);

            while (container.childElementCount > CONFIG.DAMAGE_LOG_LIMIT) {
                container.removeChild(container.lastElementChild);
            }
        }

        showMessage(message, duration = 1500) {
            this.overlay.textContent = message;
            this.overlay.classList.remove("hidden");
            this.overlay.classList.add("show");

            window.setTimeout(() => {
                this.overlay.classList.remove("show");
                this.overlay.classList.add("hidden");
            }, duration);
        }

        showResultTransition(text, onDone) {
            if (!this.resultTransitionOverlay || !this.resultTransitionText) {
                if (typeof onDone === "function") {
                    onDone();
                }
                return;
            }

            const totalDuration = 1800;
            const menuSwitchAt = 920;
            this.resultTransitionText.textContent = text;
            this.resultTransitionOverlay.classList.remove("show", "hidden");
            void this.resultTransitionOverlay.offsetWidth;
            this.resultTransitionOverlay.classList.add("show");

            window.setTimeout(() => {
                if (typeof onDone === "function") {
                    onDone();
                }
            }, menuSwitchAt);

            window.setTimeout(() => {
                this.resultTransitionOverlay.classList.remove("show");
                this.resultTransitionOverlay.classList.add("hidden");
            }, totalDuration);
        }

        setRoundEvent(eventData) {
            if (!eventData) {
                this.roundEvent.textContent = "";
                this.roundEvent.classList.remove("visible");
                this.setTooltip(this.roundEvent, "");
                return;
            }

            const roundsText = eventData.roundsLeft ? ` (${eventData.roundsLeft} Runden)` : "";
            this.roundEvent.textContent = `${eventData.type}: ${eventData.name} - ${eventData.description}${roundsText}`;
            this.roundEvent.classList.add("visible");
            this.setTooltip(this.roundEvent, `${eventData.type}: ${eventData.name}. ${eventData.description}${roundsText}`);
        }

        setMatchRelic(relicData) {
            if (!this.matchRelic) {
                return;
            }
            if (!relicData) {
                this.matchRelic.textContent = "";
                this.matchRelic.classList.remove("visible");
                this.setTooltip(this.matchRelic, "");
                return;
            }
            this.matchRelic.textContent = `${relicData.type}: ${relicData.name} - ${relicData.description}`;
            this.matchRelic.classList.add("visible");
            this.setTooltip(this.matchRelic, `${relicData.type}: ${relicData.name}. ${relicData.description}`);
        }

        blink(target, type) {
            target.classList.add(type);
            const motionFactor = this.reducedMotion ? 0.35 : 1;
            const blinkDuration = Math.round(800 * this.combatSpeedMultiplier * motionFactor);
            window.setTimeout(() => target.classList.remove(type), blinkDuration);

            const actor = target === this.playerHP
                ? this.playerActor
                : target === this.enemyHP
                    ? this.enemyActor
                    : null;
            if (actor) {
                let actorClass = "actor-hit";
                if (type === "heal") actorClass = "actor-heal";
                if (type === "crit") actorClass = "actor-crit";
                if (type === "tick") actorClass = "actor-tick";
                if (type === "shieldbreak") actorClass = "actor-shieldbreak";
                actor.classList.add(actorClass);
                window.setTimeout(() => actor.classList.remove(actorClass), Math.round(420 * this.combatSpeedMultiplier * motionFactor));
            }
        }

        showActorImpact(side, amount, kind, textOverride = "") {
            const actor = side === "player" ? this.playerActor : this.enemyActor;
            const hasNumericValue = Number.isFinite(amount) && amount > 0;
            if (!actor || (!hasNumericValue && !textOverride)) {
                return;
            }
            const motionFactor = this.reducedMotion ? 0.4 : 1;
            const lane = side === "player" ? "player" : "enemy";
            const queueIndex = this.impactQueueDepth[lane] || 0;
            const delay = Math.min(
                Math.round(1500 * this.combatSpeedMultiplier * motionFactor),
                Math.round(queueIndex * 340 * this.combatSpeedMultiplier * motionFactor)
            );
            this.impactQueueDepth[lane] = queueIndex + 1;

            window.setTimeout(() => {
                const chip = document.createElement("div");
                const stronger = kind === "crit" || kind === "shieldbreak";
                chip.className = `impact-text impact-${kind} impact-${lane}${stronger ? " impact-strong" : ""}`;
                chip.style.top = `calc(46% + ${Math.min(queueIndex, 4) * 10}px)`;
                if (textOverride) {
                    chip.textContent = textOverride;
                } else {
                    chip.textContent = `${kind === "heal" ? "+" : "-"}${amount}`;
                }
                actor.appendChild(chip);
                window.setTimeout(() => chip.remove(), Math.round((stronger ? 1150 : 980) * this.combatSpeedMultiplier * motionFactor));
            }, delay);

            window.setTimeout(() => {
                this.impactQueueDepth[lane] = Math.max(0, (this.impactQueueDepth[lane] || 1) - 1);
            }, delay + Math.round(1450 * this.combatSpeedMultiplier * motionFactor));
        }

        syncFullscreenUi() {
            const inFullscreen = Boolean(document.fullscreenElement);
            this.fullscreenBtn.style.display = inFullscreen ? "none" : "inline-block";
            this.fullscreenHint.style.display = inFullscreen ? "none" : "block";
            this.exitFullscreenBtn.style.display = inFullscreen ? "inline-block" : "none";
            if (this.menuFullscreenBtn) {
                this.menuFullscreenBtn.disabled = inFullscreen;
                this.menuFullscreenBtn.textContent = inFullscreen ? "Vollbild aktiv" : "Vollbild starten";
            }
            document.body.classList.toggle("is-fullscreen", inFullscreen);
        }
    }

    class AIController {
        cardCountsAsDamage(card) {
            return Boolean((card?.damage || 0) > 0 || card?.special?.kind === "execute_damage");
        }

        isCardBlockedByControlStatus(card, statuses) {
            if (!card || !statuses) {
                return false;
            }
            if (statuses.silenceTurns > 0 && (card.type === "special" || Boolean(card.status))) {
                return true;
            }
            return false;
        }

        getCardActionTag(card) {
            if (card.heal || card.special?.kind === "heal_and_shield" || card.special?.kind === "cleanse_and_heal") {
                return "heal";
            }
            if (card.shield) {
                return "shield";
            }
            if (card.damage || card.special?.kind === "execute_damage") {
                return "damage";
            }
            return "other";
        }

        getSynergyBonus(card, state) {
            const school = card?.school;
            const schoolRule = school ? ELEMENT_SET_BONUS_RULES[school] : null;
            const schoolCounts = state?.selfSchoolCounts || {};
            const projectedSchoolCount = schoolRule
                ? ((Number.isFinite(schoolCounts[school]) ? schoolCounts[school] : 0) + 1)
                : 0;
            const schoolActive = Boolean(schoolRule && projectedSchoolCount >= schoolRule.threshold);
            if (state?.synergyEnabled === false) {
                return {
                    active: false,
                    schoolActive: false,
                    schoolRule: null,
                    bonusDamage: 0,
                    bonusHeal: 0,
                    bonusShield: 0,
                    bonusStatusDamage: 0,
                    bonusStatusTurns: 0
                };
            }
            const rule = card ? CARD_SYNERGY_RULES[card.id] : null;
            const lastAction = state?.selfLastAction || null;
            const active = Boolean(rule && rule.requiresLastAction && rule.requiresLastAction === lastAction);
            return {
                active,
                schoolActive,
                schoolRule,
                bonusDamage: (active ? (rule.bonusDamage || 0) : 0) + (schoolActive ? (schoolRule.bonusDamage || 0) : 0),
                bonusHeal: (active ? (rule.bonusHeal || 0) : 0) + (schoolActive ? (schoolRule.bonusHeal || 0) : 0),
                bonusShield: (active ? (rule.bonusShield || 0) : 0) + (schoolActive ? (schoolRule.bonusShield || 0) : 0),
                bonusStatusDamage: (active ? (rule.bonusStatusDamage || 0) : 0) + (schoolActive ? (schoolRule.bonusStatusDamage || 0) : 0),
                bonusStatusTurns: (active ? (rule.bonusStatusTurns || 0) : 0) + (schoolActive ? (schoolRule.bonusStatusTurns || 0) : 0)
            };
        }

        getPersonalityProfile(personalityId) {
            return AI_PERSONALITY_PROFILES[personalityId] || AI_PERSONALITY_PROFILES.balanced;
        }

        getArchetypeProfile(archetypeId) {
            return AI_ARCHETYPE_PROFILES[archetypeId] || AI_ARCHETYPE_PROFILES.balanced;
        }

        chooseCardIndex(hand, enemyMana, difficulty, state) {
            const playableBase = hand
                .map((card, index) => ({ card, index }))
                .filter((entry) => entry.card.cost <= enemyMana && this.isConditionMet(entry.card, state))
                .filter((entry) => !this.isCardBlockedByControlStatus(entry.card, state.enemyStatuses));

            const forcedDamagePlayable = state?.enemyStatuses?.tauntTurns > 0
                ? playableBase.filter((entry) => this.cardCountsAsDamage(entry.card))
                : playableBase;
            const playable = forcedDamagePlayable.length > 0 ? forcedDamagePlayable : playableBase;

            if (playable.length === 0) {
                return -1;
            }

            if (difficulty === "easy") {
                const random = playable[Math.floor(Math.random() * playable.length)];
                return random.index;
            }

            const requestedDepth = difficulty === "hard" ? 3 : 2;
            const maxDepth = Math.max(1, Math.min(requestedDepth, state.enemyActionsRemaining || requestedDepth));
            const best = this.findBestCardWithLookahead(hand, enemyMana, state, maxDepth);
            if (best && best.index >= 0) {
                return best.index;
            }

            return this.findBestCard(playable, state) ?? playable[0].index;
        }

        estimatedDamage(card, state) {
            const eventDirectDamage = state.eventModifiers?.directDamageDelta || 0;
            const eventStatusDamage = state.eventModifiers?.statusTickDelta || 0;
            const synergy = this.getSynergyBonus(card, state);
            const comboBonus = card.comboGroup === "fire"
                ? Math.min(6, Math.max(0, state.selfFireCombo || 0) * 2)
                : 0;
            const baseDamage = Math.max(0, (card.damage || 0) + eventDirectDamage + comboBonus + synergy.bonusDamage);
            const statusBaseDamage = card.status ? (card.status.damage || 0) + synergy.bonusStatusDamage : 0;
            const statusTurns = card.status ? (card.status.turns || 0) + synergy.bonusStatusTurns : 0;
            const statusDamage = card.status ? Math.max(0, statusBaseDamage + eventStatusDamage) * Math.max(0, statusTurns) : 0;
            const shieldPenalty = Math.min(state.playerShield, baseDamage);
            return Math.max(0, baseDamage - shieldPenalty) + statusDamage;
        }

        isStatusActive(statuses, kind) {
            const effect = statuses[kind];
            return Boolean(effect && effect.turns > 0 && effect.damage > 0);
        }

        isConditionMet(card, state) {
            if (!card.condition) {
                return true;
            }

            if (card.condition.kind === "self_hp_at_or_below") {
                return state.enemyHP <= card.condition.value;
            }

            if (card.condition.kind === "target_hp_at_or_below") {
                return state.playerHP <= card.condition.value;
            }

            if (card.condition.kind === "self_has_negative_status") {
                return this.isStatusActive(state.enemyStatuses, "burn")
                    || this.isStatusActive(state.enemyStatuses, "hardBurn")
                    || this.isStatusActive(state.enemyStatuses, "poison");
            }

            return true;
        }

        cardScore(card, state) {
            const profile = this.getPersonalityProfile(state.aiPersonality);
            const archetype = this.getArchetypeProfile(state.aiArchetype);
            if (card.type === "special") {
                return this.specialCardScore(card, state) * profile.finisherWeight * archetype.finisherWeight;
            }

            if (card.type === "heal") {
                const synergy = this.getSynergyBonus(card, state);
                const missingHp = CONFIG.ENEMY_MAX_HP - state.enemyHP;
                return (missingHp > 0 ? Math.min((card.heal || 0) + synergy.bonusHeal, missingHp) * 1.2 : 0) * profile.healWeight * archetype.healWeight;
            }

            if (card.type === "shield") {
                const synergy = this.getSynergyBonus(card, state);
                const shieldTotal = (card.shield || 0) + synergy.bonusShield;
                const shieldScore = state.enemyShield <= 0 ? shieldTotal * 1.1 : shieldTotal;
                return shieldScore * profile.shieldWeight * archetype.shieldWeight;
            }

            let score = this.estimatedDamage(card, state) * profile.damageWeight * archetype.damageWeight;
            if (card.status?.kind === "poison" && state.playerDotDamage === 0) {
                score += 2;
            }
            if (card.status?.kind === "burn" || card.status?.kind === "hardBurn") {
                score += 1;
            }
            if (card.status) {
                score *= profile.statusWeight * archetype.statusWeight;
            }
            return score;
        }

        specialCardScore(card, state) {
            if (!this.isConditionMet(card, state) || !card.special) {
                return 0;
            }

            if (card.special.kind === "execute_damage") {
                const eventDirectDamage = state.eventModifiers?.directDamageDelta || 0;
                const rawDamage = Math.max(0, (card.special.damage || 0) + eventDirectDamage);
                const shieldPenalty = Math.min(state.playerShield, rawDamage);
                return Math.max(0, rawDamage - shieldPenalty) * 1.4;
            }

            if (card.special.kind === "heal_and_shield") {
                const missingHp = CONFIG.ENEMY_MAX_HP - state.enemyHP;
                return Math.min(missingHp, card.special.heal || 0) + (card.special.shield || 0);
            }

            if (card.special.kind === "cleanse_and_heal") {
                const hasNeg = this.isStatusActive(state.enemyStatuses, "burn")
                    || this.isStatusActive(state.enemyStatuses, "hardBurn")
                    || this.isStatusActive(state.enemyStatuses, "poison");
                return hasNeg ? (card.special.heal || 0) + 4 : 0;
            }

            if (card.special.kind === "dispel") {
                const dotValue = (state.playerStatuses?.burn?.turns || 0)
                    + (state.playerStatuses?.hardBurn?.turns || 0)
                    + (state.playerStatuses?.poison?.turns || 0);
                const shieldValue = state.playerShield || 0;
                return (dotValue * 1.3) + (shieldValue * 0.8) + 2;
            }

            if (card.special.kind === "silence") {
                const alreadySilenced = (state.playerStatuses?.silenceTurns || 0) > 0;
                return alreadySilenced ? 1.5 : 5;
            }

            if (card.special.kind === "taunt") {
                const alreadyTaunted = (state.playerStatuses?.tauntTurns || 0) > 0;
                return alreadyTaunted ? 1 : 4;
            }

            if (card.special.kind === "draw_engine") {
                return state.enemyMana <= 1 ? 5 : 3;
            }

            return 0;
        }

        cloneStatuses(statuses) {
            return {
                burn: { ...statuses.burn },
                hardBurn: { ...statuses.hardBurn },
                poison: { ...statuses.poison },
                shield: statuses.shield,
                silenceTurns: statuses.silenceTurns || 0,
                tauntTurns: statuses.tauntTurns || 0
            };
        }

        cloneState(state) {
            return {
                playerHP: state.playerHP,
                enemyHP: state.enemyHP,
                playerShield: state.playerShield,
                enemyShield: state.enemyShield,
                selfFireCombo: state.selfFireCombo || 0,
                aiPersonality: state.aiPersonality || "balanced",
                aiArchetype: state.aiArchetype || "balanced",
                eventModifiers: state.eventModifiers || {},
                playerStatuses: this.cloneStatuses(state.playerStatuses),
                enemyStatuses: this.cloneStatuses(state.enemyStatuses),
                enemyMana: state.enemyMana,
                selfLastAction: state.selfLastAction || null,
                synergyEnabled: state.synergyEnabled !== false,
                selfSchoolCounts: {
                    fire: Number.isFinite(state?.selfSchoolCounts?.fire) ? state.selfSchoolCounts.fire : 0,
                    shadow: Number.isFinite(state?.selfSchoolCounts?.shadow) ? state.selfSchoolCounts.shadow : 0,
                    nature: Number.isFinite(state?.selfSchoolCounts?.nature) ? state.selfSchoolCounts.nature : 0
                }
            };
        }

        applyStatusToSimulation(targetStatuses, status) {
            if (!status) {
                return;
            }
            const current = targetStatuses[status.kind];
            if (!current) {
                return;
            }
            current.turns += status.turns || 0;
            current.damage = Math.max(current.damage, status.damage || 0);
        }

        consumeShieldAndDamage(simState, rawDamage) {
            const shieldPenalty = Math.min(simState.playerShield, rawDamage);
            simState.playerShield -= shieldPenalty;
            const dealt = Math.max(0, rawDamage - shieldPenalty);
            simState.playerHP = Math.max(0, simState.playerHP - dealt);
            return dealt;
        }

        getComboBonus(card, currentCombo) {
            if (card.comboGroup !== "fire") {
                return { comboBonus: 0, nextCombo: 0 };
            }
            const nextCombo = currentCombo + 1;
            return {
                comboBonus: Math.min(6, Math.max(0, nextCombo - 1) * 2),
                nextCombo
            };
        }

        simulateCard(entry, baseState) {
            const sim = this.cloneState(baseState);
            const card = entry.card;
            const profile = this.getPersonalityProfile(sim.aiPersonality);
            const archetype = this.getArchetypeProfile(sim.aiArchetype);
            const synergy = this.getSynergyBonus(card, sim);
            let immediateScore = 0;

            const { comboBonus, nextCombo } = this.getComboBonus(card, sim.selfFireCombo || 0);
            sim.selfFireCombo = nextCombo;

            if (card.damage) {
                const eventDirectDamage = sim.eventModifiers?.directDamageDelta || 0;
                const rawDamage = Math.max(0, (card.damage || 0) + eventDirectDamage + comboBonus + synergy.bonusDamage);
                const dealt = this.consumeShieldAndDamage(sim, rawDamage);
                immediateScore += (dealt * 1.8) * profile.damageWeight * archetype.damageWeight;
            }

            if (card.status) {
                this.applyStatusToSimulation(sim.playerStatuses, {
                    ...card.status,
                    damage: Math.max(0, (card.status.damage || 0) + synergy.bonusStatusDamage),
                    turns: Math.max(0, (card.status.turns || 0) + synergy.bonusStatusTurns)
                });
                immediateScore += (((Math.max(0, (card.status.damage || 0) + synergy.bonusStatusDamage)) * Math.max(0, (card.status.turns || 0) + synergy.bonusStatusTurns)) * 0.7)
                    * profile.statusWeight * archetype.statusWeight;
            }

            if (card.heal) {
                const healDelta = sim.eventModifiers?.healDelta || 0;
                const healValue = Math.max(0, (card.heal || 0) + healDelta + synergy.bonusHeal);
                const missingHp = CONFIG.ENEMY_MAX_HP - sim.enemyHP;
                const effectiveHeal = Math.min(missingHp, healValue);
                sim.enemyHP = Math.min(CONFIG.ENEMY_MAX_HP, sim.enemyHP + healValue);
                immediateScore += (effectiveHeal * 1.1) * profile.healWeight * archetype.healWeight;
            }

            if (card.shield) {
                const shieldDelta = sim.eventModifiers?.shieldDelta || 0;
                const shieldValue = Math.max(0, (card.shield || 0) + shieldDelta + synergy.bonusShield);
                sim.enemyShield += shieldValue;
                immediateScore += (shieldValue * 0.8) * profile.shieldWeight * archetype.shieldWeight;
            }

            if (card.special?.kind === "execute_damage") {
                const eventDirectDamage = sim.eventModifiers?.directDamageDelta || 0;
                const rawDamage = Math.max(0, (card.special.damage || 0) + eventDirectDamage);
                const dealt = this.consumeShieldAndDamage(sim, rawDamage);
                immediateScore += (dealt * 2.2) * profile.finisherWeight * archetype.finisherWeight;
            }

            if (card.special?.kind === "heal_and_shield") {
                const healDelta = sim.eventModifiers?.healDelta || 0;
                const shieldDelta = sim.eventModifiers?.shieldDelta || 0;
                const healValue = Math.max(0, (card.special.heal || 0) + healDelta);
                const shieldValue = Math.max(0, (card.special.shield || 0) + shieldDelta);
                const missingHp = CONFIG.ENEMY_MAX_HP - sim.enemyHP;
                const effectiveHeal = Math.min(missingHp, healValue);
                sim.enemyHP = Math.min(CONFIG.ENEMY_MAX_HP, sim.enemyHP + healValue);
                sim.enemyShield += shieldValue;
                immediateScore += (effectiveHeal * 1.1 * profile.healWeight * archetype.healWeight)
                    + (shieldValue * 0.9 * profile.shieldWeight * archetype.shieldWeight);
            }

            if (card.special?.kind === "cleanse_and_heal") {
                const hadNegative = this.isStatusActive(sim.enemyStatuses, "burn")
                    || this.isStatusActive(sim.enemyStatuses, "hardBurn")
                    || this.isStatusActive(sim.enemyStatuses, "poison");
                if (hadNegative) {
                    sim.enemyStatuses.burn = { turns: 0, damage: 0 };
                    sim.enemyStatuses.hardBurn = { turns: 0, damage: 0 };
                    sim.enemyStatuses.poison = { turns: 0, damage: 0 };
                    immediateScore += 3.5 * profile.statusWeight * archetype.statusWeight;
                }
                const healDelta = sim.eventModifiers?.healDelta || 0;
                const healValue = Math.max(0, (card.special.heal || 0) + healDelta);
                const missingHp = CONFIG.ENEMY_MAX_HP - sim.enemyHP;
                const effectiveHeal = Math.min(missingHp, healValue);
                sim.enemyHP = Math.min(CONFIG.ENEMY_MAX_HP, sim.enemyHP + healValue);
                immediateScore += effectiveHeal * profile.healWeight * archetype.healWeight;
            }

            if (card.special?.kind === "dispel") {
                const removedShield = sim.playerShield || 0;
                sim.playerShield = 0;
                sim.playerStatuses.burn = { turns: 0, damage: 0 };
                sim.playerStatuses.hardBurn = { turns: 0, damage: 0 };
                sim.playerStatuses.poison = { turns: 0, damage: 0 };
                sim.playerStatuses.silenceTurns = 0;
                sim.playerStatuses.tauntTurns = 0;
                immediateScore += removedShield * 0.9 + 3;
            }

            if (card.special?.kind === "silence") {
                sim.playerStatuses.silenceTurns = (sim.playerStatuses.silenceTurns || 0) + Math.max(1, card.special.turns || 1);
                immediateScore += 4;
            }

            if (card.special?.kind === "taunt") {
                sim.playerStatuses.tauntTurns = (sim.playerStatuses.tauntTurns || 0) + Math.max(1, card.special.turns || 1);
                immediateScore += 3;
            }

            if (card.special?.kind === "draw_engine") {
                const drawCount = Math.max(1, card.special.draw || 1);
                immediateScore += drawCount * 2.2;
            }

            if (!card.comboGroup) {
                sim.selfFireCombo = 0;
            }

            if (card.school && sim.selfSchoolCounts && Object.prototype.hasOwnProperty.call(sim.selfSchoolCounts, card.school)) {
                sim.selfSchoolCounts[card.school] += 1;
            }

            sim.enemyMana = Math.max(0, sim.enemyMana - card.cost);
            sim.selfLastAction = this.getCardActionTag(card);
            return { state: sim, immediateScore };
        }

        evaluateSimulationState(simState) {
            let value = (CONFIG.PLAYER_MAX_HP - simState.playerHP) * 1.2;
            value += (simState.enemyHP - (CONFIG.ENEMY_MAX_HP - 20)) * 0.25;
            value += simState.enemyShield * 0.45;

            const burnValue = (simState.playerStatuses.burn.damage * simState.playerStatuses.burn.turns)
                + (simState.playerStatuses.hardBurn.damage * simState.playerStatuses.hardBurn.turns)
                + (simState.playerStatuses.poison.damage * simState.playerStatuses.poison.turns);
            value += burnValue * 0.6;
            value += (simState.playerStatuses.silenceTurns || 0) * 1.1;
            value += (simState.playerStatuses.tauntTurns || 0) * 0.8;

            return value;
        }

        searchBestSequence(hand, mana, state, depth) {
            const playableBase = hand
                .map((card, index) => ({ card, index }))
                .filter((entry) => entry.card.cost <= mana && this.isConditionMet(entry.card, state))
                .filter((entry) => !this.isCardBlockedByControlStatus(entry.card, state.enemyStatuses));
            const forcedDamagePlayable = state?.enemyStatuses?.tauntTurns > 0
                ? playableBase.filter((entry) => this.cardCountsAsDamage(entry.card))
                : playableBase;
            const playable = forcedDamagePlayable.length > 0 ? forcedDamagePlayable : playableBase;

            if (depth <= 0 || playable.length === 0) {
                return { score: this.evaluateSimulationState(state), index: -1 };
            }

            let best = { score: -Infinity, index: playable[0].index };

            playable.forEach((entry) => {
                const { state: nextState, immediateScore } = this.simulateCard(entry, {
                    ...state,
                    enemyMana: mana
                });
                const nextHand = hand.filter((_, idx) => idx !== entry.index);
                const future = this.searchBestSequence(nextHand, nextState.enemyMana, nextState, depth - 1);
                const totalScore = immediateScore + (future.score * 0.82);
                if (totalScore > best.score) {
                    best = { score: totalScore, index: entry.index };
                }
            });

            return best;
        }

        findBestCardWithLookahead(hand, enemyMana, state, depth) {
            const baseState = {
                playerHP: state.playerHP,
                enemyHP: state.enemyHP,
                playerShield: state.playerShield,
                enemyShield: state.enemyShield,
                selfFireCombo: state.selfFireCombo || 0,
                selfLastAction: state.selfLastAction || null,
                synergyEnabled: state.synergyEnabled !== false,
                aiPersonality: state.aiPersonality || "balanced",
                aiArchetype: state.aiArchetype || "balanced",
                playerStatuses: this.cloneStatuses(state.playerStatuses),
                enemyStatuses: this.cloneStatuses(state.enemyStatuses),
                eventModifiers: state.eventModifiers || {}
            };

            return this.searchBestSequence(hand, enemyMana, baseState, depth);
        }

        findBestCard(playable, state) {
            if (playable.length === 0) {
                return null;
            }

            const scored = playable
                .map((entry) => ({
                    index: entry.index,
                    score: this.cardScore(entry.card, state),
                    efficiency: this.cardScore(entry.card, state) / Math.max(1, entry.card.cost)
                }))
                .sort((a, b) => {
                    if (b.efficiency !== a.efficiency) {
                        return b.efficiency - a.efficiency;
                    }
                    return b.score - a.score;
                });

            return scored[0].index;
        }
    }

    class GameEngine {
        constructor(ui, aiController) {
            this.ui = ui;
            this.ai = aiController;
            this.sound = new SoundEngine();
            this.difficulty = "medium";
            this.gameActive = false;
            this.isPaused = false;
            this.playerTurn = true;
            this.playerActionsRemaining = CONFIG.PLAYER_ACTIONS_PER_TURN;
            this.enemyActionsRemaining = CONFIG.AI_ACTIONS_BY_DIFFICULTY.medium;
            this.isCardPlayAnimating = false;
            this.playerAbilityUsed = false;
            this.enemyAbilityUsed = false;
            this.comboState = {
                player: { group: null, chain: 0 },
                ai: { group: null, chain: 0 }
            };
            this.turnSynergyState = {
                player: { lastAction: null, schoolCounts: { fire: 0, shadow: 0, nature: 0 } },
                ai: { lastAction: null, schoolCounts: { fire: 0, shadow: 0, nature: 0 } }
            };
            this.roundNumber = 1;
            this.activeRoundEvent = null;
            this.activeRoundEventRoundsLeft = 0;
            this.activeMatchRelic = null;
            this.activeAiPersonalityId = "balanced";
            this.activeAiArchetypeId = "balanced";
            this.combatSpeed = "normal";
            this.synergyEnabled = true;
            this.accessibilitySettings = {
                fontScale: "normal",
                colorBlind: false,
                reducedMotion: false
            };
            this.enemySignatureUsed = false;
            this.campaignBossPhase = {
                active: false,
                triggered: false,
                thresholdHp: 0,
                name: "",
                damageBonus: 0,
                healBonus: 0,
                shieldBonus: 0
            };
            this.statsStorageKey = "aether_stats_v1";
            this.progressionStorageKey = "aether_progression_v1";
            this.campaignStorageKey = "aether_campaign_v1";
            this.audioSettingsStorageKey = "aether_audio_settings_v1";
            this.playerWins = 0;
            this.playerLosses = 0;
            this.recordByDifficulty = {
                easy: { wins: 0, losses: 0 },
                medium: { wins: 0, losses: 0 },
                hard: { wins: 0, losses: 0 }
            };
            this.cardUsageStats = {};
            this.progression = {
                xp: 0,
                level: 1,
                currency: 0,
                bossCurrency: 0,
                relicDust: 0,
                relicUpgradeLevel: 0,
                pendingBoosters: {
                    startMana: 0,
                    maxHp: 0
                },
                daily: null,
                challenge: null,
                weekly: null,
                shop: null,
                achievements: [],
                cosmetics: {
                    unlockedIds: ["initiand"],
                    activeId: "initiand"
                },
                cardBacks: {
                    unlockedIds: ["back_initiand"],
                    activeId: "back_initiand"
                },
                relics: {
                    unlockedIds: ["relic_blade"],
                    activeId: "relic_blade"
                }
            };
            this.tutorialIndex = 0;
            this.campaignProgress = this.createDefaultCampaignProgress();
            this.activeCampaignNode = null;
            this.pendingBossRelicReward = null;
            this.lanState = {
                playerName: "",
                hostAddress: "",
                shareUrl: "",
                role: "",
                sessionCode: "",
                ready: false,
                remoteReady: false,
                remoteName: "",
                localReady: false,
                channel: null,
                roomCode: "",
                connected: false,
                matchActive: false,
                remoteSnapshot: null,
                lastSyncAt: 0,
                lastResultSeenTs: 0,
                transport: "none",
                ws: null,
                wsOpen: false,
                pendingMessages: []
            };

            this.player = new Combatant(CONFIG.PLAYER_MAX_HP, CONFIG.START_MANA);
            this.enemy = new Combatant(CONFIG.ENEMY_MAX_HP, CONFIG.ENEMY_MAX_MANA);

            this.playerDeck = new Deck(CARD_LIBRARY.player);
            this.aiDeck = new Deck(this.buildAiDeckCards(this.difficulty, this.getCurrentAiArchetypeId()));
            this.cardIndexData = this.buildCardIndexData();
            this.loadPersistentStats();
            this.loadPersistentProgression();
            this.loadPersistentCampaign();
            this.loadAudioSettings();
            this.ensureProgressionStateCurrent();

            this.bindUi();
            this.bindAudioUnlock();
            this.bindLanStorageFallback();
            this.bindLanWatchdog();
            this.ui.syncDifficulty(this.difficulty);
            this.ui.setMenuRecord(this.getMenuRecordSnapshot());
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.ui.setMenuCampaignStatus(this.getCampaignStatusText());
            this.ui.setMenuSoundSettings(this.getMenuSettingsSnapshot());
            this.ui.setMenuAccessibilitySettings(this.getMenuSettingsSnapshot());
            this.ui.applyAccessibilitySettings(this.accessibilitySettings);
            this.ui.showMainMenu();
            this.render();
        }

        bindLanStorageFallback() {
            window.addEventListener("storage", (event) => {
                if (!event || event.key !== "aether_lan_result_v1" || !event.newValue) {
                    return;
                }
                let payload = null;
                try {
                    payload = JSON.parse(event.newValue);
                } catch (error) {
                    return;
                }
                if (!payload || this.lanState.role !== "client") {
                    return;
                }
                if ((payload.roomCode || "") !== (this.lanState.roomCode || "")) {
                    return;
                }
                this.lanState.lastResultSeenTs = Math.max(this.lanState.lastResultSeenTs || 0, Number(payload.ts) || 0);
                this.handleLanClientResult(String(payload.text || "Match beendet."));
            });
        }

        bindLanWatchdog() {
            window.setInterval(() => {
                if (this.lanState.role === "host" && this.lanState.matchActive) {
                    this.sendLanMessage({ type: "heartbeat" });
                }

                if (this.lanState.role !== "client" || !this.lanState.matchActive) {
                    return;
                }

                try {
                    const raw = window.localStorage.getItem("aether_lan_result_v1");
                    if (raw) {
                        const payload = JSON.parse(raw);
                        const payloadTs = Number(payload?.ts) || 0;
                        const sameRoom = (payload?.roomCode || "") === (this.lanState.roomCode || "");
                        if (sameRoom && payloadTs > (this.lanState.lastResultSeenTs || 0)) {
                            this.lanState.lastResultSeenTs = payloadTs;
                            this.handleLanClientResult(String(payload.text || "Match beendet."));
                            return;
                        }
                    }
                } catch (error) {
                    // Ignore storage parsing/access issues.
                }
            }, 1200);
        }

        bindAudioUnlock() {
            const unlock = () => this.sound.initFromUserGesture();
            document.addEventListener("pointerdown", unlock, { once: true });
            document.addEventListener("keydown", unlock, { once: true });
        }

        buildCardIndexData() {
            const unique = [];
            const seen = new Set();
            CARD_LIBRARY.player.forEach((card) => {
                if (seen.has(card.id)) {
                    return;
                }
                seen.add(card.id);

                const details = [];
                details.push(`Seltenheit: ${(card.rarity || "common").toUpperCase()}`);
                details.push(`Kosten: ${card.cost}`);
                if (card.school && ELEMENT_SCHOOL_LABELS[card.school]) details.push(`Schule: ${ELEMENT_SCHOOL_LABELS[card.school]}`);

                if (card.damage) details.push(`Schaden: ${card.damage}`);
                if (card.heal) details.push(`Heilung: ${card.heal}`);
                if (card.shield) details.push(`Schild: ${card.shield}`);
                if (card.status) details.push(`Status: ${card.status.kind} ${card.status.damage} für ${card.status.turns} Runden`);
                if (card.comboGroup === "fire") details.push("Set-Bonus: Feuer-Kombo");
                if (card.school && ELEMENT_SET_BONUS_RULES[card.school]) details.push(ELEMENT_SET_BONUS_RULES[card.school].description);
                if (CARD_SYNERGY_RULES[card.id]?.description) details.push(CARD_SYNERGY_RULES[card.id].description);
                if (card.condition) details.push(`Bedingung: ${this.getConditionDescription(card.condition)}`);
                if (card.special) details.push(`Spezial: ${this.getSpecialDescription(card.special)}`);

                unique.push({
                    name: card.name,
                    className: Utils.classNameFromCard(card.name),
                    details
                });
            });
            return unique;
        }

        getSynergyOverviewData() {
            const triggerMap = {
                heal: "Wenn vorher eine Heilkarte gespielt wurde",
                shield: "Wenn vorher eine Schildkarte gespielt wurde",
                damage: "Wenn vorher eine Schadenskarte gespielt wurde"
            };
            return Object.entries(CARD_SYNERGY_RULES).map(([cardId, rule]) => {
                const card = CARD_LIBRARY.player.find((entry) => entry.id === cardId);
                return {
                    cardName: card?.name || cardId,
                    triggerText: triggerMap[rule.requiresLastAction] || "Spezial-Trigger",
                    effectText: rule.description || "Synergie-Effekt"
                };
            });
        }

        getConditionDescription(condition) {
            if (condition.kind === "self_hp_at_or_below") return `Eigene HP <= ${condition.value}`;
            if (condition.kind === "target_hp_at_or_below") return `Gegner-HP <= ${condition.value}`;
            if (condition.kind === "self_has_negative_status") return "Eigene Brand/Gift-Effekte aktiv";
            return "Keine";
        }

        getSpecialDescription(special) {
            if (special.kind === "execute_damage") return `Spezialschaden ${special.damage}`;
            if (special.kind === "heal_and_shield") return `Heilt ${special.heal} und gibt ${special.shield} Schild`;
            if (special.kind === "cleanse_and_heal") return `Entfernt Brand/Gift und heilt ${special.heal}`;
            if (special.kind === "dispel") return "Entfernt Status- und Schild-Effekte vom Ziel";
            if (special.kind === "silence") return `Blockiert Spezial/Status fuer ${special.turns || 1} Zug`;
            if (special.kind === "taunt") return `Erzwingt Schadenskarte fuer ${special.turns || 1} Zug`;
            if (special.kind === "draw_engine") return `Zieht ${special.draw || 1} Karten`;
            return "Spezialeffekt";
        }

        buildAiDeckCards(difficulty, archetypeId = "balanced") {
            const archetypeDeckByDifficulty = AI_ARCHETYPE_DECKS[archetypeId];
            const chosenCards = archetypeDeckByDifficulty?.[difficulty];
            const strategy = AI_DECK_STRATEGIES[difficulty] || AI_DECK_STRATEGIES.medium;
            const aiBaseCards = CARD_LIBRARY.ai;

            return (chosenCards || strategy.cards)
                .map((entry) => {
                    const card = aiBaseCards.find((item) => item.id === entry.id);
                    if (!card || entry.copies <= 0) {
                        return null;
                    }
                    return { ...card, copies: entry.copies };
                })
                .filter(Boolean);
        }

        getDifficultyLabel() {
            const labels = { easy: "Easy", medium: "Medium", hard: "Hard" };
            return labels[this.difficulty] || this.difficulty;
        }

        getAiStrategyLabel() {
            const archetype = AI_ARCHETYPE_PROFILES[this.getCurrentAiArchetypeId()] || AI_ARCHETYPE_PROFILES.balanced;
            return `${archetype.label} (${(AI_DECK_STRATEGIES[this.difficulty] || AI_DECK_STRATEGIES.medium).label})`;
        }

        pickAiPersonalityForDifficulty() {
            const poolByDifficulty = {
                easy: ["guardian", "balanced"],
                medium: ["balanced", "tactician", "berserker"],
                hard: ["tactician", "berserker", "executioner"]
            };
            const pool = poolByDifficulty[this.difficulty] || poolByDifficulty.medium;
            return pool[Math.floor(Math.random() * pool.length)];
        }

        pickAiArchetypeForDifficulty() {
            const poolByDifficulty = {
                easy: ["balanced", "shield"],
                medium: ["poison", "shield", "burst"],
                hard: ["poison", "shield", "burst"]
            };
            const pool = poolByDifficulty[this.difficulty] || poolByDifficulty.medium;
            return pool[Math.floor(Math.random() * pool.length)];
        }

        getCurrentAiPersonalityId() {
            if (this.activeCampaignNode?.personalityId && AI_PERSONALITY_PROFILES[this.activeCampaignNode.personalityId]) {
                return this.activeCampaignNode.personalityId;
            }
            return this.activeAiPersonalityId || "balanced";
        }

        getCurrentAiPersonalityLabel() {
            const id = this.getCurrentAiPersonalityId();
            return (AI_PERSONALITY_PROFILES[id] || AI_PERSONALITY_PROFILES.balanced).label;
        }

        getCurrentAiArchetypeId() {
            if (this.activeCampaignNode?.archetypeId && AI_ARCHETYPE_PROFILES[this.activeCampaignNode.archetypeId]) {
                return this.activeCampaignNode.archetypeId;
            }
            return this.activeAiArchetypeId || "balanced";
        }

        getCurrentAiArchetypeLabel() {
            const id = this.getCurrentAiArchetypeId();
            return (AI_ARCHETYPE_PROFILES[id] || AI_ARCHETYPE_PROFILES.balanced).label;
        }

        getSignatureCardName(cardId) {
            if (!cardId) {
                return "";
            }
            const card = CARD_LIBRARY.ai.find((entry) => entry.id === cardId);
            return card ? card.name : cardId;
        }

        getAiActionsPerTurn() {
            return CONFIG.AI_ACTIONS_BY_DIFFICULTY[this.difficulty] || CONFIG.AI_ACTIONS_BY_DIFFICULTY.medium;
        }

        playImpactSound(kind) {
            if (kind === "heal") {
                this.sound.play("heal");
                return;
            }
            if (kind === "tick") {
                this.sound.play("tick");
                return;
            }
            if (kind === "crit") {
                this.sound.play("crit");
                return;
            }
            if (kind === "shieldbreak") {
                this.sound.play("shieldBreak");
                return;
            }
            this.sound.play("hit");
        }

        setupCampaignBossPhase() {
            const phaseConfig = this.activeCampaignNode?.phase2;
            if (!phaseConfig) {
                this.campaignBossPhase = {
                    active: false,
                    triggered: false,
                    thresholdHp: 0,
                    name: "",
                    damageBonus: 0,
                    healBonus: 0,
                    shieldBonus: 0
                };
                return;
            }

            this.campaignBossPhase = {
                active: false,
                triggered: false,
                thresholdHp: Math.max(1, Math.ceil(this.enemy.maxHp * 0.5)),
                name: phaseConfig.name || "Phase 2",
                damageBonus: Math.max(0, Math.floor(phaseConfig?.bonuses?.damage || 0)),
                healBonus: Math.max(0, Math.floor(phaseConfig?.bonuses?.heal || 0)),
                shieldBonus: Math.max(0, Math.floor(phaseConfig?.bonuses?.shield || 0))
            };
        }

        maybeTriggerCampaignBossPhase() {
            const phaseConfig = this.activeCampaignNode?.phase2;
            if (!phaseConfig || !this.gameActive || !this.campaignBossPhase || this.campaignBossPhase.triggered || this.enemy.hp <= 0) {
                return;
            }
            if (this.enemy.hp > this.campaignBossPhase.thresholdHp) {
                return;
            }

            this.campaignBossPhase.triggered = true;
            this.campaignBossPhase.active = true;

            const heal = Math.max(0, Math.floor(phaseConfig?.onTrigger?.heal || 0));
            const shield = Math.max(0, Math.floor(phaseConfig?.onTrigger?.shield || 0));
            const mana = Math.max(0, Math.floor(phaseConfig?.onTrigger?.mana || 0));
            if (heal > 0) {
                this.enemy.receiveHeal(heal);
            }
            if (shield > 0) {
                this.enemy.addShield(shield);
            }
            if (mana > 0) {
                this.enemy.mana = Math.min(CONFIG.ENEMY_MAX_MANA + this.getTotalModifier("manaDelta"), this.enemy.mana + mana);
            }

            const phaseName = this.campaignBossPhase.name || "Phase 2";
            this.ui.addLog(`${this.getEnemyDisplayName()} aktiviert ${phaseName}!`, this.getAiLogSource());
            this.ui.showMessage(`${this.getEnemyDisplayName()}: ${phaseName}!`, 1800);
        }

        getBossPhaseBonus(type) {
            if (!this.campaignBossPhase?.active) {
                return 0;
            }
            if (type === "damage") {
                return this.campaignBossPhase.damageBonus || 0;
            }
            if (type === "heal") {
                return this.campaignBossPhase.healBonus || 0;
            }
            if (type === "shield") {
                return this.campaignBossPhase.shieldBonus || 0;
            }
            return 0;
        }

        runAfterDelayWhenActive(delayMs, action) {
            const scaledDelay = this.getScaledDelay(delayMs);
            window.setTimeout(() => {
                const tryRun = () => {
                    if (!this.gameActive) {
                        return;
                    }
                    if (this.isPaused) {
                        window.setTimeout(tryRun, 120);
                        return;
                    }
                    action();
                };
                tryRun();
            }, scaledDelay);
        }

        getCombatSpeedMultiplier() {
            return COMBAT_SPEED_OPTIONS[this.combatSpeed]?.multiplier || COMBAT_SPEED_OPTIONS.normal.multiplier;
        }

        getScaledDelay(delayMs) {
            const base = Number.isFinite(delayMs) ? delayMs : 0;
            return Math.max(0, Math.round(base * this.getCombatSpeedMultiplier()));
        }

        normalizeAccessibilitySettings(accessibility) {
            const fontScale = typeof accessibility?.fontScale === "string" && ["normal", "large", "xlarge"].includes(accessibility.fontScale)
                ? accessibility.fontScale
                : "normal";
            return {
                fontScale,
                colorBlind: Boolean(accessibility?.colorBlind),
                reducedMotion: Boolean(accessibility?.reducedMotion)
            };
        }

        getMenuSettingsSnapshot() {
            const sound = this.sound.getSettings();
            return {
                volume: sound.volume,
                muted: sound.muted,
                channels: {
                    ui: sound.channels?.ui ?? 1,
                    combat: sound.channels?.combat ?? 1,
                    events: sound.channels?.events ?? 1
                },
                combatSpeed: this.combatSpeed,
                synergyEnabled: this.synergyEnabled,
                accessibility: this.normalizeAccessibilitySettings(this.accessibilitySettings)
            };
        }

        consumePlayerAction() {
            this.playerActionsRemaining = Math.max(0, this.playerActionsRemaining - 1);
        }

        consumeEnemyAction() {
            this.enemyActionsRemaining = Math.max(0, this.enemyActionsRemaining - 1);
        }

        resetCombo(side) {
            this.comboState[side] = { group: null, chain: 0 };
        }

        resetAllCombos() {
            this.resetCombo("player");
            this.resetCombo("ai");
        }

        resetSynergyState(side = "") {
            if (side === "player" || side === "ai") {
                this.turnSynergyState[side] = { lastAction: null, schoolCounts: { fire: 0, shadow: 0, nature: 0 } };
                return;
            }
            this.turnSynergyState.player = { lastAction: null, schoolCounts: { fire: 0, shadow: 0, nature: 0 } };
            this.turnSynergyState.ai = { lastAction: null, schoolCounts: { fire: 0, shadow: 0, nature: 0 } };
        }

        getCardActionTag(card) {
            if (card.heal || card.special?.kind === "heal_and_shield" || card.special?.kind === "cleanse_and_heal") {
                return "heal";
            }
            if (card.shield) {
                return "shield";
            }
            if (card.damage || card.special?.kind === "execute_damage") {
                return "damage";
            }
            return "other";
        }

        setLastActionForSide(side, action) {
            if (!this.turnSynergyState[side]) {
                return;
            }
            this.turnSynergyState[side].lastAction = action || null;
        }

        trackCardSchoolForSide(side, card) {
            if (!this.turnSynergyState[side] || !card?.school || !ELEMENT_SET_BONUS_RULES[card.school]) {
                return 0;
            }
            const counts = this.turnSynergyState[side].schoolCounts;
            if (!counts) {
                return 0;
            }
            counts[card.school] = (Number.isFinite(counts[card.school]) ? counts[card.school] : 0) + 1;
            return counts[card.school];
        }

        getSchoolSetBonus(card, side, schoolCount = 0) {
            const school = card?.school;
            const rule = school ? ELEMENT_SET_BONUS_RULES[school] : null;
            if (!rule || !this.synergyEnabled) {
                return {
                    active: false,
                    rule: null,
                    school: "",
                    schoolLabel: "",
                    bonusDamage: 0,
                    bonusHeal: 0,
                    bonusShield: 0,
                    bonusStatusDamage: 0,
                    bonusStatusTurns: 0
                };
            }
            const count = schoolCount > 0
                ? schoolCount
                : (this.turnSynergyState?.[side]?.schoolCounts?.[school] || 0);
            const active = count >= rule.threshold;
            return {
                active,
                rule,
                school,
                schoolLabel: ELEMENT_SCHOOL_LABELS[school] || school,
                bonusDamage: active ? (rule.bonusDamage || 0) : 0,
                bonusHeal: active ? (rule.bonusHeal || 0) : 0,
                bonusShield: active ? (rule.bonusShield || 0) : 0,
                bonusStatusDamage: active ? (rule.bonusStatusDamage || 0) : 0,
                bonusStatusTurns: active ? (rule.bonusStatusTurns || 0) : 0
            };
        }

        getCardSynergyBonus(card, side) {
            if (!this.synergyEnabled) {
                return {
                    active: false,
                    rule: null,
                    schoolActive: false,
                    schoolRule: null,
                    bonusDamage: 0,
                    bonusHeal: 0,
                    bonusShield: 0,
                    bonusStatusDamage: 0,
                    bonusStatusTurns: 0
                };
            }
            const rule = card ? CARD_SYNERGY_RULES[card.id] : null;
            const lastAction = this.turnSynergyState[side]?.lastAction || null;
            const active = Boolean(rule && rule.requiresLastAction && rule.requiresLastAction === lastAction);
            const schoolSet = this.getSchoolSetBonus(card, side);
            return {
                active,
                rule,
                schoolActive: schoolSet.active,
                schoolRule: schoolSet.rule,
                schoolLabel: schoolSet.schoolLabel,
                bonusDamage: (active ? (rule.bonusDamage || 0) : 0) + schoolSet.bonusDamage,
                bonusHeal: (active ? (rule.bonusHeal || 0) : 0) + schoolSet.bonusHeal,
                bonusShield: (active ? (rule.bonusShield || 0) : 0) + schoolSet.bonusShield,
                bonusStatusDamage: (active ? (rule.bonusStatusDamage || 0) : 0) + schoolSet.bonusStatusDamage,
                bonusStatusTurns: (active ? (rule.bonusStatusTurns || 0) : 0) + schoolSet.bonusStatusTurns
            };
        }

        applyComboForCard(card, side) {
            const state = this.comboState[side];
            if (!state) {
                return 0;
            }

            if (!card.comboGroup) {
                this.resetCombo(side);
                return 0;
            }

            if (state.group === card.comboGroup) {
                state.chain += 1;
            } else {
                state.group = card.comboGroup;
                state.chain = 1;
            }

            if (card.comboGroup === "fire") {
                return Math.min(6, Math.max(0, state.chain - 1) * 2);
            }

            return 0;
        }

        getCurrentFireCombo(side) {
            const state = this.comboState[side];
            if (!state || state.group !== "fire") {
                return 0;
            }
            return state.chain;
        }

        getEventModifier(key) {
            return this.activeRoundEvent?.modifiers?.[key] || 0;
        }

        getRelicModifier(key) {
            return this.activeMatchRelic?.modifiers?.[key] || 0;
        }

        getTotalModifier(key) {
            return this.getEventModifier(key) + this.getRelicModifier(key);
        }

        getCurrentGlobalModifiers() {
            return {
                directDamageDelta: this.getTotalModifier("directDamageDelta"),
                statusTickDelta: this.getTotalModifier("statusTickDelta"),
                healDelta: this.getTotalModifier("healDelta"),
                shieldDelta: this.getTotalModifier("shieldDelta"),
                manaDelta: this.getTotalModifier("manaDelta")
            };
        }

        rollMatchRelic() {
            const relic = this.getRelicById(this.progression.relics.activeId) || MATCH_RELIC_POOL[0];
            this.activeMatchRelic = relic;
            this.ui.setMatchRelic(relic);
            this.ui.addLog(`Match-Relikt: ${relic.name} (${relic.description})`);
        }

        rollRoundEvent() {
            const randomEvent = ROUND_EVENT_POOL[Math.floor(Math.random() * ROUND_EVENT_POOL.length)];
            this.activeRoundEvent = randomEvent;
            this.activeRoundEventRoundsLeft = 2;
            this.ui.setRoundEvent({ ...randomEvent, roundsLeft: this.activeRoundEventRoundsLeft });
            this.ui.addLog(`Runde ${this.roundNumber}: ${randomEvent.type} - ${randomEvent.name} (${randomEvent.description})`);
        }

        advanceRoundEvent() {
            if (!this.activeRoundEvent) {
                this.rollRoundEvent();
                return;
            }

            this.activeRoundEventRoundsLeft -= 1;
            if (this.activeRoundEventRoundsLeft <= 0) {
                this.rollRoundEvent();
                return;
            }

            this.ui.setRoundEvent({ ...this.activeRoundEvent, roundsLeft: this.activeRoundEventRoundsLeft });
        }

        getModifiedDamage(value) {
            return Math.max(0, value + this.getTotalModifier("directDamageDelta"));
        }

        getModifiedStatusTickDamage(value) {
            return Math.max(0, value + this.getTotalModifier("statusTickDelta"));
        }

        getModifiedHeal(value) {
            return Math.max(0, value + this.getTotalModifier("healDelta"));
        }

        getModifiedShield(value) {
            return Math.max(0, value + this.getTotalModifier("shieldDelta"));
        }

        changeDifficulty(newDifficulty) {
            if (this.campaignProgress.activeRun && this.gameActive) {
                this.ui.showMessage("Im Kampagnenkampf ist die Schwierigkeit fix.", 1800);
                this.ui.syncDifficulty(this.difficulty);
                return;
            }
            this.difficulty = newDifficulty;
            this.aiDeck = new Deck(this.buildAiDeckCards(this.difficulty, this.getCurrentAiArchetypeId()));
            this.ui.syncDifficulty(newDifficulty);
            if (this.gameActive) {
                this.reset();
                this.ui.addLog(`Schwierigkeit: ${this.getDifficultyLabel()} | KI-Deck: ${this.getAiStrategyLabel()}`);
            }
        }

        startMatchFromMenu() {
            this.campaignProgress.activeRun = null;
            this.activeCampaignNode = null;
            this.activeAiPersonalityId = this.pickAiPersonalityForDifficulty();
            this.activeAiArchetypeId = this.pickAiArchetypeForDifficulty();
            this.aiDeck = new Deck(this.buildAiDeckCards(this.difficulty, this.getCurrentAiArchetypeId()));
            this.savePersistentCampaign();
            this.gameActive = true;
            this.isPaused = false;
            this.ui.hideMainMenu();
            this.ui.hidePauseMenu();
            this.reset();
            this.ui.setMenuCampaignStatus(this.getCampaignStatusText());
        }

        openTutorialFromMenu() {
            this.tutorialIndex = 0;
            this.renderTutorialStep();
        }

        createLanSessionCode() {
            const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            let code = "";
            for (let i = 0; i < 6; i += 1) {
                code += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
            return code;
        }

        isLanCode(value) {
            return /^[A-Z0-9]{6}$/.test(String(value || "").trim().toUpperCase());
        }

        isLanHostMatchActive() {
            return this.lanState.matchActive && this.lanState.role === "host";
        }

        isLanClientMatchActive() {
            return this.lanState.matchActive && this.lanState.role === "client";
        }

        normalizeLanAddress(address) {
            return String(address || "")
                .trim()
                .replace(/^https?:\/\//i, "")
                .replace(/\/.*$/, "");
        }

        createLanShareUrl(address) {
            const host = this.normalizeLanAddress(address);
            if (!host) {
                return "";
            }
            const protocol = window.location.protocol && window.location.protocol.startsWith("http")
                ? window.location.protocol
                : "http:";
            return `${protocol}//${host}${window.location.pathname}`;
        }

        closeLanChannel() {
            if (this.lanState.channel) {
                this.lanState.channel.onmessage = null;
                this.lanState.channel.close();
                this.lanState.channel = null;
            }
            if (this.lanState.ws) {
                this.lanState.ws.onopen = null;
                this.lanState.ws.onmessage = null;
                this.lanState.ws.onclose = null;
                this.lanState.ws.onerror = null;
                try {
                    this.lanState.ws.close();
                } catch (error) {
                    // Ignore close issues.
                }
                this.lanState.ws = null;
            }
            this.lanState.wsOpen = false;
            this.lanState.pendingMessages = [];
            this.lanState.transport = "none";
        }

        getLanWebSocketUrl() {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            if (!window.location.host) {
                return "";
            }
            return `${protocol}//${window.location.host}/lan`;
        }

        canUseLanWebSocket() {
            const hasWs = "WebSocket" in window;
            const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
            return hasWs && isHttp && Boolean(window.location.host);
        }

        openLanWebSocketTransport(roomCode, role) {
            const wsUrl = this.getLanWebSocketUrl();
            if (!wsUrl) {
                return false;
            }
            this.closeLanChannel();
            const safeCode = String(roomCode || "").trim().toUpperCase();
            this.lanState.roomCode = safeCode;
            this.lanState.role = role;
            this.lanState.transport = "ws";
            this.lanState.lastSyncAt = Date.now();
            this.lanState.wsOpen = false;
            this.lanState.pendingMessages = [];

            let socket = null;
            try {
                socket = new WebSocket(wsUrl);
            } catch (error) {
                this.lanState.transport = "none";
                return false;
            }

            this.lanState.ws = socket;
            socket.onopen = () => {
                this.lanState.wsOpen = true;
                const intro = {
                    type: "hello",
                    role,
                    roomCode: safeCode,
                    playerName: this.lanState.playerName || (role === "host" ? "Host" : "Spieler 2")
                };
                socket.send(JSON.stringify(intro));
                const queue = this.lanState.pendingMessages.slice();
                this.lanState.pendingMessages = [];
                queue.forEach((payload) => {
                    try {
                        socket.send(JSON.stringify({ type: "relay", payload }));
                    } catch (error) {
                        // Ignore failed sends.
                    }
                });
            };
            socket.onmessage = (event) => {
                let data = null;
                try {
                    data = JSON.parse(event.data);
                } catch (error) {
                    return;
                }
                if (!data || typeof data !== "object") {
                    return;
                }
                if (data.type === "peer" && data.payload) {
                    this.onLanChannelMessage(data.payload);
                    return;
                }
                if (data.type === "system" && data.event === "error") {
                    const msg = String(data.message || "Verbindungsfehler.");
                    if (this.ui.mainMenu?.classList.contains("show")) {
                        this.ui.showMenuLan(this.getLanMenuSnapshot(msg));
                    }
                }
            };
            socket.onclose = () => {
                this.lanState.wsOpen = false;
            };
            socket.onerror = () => {
                this.lanState.wsOpen = false;
            };
            return true;
        }

        openLanBroadcastChannel(roomCode, role) {
            if (!("BroadcastChannel" in window)) {
                return false;
            }
            this.closeLanChannel();
            const safeCode = String(roomCode || "").trim().toUpperCase();
            this.lanState.roomCode = safeCode;
            this.lanState.channel = new BroadcastChannel(`aether_lan_${safeCode}`);
            this.lanState.channel.onmessage = (event) => this.onLanChannelMessage(event.data);
            this.lanState.role = role;
            this.lanState.transport = "broadcast";
            this.lanState.lastSyncAt = Date.now();
            return true;
        }

        openLanRealtimeTransport(roomCode, role) {
            if (this.canUseLanWebSocket()) {
                const ok = this.openLanWebSocketTransport(roomCode, role);
                if (ok) {
                    return true;
                }
            }
            const broadcastOk = this.openLanBroadcastChannel(roomCode, role);
            if (broadcastOk) {
                return true;
            }
            this.ui.showMenuLan(this.getLanMenuSnapshot("Keine LAN-Verbindung moeglich (WebSocket/Broadcast nicht verfuegbar)."));
            return false;
        }

        getLanTransportLabel() {
            if (this.lanState.transport === "ws") {
                return "WLAN (WebSocket)";
            }
            if (this.lanState.transport === "broadcast") {
                return "Lokal (gleicher Browser)";
            }
            return "Unbekannt";
        }

        sendLanMessage(payload) {
            if (!payload) {
                return;
            }
            const envelope = {
                ...payload,
                ts: Date.now(),
                senderRole: this.lanState.role
            };
            if (this.lanState.transport === "broadcast") {
                if (!this.lanState.channel) {
                    return;
                }
                this.lanState.channel.postMessage(envelope);
                return;
            }
            if (this.lanState.transport === "ws") {
                const ws = this.lanState.ws;
                if (!ws) {
                    return;
                }
                if (!this.lanState.wsOpen || ws.readyState !== WebSocket.OPEN) {
                    this.lanState.pendingMessages.push(envelope);
                    return;
                }
                try {
                    ws.send(JSON.stringify({ type: "relay", payload: envelope }));
                } catch (error) {
                    // Ignore send failure.
                }
            }
        }

        broadcastLanResult(text) {
            const message = { type: "result", text: String(text || "Match beendet.") };
            this.sendLanMessage(message);
            window.setTimeout(() => this.sendLanMessage(message), 120);
            window.setTimeout(() => this.sendLanMessage(message), 280);
        }

        publishLanResultToStorage(text) {
            const roomCode = this.lanState.roomCode || this.lanState.sessionCode || "";
            if (!roomCode) {
                return;
            }
            const payload = {
                roomCode,
                text: String(text || "Match beendet."),
                ts: Date.now()
            };
            try {
                window.localStorage.setItem("aether_lan_result_v1", JSON.stringify(payload));
            } catch (error) {
                // Ignore storage write issues.
            }
        }

        handleLanClientResult(text) {
            this.lanState.matchActive = false;
            this.lanState.connected = false;
            this.lanState.localReady = false;
            this.lanState.remoteReady = false;
            this.lanState.remoteSnapshot = null;
            this.lanState.lastSyncAt = 0;
            this.gameActive = false;
            this.isPaused = false;
            this.playerTurn = false;
            this.playerActionsRemaining = 0;
            this.enemyActionsRemaining = 0;
            this.ui.hidePauseMenu();
            this.closeLanChannel();
            this.ui.showMainMenu(String(text || "Match beendet."));
        }

        onLanChannelMessage(message) {
            if (!message || typeof message !== "object") {
                return;
            }
            this.lanState.lastSyncAt = Date.now();
            if (message.senderRole === this.lanState.role) {
                return;
            }

            if (this.lanState.role === "host") {
                this.onLanHostMessage(message);
                return;
            }
            if (this.lanState.role === "client") {
                this.onLanClientMessage(message);
            }
        }

        onLanHostMessage(message) {
            if (message.type === "join") {
                this.lanState.connected = true;
                this.lanState.remoteName = String(message.playerName || "Spieler 2");
                this.sendLanMessage({
                    type: "host_ack",
                    hostName: this.lanState.playerName || "Host",
                    roomCode: this.lanState.roomCode
                });
                this.ui.showMenuLanLobby(this.getLanLobbySnapshot(`${this.lanState.remoteName} ist beigetreten.`));
                return;
            }
            if (message.type === "ready") {
                this.lanState.remoteReady = Boolean(message.ready);
                this.tryStartLanMatchIfReady();
                return;
            }
            if (message.type === "command") {
                this.applyLanClientCommand(message.command, message.index);
            }
        }

        onLanClientMessage(message) {
            if (message.type === "host_ack") {
                this.lanState.connected = true;
                this.lanState.remoteName = String(message.hostName || "Host");
                this.ui.showMenuLanLobby(this.getLanLobbySnapshot(`Verbunden mit ${this.lanState.remoteName}.`));
                return;
            }
            if (message.type === "heartbeat") {
                return;
            }
            if (message.type === "start") {
                this.lanState.matchActive = true;
                this.gameActive = true;
                this.isPaused = false;
                this.ui.hideMainMenu();
                this.ui.hidePauseMenu();
                return;
            }
            if (message.type === "state" && message.snapshot) {
                this.lanState.remoteSnapshot = message.snapshot;
                if (this.isLanClientMatchActive()) {
                    this.render();
                }
            }
            if (message.type === "result") {
                this.handleLanClientResult(String(message.text || "Match beendet."));
            }
        }

        tryStartLanMatchIfReady() {
            if (!this.lanState.connected || !this.lanState.localReady || !this.lanState.remoteReady) {
                const local = this.lanState.localReady ? "bereit" : "nicht bereit";
                const remote = this.lanState.remoteReady ? "bereit" : "nicht bereit";
                this.ui.showMenuLanLobby(this.getLanLobbySnapshot(`Lobby: Du ${local}, Gegner ${remote}.`));
                return;
            }
            this.startLanMatchAsHost();
        }

        buildLanSnapshotForClient() {
            return {
                player: {
                    hp: this.player.hp,
                    mana: this.player.mana,
                    statuses: JSON.parse(JSON.stringify(this.player.statuses))
                },
                enemy: {
                    hp: this.enemy.hp,
                    mana: this.enemy.mana,
                    statuses: JSON.parse(JSON.stringify(this.enemy.statuses))
                },
                playerHand: this.player.hand.map((card) => ({ ...card })),
                enemyHand: this.enemy.hand.map((card) => ({ ...card })),
                playerTurn: this.playerTurn,
                playerActionsRemaining: this.playerActionsRemaining,
                enemyActionsRemaining: this.enemyActionsRemaining,
                playerAbilityUsed: this.playerAbilityUsed,
                enemyAbilityUsed: this.enemyAbilityUsed,
                playerTitle: `${(this.getActiveCampaignTitle().title)} | ${(this.getCosmeticById(this.progression.cosmetics.activeId) || COSMETIC_REWARDS[0]).title}`,
                hostName: this.lanState.playerName || "Host",
                clientName: this.lanState.remoteName || "Spieler 2"
            };
        }

        pushLanStateToClient() {
            if (!this.isLanHostMatchActive()) {
                return;
            }
            this.sendLanMessage({
                type: "state",
                snapshot: this.buildLanSnapshotForClient()
            });
        }

        startLanMatchAsHost() {
            this.lanState.matchActive = true;
            this.gameActive = true;
            this.isPaused = false;
            this.ui.hideMainMenu();
            this.ui.hidePauseMenu();
            this.activeCampaignNode = null;
            this.campaignProgress.activeRun = null;
            this.aiDeck = new Deck(CARD_LIBRARY.player);
            this.reset("LAN 1v1 gestartet.");
            this.sendLanMessage({ type: "start" });
            this.pushLanStateToClient();
        }

        getLanMenuSnapshot(statusText = "") {
            return {
                playerName: this.lanState.playerName || "",
                hostAddress: this.lanState.hostAddress || "",
                shareUrl: this.lanState.shareUrl || "",
                statusText: statusText || "Wähle Host oder Beitreten."
            };
        }

        getLanLobbySnapshot(statusText = "") {
            return {
                ready: Boolean(this.lanState.ready),
                statusText: statusText || "Lobby geoeffnet."
            };
        }

        openLanMenu() {
            this.lanState.ready = false;
            this.lanState.localReady = false;
            const text = this.lanState.role
                ? `Letzte Rolle: ${this.lanState.role === "host" ? "Host" : "Client"}`
                : "LAN Sync: Host startet Session-Code, Client tritt per Code bei.";
            this.ui.showMenuLan(this.getLanMenuSnapshot(text));
        }

        setLanPlayerNameFromMenu(value) {
            this.lanState.playerName = String(value || "").slice(0, 24);
        }

        setLanHostAddressFromMenu(value) {
            this.lanState.hostAddress = this.normalizeLanAddress(String(value || "").slice(0, 120));
            this.lanState.shareUrl = this.createLanShareUrl(this.lanState.hostAddress);
        }

        startLanHostFromMenu() {
            const localHost = this.normalizeLanAddress(window.location.host);
            if (!this.lanState.hostAddress && localHost && localHost !== "localhost" && localHost !== "127.0.0.1") {
                this.lanState.hostAddress = localHost;
            }
            this.lanState.ready = false;
            this.lanState.localReady = false;
            this.lanState.remoteReady = false;
            this.lanState.connected = false;
            this.lanState.remoteSnapshot = null;
            this.lanState.sessionCode = this.createLanSessionCode();
            this.lanState.shareUrl = this.createLanShareUrl(this.lanState.hostAddress);
            if (!this.openLanRealtimeTransport(this.lanState.sessionCode, "host")) {
                return;
            }
            const status = this.lanState.shareUrl
                ? `Host gestartet (${this.getLanTransportLabel()}). Session-Code: ${this.lanState.sessionCode}. Teile Code oder Link mit Spieler 2.`
                : `Host gestartet (${this.getLanTransportLabel()}). Session-Code: ${this.lanState.sessionCode}. Teile den Session-Code mit Spieler 2.`;
            this.ui.showMenuLanLobby(this.getLanLobbySnapshot(status));
        }

        copyLanShareUrlFromMenu() {
            const shareUrl = (this.lanState.shareUrl || "").trim();
            if (!shareUrl) {
                this.ui.showMenuLan(this.getLanMenuSnapshot("Kein Link vorhanden. Erst Host-Adresse eintragen oder Host starten."));
                return;
            }
            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                navigator.clipboard.writeText(shareUrl)
                    .then(() => {
                        this.ui.showMenuLan(this.getLanMenuSnapshot("Link kopiert. An zweiten Spieler senden."));
                    })
                    .catch(() => {
                        this.ui.showMenuLan(this.getLanMenuSnapshot("Kopieren blockiert. Link im Feld manuell kopieren."));
                    });
                return;
            }
            this.ui.showMenuLan(this.getLanMenuSnapshot("Kopieren nicht unterstützt. Link im Feld manuell kopieren."));
        }

        joinLanFromMenu() {
            const rawValue = String(this.lanState.hostAddress || "").trim();
            if (!rawValue) {
                this.ui.showMenuLan(this.getLanMenuSnapshot("Bitte Session-Code oder Host-Adresse eingeben."));
                return;
            }
            const maybeCode = rawValue.toUpperCase();
            const roomCode = this.isLanCode(maybeCode) ? maybeCode : "";
            if (!roomCode) {
                this.ui.showMenuLan(this.getLanMenuSnapshot("Bitte einen gueltigen Session-Code (6 Zeichen) eingeben."));
                return;
            }
            this.lanState.hostAddress = rawValue;
            this.lanState.localReady = false;
            this.lanState.remoteReady = false;
            this.lanState.connected = false;
            this.lanState.remoteSnapshot = null;
            this.lanState.ready = false;
            if (!this.openLanRealtimeTransport(roomCode, "client")) {
                return;
            }
            this.sendLanMessage({
                type: "join",
                playerName: this.lanState.playerName || "Spieler 2"
            });
            const status = `Beitritt vorbereitet (${this.getLanTransportLabel()}) zu Session ${roomCode}. Warte auf Host.`;
            this.ui.showMenuLanLobby(this.getLanLobbySnapshot(status));
        }

        toggleLanReadyFromMenu() {
            this.lanState.localReady = !this.lanState.localReady;
            this.lanState.ready = this.lanState.localReady;
            const status = this.lanState.localReady
                ? "Du bist bereit. Warte auf den zweiten Spieler."
                : "Bereit aufgehoben.";
            this.sendLanMessage({
                type: "ready",
                ready: this.lanState.localReady
            });
            if (this.lanState.role === "host") {
                this.tryStartLanMatchIfReady();
                return;
            }
            this.ui.showMenuLanLobby(this.getLanLobbySnapshot(status));
        }

        leaveLanSessionFromMenu() {
            this.closeLanChannel();
            this.lanState.matchActive = false;
            this.lanState.connected = false;
            this.lanState.localReady = false;
            this.lanState.remoteReady = false;
            this.lanState.remoteSnapshot = null;
            this.lanState.roomCode = "";
            this.ui.showMenuHome();
        }

        renderTutorialStep() {
            const maxIndex = TUTORIAL_STEPS.length - 1;
            this.tutorialIndex = Math.max(0, Math.min(maxIndex, this.tutorialIndex));
            const step = TUTORIAL_STEPS[this.tutorialIndex];
            this.ui.showMenuTutorial({ ...step, index: this.tutorialIndex }, TUTORIAL_STEPS.length);
        }

        nextTutorialStep() {
            this.tutorialIndex = Math.min(TUTORIAL_STEPS.length - 1, this.tutorialIndex + 1);
            this.renderTutorialStep();
        }

        prevTutorialStep() {
            this.tutorialIndex = Math.max(0, this.tutorialIndex - 1);
            this.renderTutorialStep();
        }

        sanitizeDifficultyRecord(value) {
            if (!value || typeof value !== "object") {
                return { wins: 0, losses: 0 };
            }
            const wins = Number.isFinite(value.wins) ? Math.max(0, Math.floor(value.wins)) : 0;
            const losses = Number.isFinite(value.losses) ? Math.max(0, Math.floor(value.losses)) : 0;
            return { wins, losses };
        }

        recalcTotalsFromDifficulty() {
            const easy = this.recordByDifficulty.easy;
            const medium = this.recordByDifficulty.medium;
            const hard = this.recordByDifficulty.hard;
            this.playerWins = easy.wins + medium.wins + hard.wins;
            this.playerLosses = easy.losses + medium.losses + hard.losses;
        }

        getMenuRecordSnapshot() {
            return {
                totalWins: this.playerWins,
                totalLosses: this.playerLosses,
                byDifficulty: this.recordByDifficulty
            };
        }

        createDefaultCampaignProgress() {
            const clearedByRegion = {};
            CAMPAIGN_REGIONS.forEach((region) => {
                clearedByRegion[region.id] = 0;
            });
            return {
                selectedRegionId: CAMPAIGN_REGIONS[0].id,
                clearedByRegion,
                titles: {
                    unlockedIds: ["title_wanderer"],
                    activeId: "title_wanderer"
                },
                activeRun: null
            };
        }

        getCampaignRegionById(regionId) {
            return CAMPAIGN_REGIONS.find((region) => region.id === regionId) || CAMPAIGN_REGIONS[0];
        }

        getCampaignNodeType(node) {
            const type = String(node?.nodeType || "battle").toLowerCase();
            if (["event", "shop", "battle", "elite", "boss"].includes(type)) {
                return type;
            }
            return "battle";
        }

        getCampaignNodeTypeLabel(nodeType) {
            const labels = {
                event: "Event",
                shop: "Shop",
                battle: "Kampf",
                elite: "Elite",
                boss: "Boss"
            };
            return labels[nodeType] || "Knoten";
        }

        getCampaignNodeTitle(node) {
            const nodeType = this.getCampaignNodeType(node);
            if (nodeType === "event" || nodeType === "shop") {
                return node?.title || this.getCampaignNodeTypeLabel(nodeType);
            }
            return node?.enemyName || "Unbekannter Gegner";
        }

        isCampaignCombatNode(node) {
            const nodeType = this.getCampaignNodeType(node);
            return nodeType === "battle" || nodeType === "elite" || nodeType === "boss";
        }

        formatCampaignNodeRewardLine(rewards) {
            if (!rewards || typeof rewards !== "object") {
                return "Kein Bonus";
            }
            const parts = [];
            if (Number.isFinite(rewards.xp) && rewards.xp > 0) parts.push(`+${Math.floor(rewards.xp)} XP`);
            if (Number.isFinite(rewards.playerMaxHpBonus) && rewards.playerMaxHpBonus > 0) parts.push(`+${Math.floor(rewards.playerMaxHpBonus)} Max-HP (Run)`);
            if (Number.isFinite(rewards.playerStartManaBonus) && rewards.playerStartManaBonus > 0) parts.push(`+${Math.floor(rewards.playerStartManaBonus)} Start-Mana (Run)`);
            if (Number.isFinite(rewards.bonusXpOnWin) && rewards.bonusXpOnWin > 0) parts.push(`+${Math.floor(rewards.bonusXpOnWin)} XP pro Kampfsieg`);
            return parts.length > 0 ? parts.join(" | ") : "Kein Bonus";
        }

        getCampaignNodeDetailLine(node) {
            const nodeType = this.getCampaignNodeType(node);
            if (!this.isCampaignCombatNode(node)) {
                const description = node?.description || "Besonderer Zwischenknoten.";
                const rewardsLine = this.formatCampaignNodeRewardLine(node?.rewards);
                return `${description} | Bonus: ${rewardsLine}`;
            }
            return `${this.getDifficultyLabelFromValue(node.difficulty)} | Gegner-HP: ${node.enemyHp} | KI: ${this.getPersonalityLabelById(node.personalityId)} | Archetyp: ${this.getArchetypeLabelById(node.archetypeId)}${node.signatureCardId ? ` | Signatur: ${this.getSignatureCardName(node.signatureCardId)}` : ""}${node.phase2?.name ? ` | Phase 2: ${node.phase2.name}` : ""}`;
        }

        getCampaignRunBonuses(run = this.campaignProgress.activeRun) {
            if (!run) {
                return { playerMaxHpBonus: 0, playerStartManaBonus: 0, bonusXpOnWin: 0 };
            }
            return {
                playerMaxHpBonus: Number.isFinite(run.playerMaxHpBonus) ? Math.max(0, Math.floor(run.playerMaxHpBonus)) : 0,
                playerStartManaBonus: Number.isFinite(run.playerStartManaBonus) ? Math.max(0, Math.floor(run.playerStartManaBonus)) : 0,
                bonusXpOnWin: Number.isFinite(run.bonusXpOnWin) ? Math.max(0, Math.floor(run.bonusXpOnWin)) : 0
            };
        }

        createCampaignRunState(regionId, nodeIndex = 0, source = null) {
            const sourceBonuses = this.getCampaignRunBonuses(source || {});
            return {
                regionId,
                nodeIndex,
                playerMaxHpBonus: sourceBonuses.playerMaxHpBonus,
                playerStartManaBonus: sourceBonuses.playerStartManaBonus,
                bonusXpOnWin: sourceBonuses.bonusXpOnWin
            };
        }

        applyCampaignNodeRewards(node) {
            const run = this.campaignProgress.activeRun;
            if (!run || !node || !node.rewards) {
                return "";
            }
            const rewards = node.rewards;
            const summaryParts = [];
            if (Number.isFinite(rewards.playerMaxHpBonus) && rewards.playerMaxHpBonus > 0) {
                run.playerMaxHpBonus = Math.min(30, this.getCampaignRunBonuses(run).playerMaxHpBonus + Math.floor(rewards.playerMaxHpBonus));
                summaryParts.push(`Run-Bonus: +${Math.floor(rewards.playerMaxHpBonus)} Max-HP`);
            }
            if (Number.isFinite(rewards.playerStartManaBonus) && rewards.playerStartManaBonus > 0) {
                run.playerStartManaBonus = Math.min(6, this.getCampaignRunBonuses(run).playerStartManaBonus + Math.floor(rewards.playerStartManaBonus));
                summaryParts.push(`Run-Bonus: +${Math.floor(rewards.playerStartManaBonus)} Start-Mana`);
            }
            if (Number.isFinite(rewards.bonusXpOnWin) && rewards.bonusXpOnWin > 0) {
                run.bonusXpOnWin = Math.min(120, this.getCampaignRunBonuses(run).bonusXpOnWin + Math.floor(rewards.bonusXpOnWin));
                summaryParts.push(`Run-Bonus: +${Math.floor(rewards.bonusXpOnWin)} XP pro Kampfsieg`);
            }
            if (Number.isFinite(rewards.xp) && rewards.xp > 0) {
                const oldLevel = this.progression.level;
                const xpGain = Math.floor(rewards.xp);
                this.progression.xp += xpGain;
                this.progression.level = this.calculateLevelFromXp(this.progression.xp);
                if (this.progression.level > oldLevel) {
                    this.unlockCosmeticsForLevel(this.progression.level);
                    this.unlockRelicsForLevel(this.progression.level);
                }
                summaryParts.push(`+${xpGain} XP`);
                this.savePersistentProgression();
            }
            return summaryParts.join(" | ");
        }

        getCampaignStatusText() {
            const run = this.campaignProgress.activeRun;
            if (!run) {
                return "Kampagne: Nicht aktiv";
            }
            const region = this.getCampaignRegionById(run.regionId);
            const node = region.nodes[run.nodeIndex] || region.nodes[0];
            return `Kampagne aktiv: ${region.name} - ${this.getCampaignNodeTitle(node)} (${run.nodeIndex + 1}/${region.nodes.length})`;
        }

        getCampaignMenuSnapshot() {
            const selectedRegion = this.getCampaignRegionById(this.campaignProgress.selectedRegionId);
            const selectedRegionId = selectedRegion.id;
            const activeRun = this.campaignProgress.activeRun;
            const activeRunInSelected = activeRun && activeRun.regionId === selectedRegionId;
            const clearedCount = Math.max(0, Math.min(
                selectedRegion.nodes.length,
                Number.isFinite(this.campaignProgress.clearedByRegion[selectedRegionId])
                    ? this.campaignProgress.clearedByRegion[selectedRegionId]
                    : 0
            ));
            const nextNodeIndex = activeRunInSelected
                ? activeRun.nodeIndex
                : (clearedCount >= selectedRegion.nodes.length ? 0 : clearedCount);

            const selectedRegionNodes = selectedRegion.nodes.map((node, index) => {
                const done = index < clearedCount;
                const current = index === nextNodeIndex;
                const locked = index > nextNodeIndex;
                const nodeType = this.getCampaignNodeType(node);
                const nodeTypeLabel = this.getCampaignNodeTypeLabel(nodeType);
                const stateLabel = done ? "Erledigt" : (current ? "Nächster Knoten" : "Gesperrt");
                const stateClass = done ? "done" : (current ? "current" : "locked");
                return {
                    index: index + 1,
                    title: `${nodeTypeLabel}: ${this.getCampaignNodeTitle(node)}`,
                    detailLine: this.getCampaignNodeDetailLine(node),
                    stateLabel,
                    stateClass,
                    nodeTypeClass: `type-${nodeType}`
                };
            });

            const runText = activeRun
                ? (() => {
                    const region = this.getCampaignRegionById(activeRun.regionId);
                    const bonuses = this.getCampaignRunBonuses(activeRun);
                    const bonusParts = [];
                    if (bonuses.playerMaxHpBonus > 0) bonusParts.push(`HP+${bonuses.playerMaxHpBonus}`);
                    if (bonuses.playerStartManaBonus > 0) bonusParts.push(`Mana+${bonuses.playerStartManaBonus}`);
                    if (bonuses.bonusXpOnWin > 0) bonusParts.push(`XP+${bonuses.bonusXpOnWin}/Sieg`);
                    const bonusText = bonusParts.length > 0 ? ` | Run-Boni: ${bonusParts.join(", ")}` : "";
                    return `Aktiver Lauf: ${region.name} (${activeRun.nodeIndex + 1}/${region.nodes.length})${bonusText}`;
                })()
                : "Kein aktiver Lauf";

            return {
                selectedRegionId,
                regions: CAMPAIGN_REGIONS.map((region) => ({ id: region.id, name: region.name })),
                selectedRegionNodes,
                runText,
                startButtonText: activeRunInSelected ? "Pfad fortsetzen" : "Pfad starten"
            };
        }

        getDifficultyLabelFromValue(value) {
            const labels = { easy: "Easy", medium: "Medium", hard: "Hard" };
            return labels[value] || value;
        }

        getPersonalityLabelById(id) {
            if (!id) {
                return AI_PERSONALITY_PROFILES.balanced.label;
            }
            return (AI_PERSONALITY_PROFILES[id] || AI_PERSONALITY_PROFILES.balanced).label;
        }

        getArchetypeLabelById(id) {
            if (!id) {
                return AI_ARCHETYPE_PROFILES.balanced.label;
            }
            return (AI_ARCHETYPE_PROFILES[id] || AI_ARCHETYPE_PROFILES.balanced).label;
        }

        getCampaignTitleById(id) {
            return CAMPAIGN_TITLE_REWARDS.find((entry) => entry.id === id) || null;
        }

        getActiveCampaignTitle() {
            const activeId = this.campaignProgress?.titles?.activeId || "title_wanderer";
            return this.getCampaignTitleById(activeId) || CAMPAIGN_TITLE_REWARDS[0];
        }

        updateCampaignTitlesFromProgress(announce = false) {
            if (!this.campaignProgress.titles || !Array.isArray(this.campaignProgress.titles.unlockedIds)) {
                this.campaignProgress.titles = {
                    unlockedIds: ["title_wanderer"],
                    activeId: "title_wanderer"
                };
            }

            let unlockedAny = false;
            CAMPAIGN_TITLE_REWARDS.forEach((reward) => {
                const clears = reward.regionId
                    ? (this.campaignProgress.clearedByRegion[reward.regionId] || 0)
                    : reward.requiredClears;
                const unlocked = clears >= reward.requiredClears;
                if (unlocked && !this.campaignProgress.titles.unlockedIds.includes(reward.id)) {
                    this.campaignProgress.titles.unlockedIds.push(reward.id);
                    this.campaignProgress.titles.activeId = reward.id;
                    unlockedAny = true;
                    if (announce) {
                        this.ui.addLog(`Titel freigeschaltet: ${reward.title}`, "player");
                        this.ui.showMessage(`Neuer Titel: ${reward.title}`, 1800);
                    }
                }
            });

            if (!this.campaignProgress.titles.unlockedIds.includes(this.campaignProgress.titles.activeId)) {
                this.campaignProgress.titles.activeId = this.campaignProgress.titles.unlockedIds[this.campaignProgress.titles.unlockedIds.length - 1];
            }

            return unlockedAny;
        }

        getTodayKey() {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, "0");
            const d = String(now.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }

        getWeekKey() {
            const now = new Date();
            const utc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
            const day = utc.getUTCDay() || 7;
            utc.setUTCDate(utc.getUTCDate() + 4 - day);
            const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
            const weekNo = Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
            return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
        }

        chooseTemplateFromPool(pool, seedString) {
            const seed = seedString.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
            return pool[seed % pool.length];
        }

        createQuestState(template, extra = {}) {
            return {
                id: template.id,
                title: template.title,
                metric: template.metric,
                target: template.target,
                rewardXp: template.rewardXp,
                progress: 0,
                completed: false,
                ...extra
            };
        }

        randomChallengeTemplate(excludeId = "") {
            const available = CHALLENGE_POOL.filter((entry) => entry.id !== excludeId);
            const pool = available.length > 0 ? available : CHALLENGE_POOL;
            return pool[Math.floor(Math.random() * pool.length)];
        }

        calculateAchievementTarget(baseTarget, tier) {
            return Math.max(baseTarget, Math.floor(baseTarget * tier));
        }

        calculateAchievementReward(baseRewardXp, tier) {
            return Math.max(baseRewardXp, Math.floor(baseRewardXp * (1 + (tier - 1) * 0.35)));
        }

        buildAchievementDescription(metric, target, tier) {
            const tierText = `Stufe ${tier}/${MAX_ACHIEVEMENT_TIER}`;
            if (metric === "cardsPlayed") return `${tierText}: Spiele insgesamt ${target} Karten.`;
            if (metric === "damageDealt") return `${tierText}: Verursache insgesamt ${target} Schaden.`;
            if (metric === "wins") return `${tierText}: Gewinne insgesamt ${target} Matches.`;
            if (metric === "winsHard") return `${tierText}: Gewinne ${target} Matches auf Hard.`;
            return `${tierText}: Erreiche ${target} Fortschritt.`;
        }

        createAchievementState(template, input = {}) {
            const tier = Math.max(1, Math.min(MAX_ACHIEVEMENT_TIER, Number.isFinite(input.tier) ? Math.floor(input.tier) : 1));
            const baseTarget = Math.max(1, Number.isFinite(input.baseTarget) ? Math.floor(input.baseTarget) : template.target);
            const baseRewardXp = Math.max(1, Number.isFinite(input.baseRewardXp) ? Math.floor(input.baseRewardXp) : template.rewardXp);
            const target = this.calculateAchievementTarget(baseTarget, tier);
            const rewardXp = this.calculateAchievementReward(baseRewardXp, tier);
            const progress = Math.max(0, Math.min(target, Number.isFinite(input.progress) ? Math.floor(input.progress) : 0));
            const title = tier > 1 ? `${template.title} ${tier}` : template.title;
            const completed = Boolean(input.completed) || (tier >= MAX_ACHIEVEMENT_TIER && progress >= target);
            return {
                id: template.id,
                title,
                baseTitle: template.title,
                description: this.buildAchievementDescription(template.metric, target, tier),
                metric: template.metric,
                tier,
                baseTarget,
                baseRewardXp,
                target,
                rewardXp,
                progress,
                completed
            };
        }

        normalizeAchievements(input) {
            if (!Array.isArray(input)) {
                return ACHIEVEMENT_POOL.map((entry) => this.createAchievementState(entry));
            }
            return ACHIEVEMENT_POOL.map((template) => {
                const raw = input.find((entry) => entry && entry.id === template.id) || {};
                return this.createAchievementState(template, raw);
            });
        }

        ensureProgressionStateCurrent() {
            const today = this.getTodayKey();
            const weekKey = this.getWeekKey();
            let changed = false;

            if (!this.progression.cosmetics || !Array.isArray(this.progression.cosmetics.unlockedIds)) {
                this.progression.cosmetics = { unlockedIds: ["initiand"], activeId: "initiand" };
                changed = true;
            }
            if (!this.progression.relics || !Array.isArray(this.progression.relics.unlockedIds)) {
                this.progression.relics = { unlockedIds: ["relic_blade"], activeId: "relic_blade" };
                changed = true;
            }
            if (!this.progression.cardBacks || !Array.isArray(this.progression.cardBacks.unlockedIds)) {
                this.progression.cardBacks = { unlockedIds: ["back_initiand"], activeId: "back_initiand" };
                changed = true;
            }
            if (!Number.isFinite(this.progression.currency)) {
                this.progression.currency = 0;
                changed = true;
            }
            this.progression.currency = Math.max(0, Math.floor(this.progression.currency));
            if (!Number.isFinite(this.progression.bossCurrency)) {
                this.progression.bossCurrency = 0;
                changed = true;
            }
            this.progression.bossCurrency = Math.max(0, Math.floor(this.progression.bossCurrency));
            if (!Number.isFinite(this.progression.relicDust)) {
                this.progression.relicDust = 0;
                changed = true;
            }
            this.progression.relicDust = Math.max(0, Math.floor(this.progression.relicDust));
            if (!this.progression.pendingBoosters || typeof this.progression.pendingBoosters !== "object") {
                this.progression.pendingBoosters = { startMana: 0, maxHp: 0 };
                changed = true;
            }
            this.progression.pendingBoosters.startMana = Math.max(0, Math.floor(this.progression.pendingBoosters.startMana || 0));
            this.progression.pendingBoosters.maxHp = Math.max(0, Math.floor(this.progression.pendingBoosters.maxHp || 0));
            if (!Number.isFinite(this.progression.relicUpgradeLevel)) {
                this.progression.relicUpgradeLevel = 0;
                changed = true;
            }
            this.progression.relicUpgradeLevel = Math.max(0, Math.min(RELIC_UPGRADE_MAX_LEVEL, Math.floor(this.progression.relicUpgradeLevel)));
            if (!this.progression.cardBacks.unlockedIds.includes(this.progression.cardBacks.activeId)) {
                this.progression.cardBacks.activeId = this.progression.cardBacks.unlockedIds[this.progression.cardBacks.unlockedIds.length - 1] || "back_initiand";
                changed = true;
            }

            if (this.unlockCosmeticsForLevel(this.progression.level, false)) {
                changed = true;
            }
            if (this.unlockRelicsForLevel(this.progression.level, false)) {
                changed = true;
            }
            if (this.unlockCardBacksForLevel(this.progression.level, false)) {
                changed = true;
            }

            if (!this.progression.daily || this.progression.daily.dateKey !== today) {
                const dailyTemplate = this.chooseTemplateFromPool(DAILY_QUEST_POOL, today);
                this.progression.daily = this.createQuestState(dailyTemplate, { dateKey: today });
                changed = true;
            }

            if (!this.progression.challenge) {
                const challengeTemplate = this.randomChallengeTemplate();
                this.progression.challenge = this.createQuestState(challengeTemplate);
                changed = true;
            }

            if (!this.progression.weekly || this.progression.weekly.weekKey !== weekKey) {
                const weeklyTemplate = this.chooseTemplateFromPool(WEEKLY_QUEST_POOL, weekKey);
                this.progression.weekly = this.createQuestState(weeklyTemplate, { weekKey });
                changed = true;
            }

            if (!Array.isArray(this.progression.achievements)) {
                this.progression.achievements = this.normalizeAchievements([]);
                changed = true;
            } else {
                const normalizedAchievements = this.normalizeAchievements(this.progression.achievements);
                if (normalizedAchievements.length !== this.progression.achievements.length) {
                    changed = true;
                }
                this.progression.achievements = normalizedAchievements;
            }

            const hasLegacyShopShape = this.progression.shop
                && typeof this.progression.shop === "object"
                && Array.isArray(this.progression.shop.offers);
            if (!this.progression.shop || typeof this.progression.shop !== "object" || hasLegacyShopShape) {
                this.progression.shop = this.createShopState(today, weekKey);
                changed = true;
            }
            if (this.progression.shop.dailyDateKey !== today) {
                this.progression.shop.dailyDateKey = today;
                this.progression.shop.dailyOffers = this.createShopOffersFromSlots(DAILY_SHOP_SLOTS, today, "daily");
                this.progression.shop.reroll = { dateKey: today, freeUsed: 0, paidUsed: 0 };
                changed = true;
            }
            if (this.progression.shop.weeklyKey !== weekKey) {
                this.progression.shop.weeklyKey = weekKey;
                this.progression.shop.weeklyOffers = this.createShopOffersFromSlots(WEEKLY_SHOP_SLOTS, weekKey, "weekly");
                changed = true;
            }
            if (!this.progression.shop.reroll || this.progression.shop.reroll.dateKey !== today) {
                this.progression.shop.reroll = { dateKey: today, freeUsed: 0, paidUsed: 0 };
                changed = true;
            }
            this.progression.shop.reroll.freeUsed = Math.max(0, Math.min(DAILY_FREE_REROLLS, Math.floor(this.progression.shop.reroll.freeUsed || 0)));
            this.progression.shop.reroll.paidUsed = Math.max(0, Math.min(DAILY_MAX_PAID_REROLLS, Math.floor(this.progression.shop.reroll.paidUsed || 0)));
            if (!Array.isArray(this.progression.shop.dailyOffers)) {
                this.progression.shop.dailyOffers = this.createShopOffersFromSlots(DAILY_SHOP_SLOTS, today, "daily");
                changed = true;
            }
            if (!Array.isArray(this.progression.shop.weeklyOffers)) {
                this.progression.shop.weeklyOffers = this.createShopOffersFromSlots(WEEKLY_SHOP_SLOTS, weekKey, "weekly");
                changed = true;
            }

            if (changed) {
                this.savePersistentProgression();
            }
        }

        calculateLevelFromXp(xp) {
            return Math.floor(Math.max(0, xp) / 100) + 1;
        }

        normalizeQuest(input, pool, extra = {}) {
            if (!input || typeof input !== "object") {
                const fallback = pool[0];
                return this.createQuestState(fallback, extra);
            }

            const template = pool.find((entry) => entry.id === input.id) || pool[0];
            const target = Math.max(1, Number.isFinite(input.target) ? Math.floor(input.target) : template.target);
            const progress = Math.max(0, Math.min(target, Number.isFinite(input.progress) ? Math.floor(input.progress) : 0));
            return {
                id: template.id,
                title: template.title,
                metric: template.metric,
                target,
                rewardXp: template.rewardXp,
                progress,
                completed: progress >= target || Boolean(input.completed),
                ...extra
            };
        }

        getMenuProgressionSnapshot() {
            const activeReward = this.getCosmeticById(this.progression.cosmetics.activeId) || COSMETIC_REWARDS[0];
            const activeRelic = this.getRelicById(this.progression.relics.activeId) || MATCH_RELIC_POOL[0];
            const activeCardBack = this.getCardBackById(this.progression.cardBacks.activeId) || CARD_BACK_REWARDS[0];
            const activeCampaignTitle = this.getActiveCampaignTitle();
            return {
                level: this.progression.level,
                xp: this.progression.xp,
                currency: Math.max(0, Math.floor(this.progression.currency || 0)),
                bossCurrency: Math.max(0, Math.floor(this.progression.bossCurrency || 0)),
                daily: this.progression.daily,
                challenge: this.progression.challenge,
                weekly: this.progression.weekly,
                achievements: {
                    entries: this.progression.achievements,
                    completedTiers: this.progression.achievements.reduce((sum, entry) => sum + Math.max(0, (entry.tier || 1) - 1), 0),
                    totalCount: this.progression.achievements.length
                },
                cosmetics: {
                    activeId: activeReward.id,
                    activeTitle: activeReward.title,
                    panelClass: activeReward.panelClass,
                    unlockedCount: this.progression.cosmetics.unlockedIds.length
                },
                cardBacks: {
                    activeId: activeCardBack.id,
                    activeTitle: activeCardBack.title,
                    unlockedCount: this.progression.cardBacks.unlockedIds.length
                },
                relics: {
                    activeId: activeRelic.id,
                    activeName: activeRelic.name,
                    unlockedCount: this.progression.relics.unlockedIds.length
                },
                campaignTitles: {
                    activeId: activeCampaignTitle.id,
                    activeTitle: activeCampaignTitle.title,
                    unlockedCount: this.campaignProgress?.titles?.unlockedIds?.length || 1
                }
            };
        }

        getRewardTrackData() {
            const cosmeticRewards = COSMETIC_REWARDS.map((reward) => ({
                level: reward.minLevel,
                title: reward.title,
                category: "Kosmetik",
                description: "",
                requiredXp: (reward.minLevel - 1) * 100,
                unlocked: this.progression.level >= reward.minLevel
            }));

            const relicRewards = MATCH_RELIC_POOL.map((relic) => ({
                level: relic.minLevel,
                title: relic.name,
                category: "Relikt",
                description: relic.description,
                requiredXp: (relic.minLevel - 1) * 100,
                unlocked: this.progression.level >= relic.minLevel
            }));

            return [...cosmeticRewards, ...relicRewards]
                .sort((a, b) => (a.level - b.level) || a.title.localeCompare(b.title));
        }

        getStatsSnapshot() {
            const difficulties = [
                { key: "easy", label: "Easy" },
                { key: "medium", label: "Medium" },
                { key: "hard", label: "Hard" }
            ];

            const difficultyRows = difficulties.map((entry) => {
                const row = this.recordByDifficulty[entry.key] || { wins: 0, losses: 0 };
                const total = row.wins + row.losses;
                const winrate = total > 0 ? Math.round((row.wins / total) * 100) : 0;
                return {
                    label: entry.label,
                    wins: row.wins,
                    losses: row.losses,
                    winrate
                };
            });

            const topCards = Object.entries(this.cardUsageStats)
                .filter(([, count]) => Number.isFinite(count) && count > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([id, count]) => ({
                    id,
                    count,
                    name: (CARD_LIBRARY.player.find((card) => card.id === id) || { name: id }).name
                }));

            return { difficultyRows, topCards };
        }

        trackCardUsage(cardId) {
            if (!cardId) {
                return;
            }
            const current = this.cardUsageStats[cardId] || 0;
            this.cardUsageStats[cardId] = current + 1;
            this.savePersistentStats();
        }

        getCosmeticById(id) {
            return COSMETIC_REWARDS.find((entry) => entry.id === id) || null;
        }

        getRelicById(id) {
            return MATCH_RELIC_POOL.find((entry) => entry.id === id)
                || BOSS_RELIC_POOL.find((entry) => entry.id === id)
                || null;
        }

        buildBossRelicChoices(bossNodeId = "") {
            const rewardIds = BOSS_RELIC_REWARDS_BY_NODE[bossNodeId] || [];
            return rewardIds
                .map((id) => this.getRelicById(id))
                .filter(Boolean);
        }

        openBossRelicRewardMenu(postText = "", bossNodeId = "", bossName = "") {
            const choices = this.buildBossRelicChoices(bossNodeId);
            if (!choices.length) {
                this.ui.showMainMenu(postText || "Boss besiegt.");
                return;
            }
            const unlocked = new Set(this.progression.relics?.unlockedIds || []);
            const selectableChoices = choices.filter((entry) => !unlocked.has(entry.id));
            if (selectableChoices.length <= 0) {
                this.ui.showMainMenu(`${postText || "Boss besiegt."} | Alle Boss-Relikte bereits erhalten.`);
                return;
            }
            this.pendingBossRelicReward = {
                postText: postText || "Boss besiegt.",
                bossNodeId,
                choices: choices.map((entry) => entry.id),
                selectableChoices: selectableChoices.map((entry) => entry.id)
            };
            this.ui.showMainMenu(postText || "Boss besiegt.");
            this.ui.showMenuBossRelic({
                text: `${bossName || "Boss"} besiegt! Wähle 1 von 3 Boss-Relikten als Beute:`,
                choices: choices.map((entry) => ({
                    id: entry.id,
                    name: entry.name,
                    description: entry.description,
                    owned: unlocked.has(entry.id),
                    pickDisabled: unlocked.has(entry.id),
                    pickLabel: unlocked.has(entry.id) ? "Bereits erhalten" : "Dieses Relikt nehmen"
                }))
            });
        }

        pickBossRelicReward(relicId) {
            if (!this.pendingBossRelicReward) {
                return;
            }
            const allowed = this.pendingBossRelicReward.selectableChoices || [];
            if (!allowed.includes(relicId)) {
                this.ui.showMessage("Dieses Boss-Relikt hast du bereits oder es ist nicht auswählbar.", 1400);
                return;
            }
            const relic = this.getRelicById(relicId);
            if (!relic) {
                this.ui.showMessage("Relikt nicht gefunden.", 1200);
                return;
            }
            if (!this.progression.relics.unlockedIds.includes(relic.id)) {
                this.progression.relics.unlockedIds.push(relic.id);
            }
            this.progression.relics.activeId = relic.id;
            const postText = this.pendingBossRelicReward.postText || "Boss besiegt.";
            this.pendingBossRelicReward = null;
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.ui.showMainMenu(`${postText} | Relikt erhalten: ${relic.name}`);
            this.ui.addLog(`Boss-Beute: ${relic.name} erhalten`, "player");
            this.ui.showMessage(`Neues Relikt: ${relic.name}`, 1700);
        }

        getCardBackById(id) {
            return CARD_BACK_REWARDS.find((entry) => entry.id === id) || null;
        }

        unlockCardBacksForLevel(level, announce = true) {
            let unlockedSomething = false;
            CARD_BACK_REWARDS.forEach((entry) => {
                if (level >= entry.minLevel && !this.progression.cardBacks.unlockedIds.includes(entry.id)) {
                    this.progression.cardBacks.unlockedIds.push(entry.id);
                    this.progression.cardBacks.activeId = entry.id;
                    unlockedSomething = true;
                    if (announce) {
                        this.ui.addLog(`Kartenruecken freigeschaltet: ${entry.title}`, "player");
                    }
                    if (announce && this.gameActive) {
                        this.ui.showMessage(`Neuer Kartenruecken: ${entry.title}`, 1600);
                    }
                }
            });
            return unlockedSomething;
        }

        createShopState(dateKey, weekKey) {
            return {
                dailyDateKey: dateKey,
                weeklyKey: weekKey,
                dailyOffers: this.createShopOffersFromSlots(DAILY_SHOP_SLOTS, dateKey, "daily"),
                weeklyOffers: this.createShopOffersFromSlots(WEEKLY_SHOP_SLOTS, weekKey, "weekly"),
                reroll: {
                    dateKey,
                    freeUsed: 0,
                    paidUsed: 0
                }
            };
        }

        normalizeShopState(input) {
            const today = this.getTodayKey();
            const weekKey = this.getWeekKey();
            if (!input || typeof input !== "object") {
                return this.createShopState(today, weekKey);
            }

            if (Array.isArray(input.offers)) {
                return {
                    dailyDateKey: typeof input.dateKey === "string" ? input.dateKey : today,
                    weeklyKey: weekKey,
                    dailyOffers: input.offers,
                    weeklyOffers: this.createShopOffersFromSlots(WEEKLY_SHOP_SLOTS, weekKey, "weekly"),
                    reroll: {
                        dateKey: today,
                        freeUsed: 0,
                        paidUsed: 0
                    }
                };
            }

            return {
                dailyDateKey: typeof input.dailyDateKey === "string" ? input.dailyDateKey : today,
                weeklyKey: typeof input.weeklyKey === "string" ? input.weeklyKey : weekKey,
                dailyOffers: Array.isArray(input.dailyOffers) ? input.dailyOffers : this.createShopOffersFromSlots(DAILY_SHOP_SLOTS, today, "daily"),
                weeklyOffers: Array.isArray(input.weeklyOffers) ? input.weeklyOffers : this.createShopOffersFromSlots(WEEKLY_SHOP_SLOTS, weekKey, "weekly"),
                reroll: input.reroll && typeof input.reroll === "object"
                    ? {
                        dateKey: typeof input.reroll.dateKey === "string" ? input.reroll.dateKey : today,
                        freeUsed: Math.max(0, Math.min(DAILY_FREE_REROLLS, Math.floor(input.reroll.freeUsed || 0))),
                        paidUsed: Math.max(0, Math.min(DAILY_MAX_PAID_REROLLS, Math.floor(input.reroll.paidUsed || 0)))
                    }
                    : { dateKey: today, freeUsed: 0, paidUsed: 0 }
            };
        }

        getDailyShopPoolByType(type) {
            if (type === "cosmetic") {
                return COSMETIC_REWARDS.map((entry) => ({ id: entry.id, itemType: "cosmetic" }));
            }
            if (type === "title") {
                return CAMPAIGN_TITLE_REWARDS.map((entry) => ({ id: entry.id, itemType: "title" }));
            }
            if (type === "card_back") {
                return CARD_BACK_REWARDS.map((entry) => ({ id: entry.id, itemType: "card_back" }));
            }
            if (type === "utility") {
                return SHOP_UTILITY_ITEMS.map((entry) => ({ id: entry.id, itemType: "utility" }));
            }
            if (type === "unlockable") {
                return [
                    ...COSMETIC_REWARDS.map((entry) => ({ id: entry.id, itemType: "cosmetic" })),
                    ...CAMPAIGN_TITLE_REWARDS.map((entry) => ({ id: entry.id, itemType: "title" })),
                    ...CARD_BACK_REWARDS.map((entry) => ({ id: entry.id, itemType: "card_back" }))
                ];
            }
            return [{ id: "unknown", itemType: "unknown" }];
        }

        getShopPriceForOffer(slot, offerType) {
            const currencyKey = slot.currency === "seals" ? "seals" : "marks";
            const rarityKey = slot.rarity || "rare";
            const rarityTable = SHOP_PRICE_BY_RARITY[currencyKey] || SHOP_PRICE_BY_RARITY.marks;
            let price = rarityTable[rarityKey] || rarityTable.rare || 100;
            if (offerType === "utility" && currencyKey === "marks") {
                price = Math.max(60, Math.floor(price * 0.75));
            }
            return Math.max(1, Math.floor(price));
        }

        createShopOffersFromSlots(slots, keySeed, scope) {
            const blockedByType = {};
            return slots.map((slot) => {
                const fullPool = this.getDailyShopPoolByType(slot.type);
                const blockedInRun = blockedByType[slot.type] || [];
                const candidatePool = fullPool.filter((entry) => !blockedInRun.includes(entry.id));
                const unownedPool = candidatePool.filter((entry) => !this.isShopOfferOwned({ type: entry.itemType, itemId: entry.id }));
                const pool = unownedPool.length > 0 ? unownedPool : (candidatePool.length > 0 ? candidatePool : fullPool);
                const chosen = this.chooseTemplateFromPool(pool, `${keySeed}:${scope}:${slot.id}`);
                blockedByType[slot.type] = [...blockedInRun, chosen.id];
                return {
                    id: `${keySeed}:${scope}:${slot.id}`,
                    slotId: slot.id,
                    type: slot.type,
                    itemType: chosen.itemType || slot.type,
                    itemId: chosen.id,
                    currency: slot.currency === "seals" ? "seals" : "marks",
                    rarity: slot.rarity || "rare",
                    price: this.getShopPriceForOffer(slot, chosen.itemType || slot.type),
                    purchased: false
                };
            });
        }

        getShopOfferDisplayData(offer) {
            const fallback = {
                title: "Unbekannt",
                description: "Nicht verfuegbar",
                typeLabel: "Shop"
            };
            if (!offer || typeof offer !== "object") {
                return fallback;
            }
            if (offer.type === "cosmetic") {
                const entry = this.getCosmeticById(offer.itemId);
                if (!entry) return fallback;
                return {
                    title: entry.title,
                    description: `Kosmetik-Stil fuer Menue und Kampfhintergrund.`,
                    typeLabel: "Kosmetik"
                };
            }
            if (offer.type === "title") {
                const entry = this.getCampaignTitleById(offer.itemId);
                if (!entry) return fallback;
                return {
                    title: entry.title,
                    description: "Spielertitel fuer Profil und Kampfanzeige.",
                    typeLabel: "Titel"
                };
            }
            if (offer.type === "card_back") {
                const entry = this.getCardBackById(offer.itemId);
                if (!entry) return fallback;
                return {
                    title: entry.title,
                    description: "Kartenruecken-Skin fuer Sammlung und spätere Deckansicht.",
                    typeLabel: "Kartenruecken"
                };
            }
            if (offer.type === "utility" || offer.itemType === "utility") {
                const utility = SHOP_UTILITY_ITEMS.find((entry) => entry.id === offer.itemId);
                if (!utility) return fallback;
                return {
                    title: utility.title,
                    description: utility.description,
                    typeLabel: "Utility"
                };
            }
            if (offer.type === "unlockable") {
                return this.getShopOfferDisplayData({
                    type: offer.itemType,
                    itemId: offer.itemId
                });
            }
            return fallback;
        }

        isShopOfferOwned(offer) {
            if (!offer || typeof offer !== "object") {
                return false;
            }
            if (offer.type === "cosmetic") {
                return this.progression.cosmetics.unlockedIds.includes(offer.itemId);
            }
            if (offer.type === "title") {
                return (this.campaignProgress?.titles?.unlockedIds || []).includes(offer.itemId);
            }
            if (offer.type === "card_back") {
                return this.progression.cardBacks.unlockedIds.includes(offer.itemId);
            }
            if (offer.type === "unlockable" && offer.itemType) {
                return this.isShopOfferOwned({ type: offer.itemType, itemId: offer.itemId });
            }
            return false;
        }

        buildDailyShopSnapshot() {
            this.ensureProgressionStateCurrent();
            const shop = this.progression.shop || this.createShopState(this.getTodayKey(), this.getWeekKey());
            const nextDailyReset = new Date();
            nextDailyReset.setHours(24, 0, 0, 0);
            const nextWeeklyReset = new Date();
            const day = nextWeeklyReset.getDay();
            const daysUntilMonday = (8 - (day === 0 ? 7 : day)) % 7 || 7;
            nextWeeklyReset.setDate(nextWeeklyReset.getDate() + daysUntilMonday);
            nextWeeklyReset.setHours(0, 0, 0, 0);
            const reroll = shop.reroll || { freeUsed: 0, paidUsed: 0 };
            const paidRerollCost = DAILY_BASE_REROLL_COST * (reroll.paidUsed + 1);
            const canUseFreeReroll = reroll.freeUsed < DAILY_FREE_REROLLS;
            const canUsePaidReroll = reroll.paidUsed < DAILY_MAX_PAID_REROLLS;
            const rerollAffordable = this.progression.currency >= paidRerollCost;
            const canReroll = canUseFreeReroll || (canUsePaidReroll && rerollAffordable);
            const relicUpgradeLevel = Math.max(0, Math.min(RELIC_UPGRADE_MAX_LEVEL, Math.floor(this.progression.relicUpgradeLevel || 0)));
            const canUpgradeRelic = relicUpgradeLevel < RELIC_UPGRADE_MAX_LEVEL
                && this.progression.currency >= RELIC_UPGRADE_MARK_COST
                && this.progression.relicDust >= RELIC_UPGRADE_DUST_COST;
            const mapOffersToSnapshot = (offers) => (offers || []).map((offer) => {
                const details = this.getShopOfferDisplayData(offer);
                const owned = this.isShopOfferOwned(offer);
                const purchased = Boolean(offer.purchased);
                const playerCurrency = offer.currency === "seals" ? this.progression.bossCurrency : this.progression.currency;
                const affordable = playerCurrency >= (offer.price || 0);
                const buyDisabled = purchased || owned || !affordable;
                let buyLabel = "Kaufen";
                if (purchased) buyLabel = "Gekauft";
                else if (owned) buyLabel = "Besitzt du";
                else if (!affordable) buyLabel = "Zu teuer";
                return {
                    id: offer.id,
                    title: details.title,
                    description: details.description,
                    typeLabel: details.typeLabel,
                    price: Math.max(0, Math.floor(offer.price || 0)),
                    currency: offer.currency || "marks",
                    currencyLabel: offer.currency === "seals" ? SHOP_BOSS_CURRENCY_NAME : SHOP_CURRENCY_NAME,
                    owned,
                    buyDisabled,
                    buyLabel
                };
            });
            return {
                currency: Math.max(0, Math.floor(this.progression.currency || 0)),
                bossCurrency: Math.max(0, Math.floor(this.progression.bossCurrency || 0)),
                relicDust: Math.max(0, Math.floor(this.progression.relicDust || 0)),
                nextResetText: `${nextDailyReset.toLocaleString("de-DE")} (${this.getCountdownText(nextDailyReset)})`,
                weeklyResetText: `${nextWeeklyReset.toLocaleString("de-DE")} (${this.getCountdownText(nextWeeklyReset)})`,
                offers: mapOffersToSnapshot(shop.dailyOffers),
                weeklyOffers: mapOffersToSnapshot(shop.weeklyOffers),
                reroll: {
                    freeLeft: Math.max(0, DAILY_FREE_REROLLS - reroll.freeUsed),
                    paidUsed: reroll.paidUsed,
                    paidMax: DAILY_MAX_PAID_REROLLS,
                    paidCost: paidRerollCost,
                    label: canUseFreeReroll
                        ? `Daily neu rollen (kostenlos ${Math.max(0, DAILY_FREE_REROLLS - reroll.freeUsed)}x)`
                        : `Daily neu rollen (${paidRerollCost} ${SHOP_CURRENCY_NAME})`,
                    disabled: !canReroll
                },
                relicUpgrade: {
                    level: relicUpgradeLevel,
                    maxLevel: RELIC_UPGRADE_MAX_LEVEL,
                    markCost: RELIC_UPGRADE_MARK_COST,
                    dustCost: RELIC_UPGRADE_DUST_COST,
                    disabled: !canUpgradeRelic
                }
            };
        }

        getCountdownText(targetDate) {
            const diff = Math.max(0, targetDate.getTime() - Date.now());
            const totalMinutes = Math.floor(diff / 60000);
            const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
            const minutes = String(totalMinutes % 60).padStart(2, "0");
            return `${hours}:${minutes}h`;
        }

        openDailyShopMenu() {
            this.ensureProgressionStateCurrent();
            this.ui.showMenuShop(this.buildDailyShopSnapshot());
        }

        rerollDailyShopFromMenu() {
            this.ensureProgressionStateCurrent();
            const shop = this.progression.shop;
            if (!shop || !shop.reroll) {
                return;
            }
            const reroll = shop.reroll;
            let paidCost = 0;
            if (reroll.freeUsed < DAILY_FREE_REROLLS) {
                reroll.freeUsed += 1;
            } else {
                if (reroll.paidUsed >= DAILY_MAX_PAID_REROLLS) {
                    this.ui.showMessage("Keine Daily-Rerolls mehr verfuegbar.", 1200);
                    return;
                }
                paidCost = DAILY_BASE_REROLL_COST * (reroll.paidUsed + 1);
                if (this.progression.currency < paidCost) {
                    this.ui.showMessage(`Zu wenig ${SHOP_CURRENCY_NAME}.`, 1200);
                    return;
                }
                this.progression.currency -= paidCost;
                reroll.paidUsed += 1;
            }
            shop.dailyOffers = this.createShopOffersFromSlots(DAILY_SHOP_SLOTS, `${this.getTodayKey()}:${reroll.freeUsed}:${reroll.paidUsed}`, "daily");
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.ui.showMenuShop(this.buildDailyShopSnapshot());
            const costText = paidCost > 0 ? ` (-${paidCost} ${SHOP_CURRENCY_NAME})` : " (kostenlos)";
            this.ui.showMessage(`Daily-Angebote neu gerollt${costText}`, 1400);
        }

        purchaseDailyShopOfferFromMenu(offerId, scope = "daily") {
            this.ensureProgressionStateCurrent();
            const offerList = scope === "weekly"
                ? this.progression.shop?.weeklyOffers
                : this.progression.shop?.dailyOffers;
            if (!offerId || !Array.isArray(offerList)) {
                return;
            }
            const offer = offerList.find((entry) => entry.id === offerId);
            if (!offer) {
                this.ui.showMessage("Angebot nicht gefunden.", 1200);
                return;
            }
            if (offer.purchased) {
                this.ui.showMessage("Angebot bereits gekauft.", 1200);
                return;
            }
            if (this.isShopOfferOwned(offer)) {
                this.ui.showMessage("Item bereits freigeschaltet.", 1200);
                offer.purchased = true;
                this.savePersistentProgression();
                this.ui.showMenuShop(this.buildDailyShopSnapshot());
                return;
            }
            const price = Math.max(0, Math.floor(offer.price || 0));
            const currencyKey = offer.currency === "seals" ? "bossCurrency" : "currency";
            const currencyName = offer.currency === "seals" ? SHOP_BOSS_CURRENCY_NAME : SHOP_CURRENCY_NAME;
            if ((this.progression[currencyKey] || 0) < price) {
                this.ui.showMessage(`Zu wenig ${currencyName}.`, 1200);
                return;
            }
            const details = this.getShopOfferDisplayData(offer);
            const confirmText = `Kaufen: ${details.title}\nKosten: ${price} ${currencyName}\n\nFortfahren?`;
            if (!window.confirm(confirmText)) {
                return;
            }

            this.progression[currencyKey] = Math.max(0, Math.floor((this.progression[currencyKey] || 0) - price));
            offer.purchased = true;
            const logParts = [`-${price} ${currencyName}`];
            const resolvedType = offer.type === "unlockable" ? offer.itemType : offer.type;
            if (resolvedType === "cosmetic" && this.getCosmeticById(offer.itemId)) {
                this.progression.cosmetics.unlockedIds.push(offer.itemId);
                this.progression.cosmetics.activeId = offer.itemId;
                logParts.push(`Kosmetik: ${this.getCosmeticById(offer.itemId).title}`);
            } else if (resolvedType === "title" && this.getCampaignTitleById(offer.itemId)) {
                if (!this.campaignProgress.titles || !Array.isArray(this.campaignProgress.titles.unlockedIds)) {
                    this.campaignProgress.titles = { unlockedIds: ["title_wanderer"], activeId: "title_wanderer" };
                }
                if (!this.campaignProgress.titles.unlockedIds.includes(offer.itemId)) {
                    this.campaignProgress.titles.unlockedIds.push(offer.itemId);
                }
                this.campaignProgress.titles.activeId = offer.itemId;
                logParts.push(`Titel: ${this.getCampaignTitleById(offer.itemId).title}`);
            } else if (resolvedType === "card_back" && this.getCardBackById(offer.itemId)) {
                this.progression.cardBacks.unlockedIds.push(offer.itemId);
                this.progression.cardBacks.activeId = offer.itemId;
                logParts.push(`Kartenruecken: ${this.getCardBackById(offer.itemId).title}`);
            } else if (resolvedType === "utility") {
                const utility = SHOP_UTILITY_ITEMS.find((entry) => entry.id === offer.itemId);
                if (utility?.grant) {
                    const relicDustGain = Math.max(0, Math.floor(utility.grant.relicDust || 0));
                    const manaBoostGain = Math.max(0, Math.floor(utility.grant.boosterStartMana || 0));
                    const hpBoostGain = Math.max(0, Math.floor(utility.grant.boosterMaxHp || 0));
                    if (relicDustGain > 0) {
                        this.progression.relicDust += relicDustGain;
                        logParts.push(`Reliktstaub +${relicDustGain}`);
                    }
                    if (manaBoostGain > 0) {
                        this.progression.pendingBoosters.startMana += manaBoostGain;
                        logParts.push(`Booster +${manaBoostGain} Start-Mana`);
                    }
                    if (hpBoostGain > 0) {
                        this.progression.pendingBoosters.maxHp += hpBoostGain;
                        logParts.push(`Booster +${hpBoostGain} Max-HP`);
                    }
                }
            }

            this.savePersistentProgression();
            this.savePersistentCampaign();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.ui.showMenuShop(this.buildDailyShopSnapshot());
            this.ui.showMessage(`Gekauft: ${logParts.slice(1).join(" | ") || "Item"}`, 1600);
            this.ui.addLog(`Shopkauf: ${logParts.join(" | ")}`, "player");
            this.render();
        }

        upgradeRelicFromShopMenu() {
            this.ensureProgressionStateCurrent();
            const currentLevel = Math.max(0, Math.min(RELIC_UPGRADE_MAX_LEVEL, Math.floor(this.progression.relicUpgradeLevel || 0)));
            if (currentLevel >= RELIC_UPGRADE_MAX_LEVEL) {
                this.ui.showMessage("Relikt ist bereits auf Max-Stufe.", 1200);
                return;
            }
            if (this.progression.currency < RELIC_UPGRADE_MARK_COST || this.progression.relicDust < RELIC_UPGRADE_DUST_COST) {
                this.ui.showMessage("Nicht genug Ressourcen fuer Upgrade.", 1200);
                return;
            }
            this.progression.currency -= RELIC_UPGRADE_MARK_COST;
            this.progression.relicDust -= RELIC_UPGRADE_DUST_COST;
            this.progression.relicUpgradeLevel = currentLevel + 1;
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.ui.showMenuShop(this.buildDailyShopSnapshot());
            this.ui.showMessage(`Relikt-Upgrade Stufe ${this.progression.relicUpgradeLevel}`, 1500);
            this.ui.addLog(`Relikt verbessert: Stufe ${this.progression.relicUpgradeLevel}`, "player");
        }

        grantCurrencyForMatch(outcome) {
            if (outcome !== "win" && outcome !== "loss") {
                return;
            }
            const winByDifficulty = { easy: 14, medium: 20, hard: 28 };
            const winAmount = winByDifficulty[this.difficulty] || winByDifficulty.medium;
            const baseAmount = outcome === "win" ? winAmount : Math.max(6, Math.floor(winAmount * 0.45));
            const campaignBonus = this.campaignProgress.activeRun ? 6 : 0;
            const total = baseAmount + campaignBonus;
            this.progression.currency = Math.max(0, Math.floor((this.progression.currency || 0) + total));
            this.ui.addLog(`Belohnung: +${total} ${SHOP_CURRENCY_NAME}`, "player");
        }

        cycleActiveCosmetic(direction) {
            const unlockedIds = this.progression.cosmetics.unlockedIds;
            if (!Array.isArray(unlockedIds) || unlockedIds.length <= 1) {
                return;
            }
            const currentIndex = Math.max(0, unlockedIds.indexOf(this.progression.cosmetics.activeId));
            const nextIndex = (currentIndex + direction + unlockedIds.length) % unlockedIds.length;
            this.progression.cosmetics.activeId = unlockedIds[nextIndex];
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
        }

        cycleActiveRelic(direction) {
            const unlockedIds = this.progression.relics.unlockedIds;
            if (!Array.isArray(unlockedIds) || unlockedIds.length <= 1) {
                return;
            }
            const currentIndex = Math.max(0, unlockedIds.indexOf(this.progression.relics.activeId));
            const nextIndex = (currentIndex + direction + unlockedIds.length) % unlockedIds.length;
            this.progression.relics.activeId = unlockedIds[nextIndex];
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
        }

        cycleActiveCardBack(direction) {
            const unlockedIds = this.progression.cardBacks.unlockedIds;
            if (!Array.isArray(unlockedIds) || unlockedIds.length <= 1) {
                return;
            }
            const currentIndex = Math.max(0, unlockedIds.indexOf(this.progression.cardBacks.activeId));
            const nextIndex = (currentIndex + direction + unlockedIds.length) % unlockedIds.length;
            this.progression.cardBacks.activeId = unlockedIds[nextIndex];
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.render();
        }

        cycleActiveCampaignTitle(direction) {
            const titles = this.campaignProgress?.titles;
            const unlockedIds = titles?.unlockedIds;
            if (!Array.isArray(unlockedIds) || unlockedIds.length <= 1) {
                return;
            }
            const currentIndex = Math.max(0, unlockedIds.indexOf(titles.activeId));
            const nextIndex = (currentIndex + direction + unlockedIds.length) % unlockedIds.length;
            titles.activeId = unlockedIds[nextIndex];
            this.savePersistentCampaign();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.render();
        }

        unlockCosmeticsForLevel(level, announce = true) {
            let unlockedSomething = false;
            COSMETIC_REWARDS.forEach((reward) => {
                if (level >= reward.minLevel && !this.progression.cosmetics.unlockedIds.includes(reward.id)) {
                    this.progression.cosmetics.unlockedIds.push(reward.id);
                    this.progression.cosmetics.activeId = reward.id;
                    unlockedSomething = true;
                    if (announce) {
                        this.ui.addLog(`Kosmetik freigeschaltet: ${reward.title}`, "player");
                    }
                    if (announce && this.gameActive) {
                        this.ui.showMessage(`Neue Kosmetik: ${reward.title}`, 1600);
                    }
                }
            });
            return unlockedSomething;
        }

        unlockRelicsForLevel(level, announce = true) {
            let unlockedSomething = false;
            MATCH_RELIC_POOL.forEach((relic) => {
                if (level >= relic.minLevel && !this.progression.relics.unlockedIds.includes(relic.id)) {
                    this.progression.relics.unlockedIds.push(relic.id);
                    this.progression.relics.activeId = relic.id;
                    unlockedSomething = true;
                    if (announce) {
                        this.ui.addLog(`Relikt freigeschaltet: ${relic.name}`, "player");
                    }
                    if (announce && this.gameActive) {
                        this.ui.showMessage(`Neues Relikt: ${relic.name}`, 1600);
                    }
                }
            });
            return unlockedSomething;
        }

        loadPersistentProgression() {
            try {
                const raw = window.localStorage.getItem(this.progressionStorageKey);
                if (!raw) {
                    return;
                }

                const parsed = JSON.parse(raw);
                const xp = Number.isFinite(parsed?.xp) ? Math.max(0, Math.floor(parsed.xp)) : 0;
                const currency = Number.isFinite(parsed?.currency) ? Math.max(0, Math.floor(parsed.currency)) : 0;
                const bossCurrency = Number.isFinite(parsed?.bossCurrency) ? Math.max(0, Math.floor(parsed.bossCurrency)) : 0;
                const relicDust = Number.isFinite(parsed?.relicDust) ? Math.max(0, Math.floor(parsed.relicDust)) : 0;
                const dailyDate = typeof parsed?.daily?.dateKey === "string" ? parsed.daily.dateKey : this.getTodayKey();
                const weeklyDate = typeof parsed?.weekly?.weekKey === "string" ? parsed.weekly.weekKey : this.getWeekKey();

                this.progression = {
                    xp,
                    level: this.calculateLevelFromXp(xp),
                    currency,
                    bossCurrency,
                    relicDust,
                    relicUpgradeLevel: Number.isFinite(parsed?.relicUpgradeLevel) ? Math.max(0, Math.min(RELIC_UPGRADE_MAX_LEVEL, Math.floor(parsed.relicUpgradeLevel))) : 0,
                    pendingBoosters: {
                        startMana: Number.isFinite(parsed?.pendingBoosters?.startMana) ? Math.max(0, Math.floor(parsed.pendingBoosters.startMana)) : 0,
                        maxHp: Number.isFinite(parsed?.pendingBoosters?.maxHp) ? Math.max(0, Math.floor(parsed.pendingBoosters.maxHp)) : 0
                    },
                    daily: this.normalizeQuest(parsed?.daily, DAILY_QUEST_POOL, { dateKey: dailyDate }),
                    challenge: this.normalizeQuest(parsed?.challenge, CHALLENGE_POOL),
                    weekly: this.normalizeQuest(parsed?.weekly, WEEKLY_QUEST_POOL, { weekKey: weeklyDate }),
                    shop: this.normalizeShopState(parsed?.shop),
                    achievements: this.normalizeAchievements(parsed?.achievements),
                    cosmetics: {
                        unlockedIds: Array.isArray(parsed?.cosmetics?.unlockedIds) && parsed.cosmetics.unlockedIds.length > 0
                            ? parsed.cosmetics.unlockedIds.filter((id) => this.getCosmeticById(id))
                            : ["initiand"],
                        activeId: typeof parsed?.cosmetics?.activeId === "string" && this.getCosmeticById(parsed.cosmetics.activeId)
                            ? parsed.cosmetics.activeId
                            : "initiand"
                    },
                    cardBacks: {
                        unlockedIds: Array.isArray(parsed?.cardBacks?.unlockedIds) && parsed.cardBacks.unlockedIds.length > 0
                            ? parsed.cardBacks.unlockedIds.filter((id) => this.getCardBackById(id))
                            : ["back_initiand"],
                        activeId: typeof parsed?.cardBacks?.activeId === "string" && this.getCardBackById(parsed.cardBacks.activeId)
                            ? parsed.cardBacks.activeId
                            : "back_initiand"
                    },
                    relics: {
                        unlockedIds: Array.isArray(parsed?.relics?.unlockedIds) && parsed.relics.unlockedIds.length > 0
                            ? parsed.relics.unlockedIds.filter((id) => this.getRelicById(id))
                            : ["relic_blade"],
                        activeId: typeof parsed?.relics?.activeId === "string" && this.getRelicById(parsed.relics.activeId)
                            ? parsed.relics.activeId
                            : "relic_blade"
                    }
                };
                this.unlockCosmeticsForLevel(this.progression.level, false);
                this.unlockRelicsForLevel(this.progression.level, false);
                if (!this.progression.cosmetics.unlockedIds.includes(this.progression.cosmetics.activeId)) {
                    this.progression.cosmetics.activeId = this.progression.cosmetics.unlockedIds[this.progression.cosmetics.unlockedIds.length - 1];
                }
                if (!this.progression.relics.unlockedIds.includes(this.progression.relics.activeId)) {
                    this.progression.relics.activeId = this.progression.relics.unlockedIds[this.progression.relics.unlockedIds.length - 1];
                }
                if (!this.progression.cardBacks.unlockedIds.includes(this.progression.cardBacks.activeId)) {
                    this.progression.cardBacks.activeId = this.progression.cardBacks.unlockedIds[this.progression.cardBacks.unlockedIds.length - 1];
                }
            } catch (error) {
                this.progression = {
                    xp: 0,
                    level: 1,
                    currency: 0,
                    bossCurrency: 0,
                    relicDust: 0,
                    relicUpgradeLevel: 0,
                    pendingBoosters: {
                        startMana: 0,
                        maxHp: 0
                    },
                    daily: null,
                    challenge: null,
                    weekly: null,
                    shop: null,
                    achievements: this.normalizeAchievements([]),
                    cosmetics: {
                        unlockedIds: ["initiand"],
                        activeId: "initiand"
                    },
                    cardBacks: {
                        unlockedIds: ["back_initiand"],
                        activeId: "back_initiand"
                    },
                    relics: {
                        unlockedIds: ["relic_blade"],
                        activeId: "relic_blade"
                    }
                };
            }
        }

        loadPersistentCampaign() {
            try {
                const raw = window.localStorage.getItem(this.campaignStorageKey);
                if (!raw) {
                    this.updateCampaignTitlesFromProgress(false);
                    return;
                }
                const parsed = JSON.parse(raw);
                const defaults = this.createDefaultCampaignProgress();
                const selectedRegionId = this.getCampaignRegionById(parsed?.selectedRegionId).id;
                const clearedByRegion = { ...defaults.clearedByRegion };
                CAMPAIGN_REGIONS.forEach((region) => {
                    const value = parsed?.clearedByRegion?.[region.id];
                    const maxValue = region.nodes.length;
                    clearedByRegion[region.id] = Number.isFinite(value)
                        ? Math.max(0, Math.min(maxValue, Math.floor(value)))
                        : 0;
                });

                let activeRun = null;
                if (parsed?.activeRun && typeof parsed.activeRun === "object") {
                    const region = this.getCampaignRegionById(parsed.activeRun.regionId);
                    const nodeIndex = Number.isFinite(parsed.activeRun.nodeIndex)
                        ? Math.max(0, Math.min(region.nodes.length - 1, Math.floor(parsed.activeRun.nodeIndex)))
                        : 0;
                    activeRun = this.createCampaignRunState(region.id, nodeIndex, parsed.activeRun);
                }

                const unlockedTitleIds = Array.isArray(parsed?.titles?.unlockedIds) && parsed.titles.unlockedIds.length > 0
                    ? parsed.titles.unlockedIds.filter((id) => this.getCampaignTitleById(id))
                    : ["title_wanderer"];
                const activeTitleId = typeof parsed?.titles?.activeId === "string" && this.getCampaignTitleById(parsed.titles.activeId)
                    ? parsed.titles.activeId
                    : unlockedTitleIds[unlockedTitleIds.length - 1];

                this.campaignProgress = {
                    selectedRegionId,
                    clearedByRegion,
                    titles: {
                        unlockedIds: unlockedTitleIds,
                        activeId: activeTitleId
                    },
                    activeRun
                };
                this.updateCampaignTitlesFromProgress(false);
            } catch (error) {
                this.campaignProgress = this.createDefaultCampaignProgress();
                this.updateCampaignTitlesFromProgress(false);
            }
        }

        savePersistentCampaign() {
            try {
                window.localStorage.setItem(this.campaignStorageKey, JSON.stringify(this.campaignProgress));
            } catch (error) {
                // Ignore storage write issues (private mode / blocked storage).
            }
        }

        loadAudioSettings() {
            try {
                const raw = window.localStorage.getItem(this.audioSettingsStorageKey);
                if (!raw) {
                    this.ui.setCombatSpeedMultiplier(this.getCombatSpeedMultiplier());
                    this.accessibilitySettings = this.normalizeAccessibilitySettings(this.accessibilitySettings);
                    this.ui.applyAccessibilitySettings(this.accessibilitySettings);
                    return;
                }
                const parsed = JSON.parse(raw);
                this.sound.applySettings({
                    volume: Number.isFinite(parsed?.volume) ? parsed.volume : 1,
                    muted: Boolean(parsed?.muted),
                    channels: {
                        ui: Number.isFinite(parsed?.channels?.ui) ? parsed.channels.ui : 1,
                        combat: Number.isFinite(parsed?.channels?.combat) ? parsed.channels.combat : 1,
                        events: Number.isFinite(parsed?.channels?.events) ? parsed.channels.events : 1
                    }
                });
                const parsedSpeed = typeof parsed?.combatSpeed === "string" && COMBAT_SPEED_OPTIONS[parsed.combatSpeed]
                    ? parsed.combatSpeed
                    : "normal";
                this.combatSpeed = parsedSpeed;
                this.synergyEnabled = parsed?.synergyEnabled !== false;
                this.accessibilitySettings = this.normalizeAccessibilitySettings(parsed?.accessibility);
                this.ui.setCombatSpeedMultiplier(this.getCombatSpeedMultiplier());
                this.ui.applyAccessibilitySettings(this.accessibilitySettings);
            } catch (error) {
                // Ignore invalid/blocked storage data and keep defaults.
                this.combatSpeed = "normal";
                this.synergyEnabled = true;
                this.accessibilitySettings = this.normalizeAccessibilitySettings(this.accessibilitySettings);
                this.ui.setCombatSpeedMultiplier(this.getCombatSpeedMultiplier());
                this.ui.applyAccessibilitySettings(this.accessibilitySettings);
            }
        }

        saveAudioSettings() {
            try {
                const sound = this.sound.getSettings();
                window.localStorage.setItem(this.audioSettingsStorageKey, JSON.stringify({
                    volume: sound.volume,
                    muted: sound.muted,
                    channels: {
                        ui: sound.channels?.ui ?? 1,
                        combat: sound.channels?.combat ?? 1,
                        events: sound.channels?.events ?? 1
                    },
                    combatSpeed: this.combatSpeed,
                    synergyEnabled: this.synergyEnabled,
                    accessibility: this.normalizeAccessibilitySettings(this.accessibilitySettings)
                }));
            } catch (error) {
                // Ignore storage write issues (private mode / blocked storage).
            }
        }

        openSoundSettingsMenu() {
            this.ui.showMenuSettings(this.getMenuSettingsSnapshot());
        }

        setSoundVolumeFromMenu(volumePercent) {
            const parsed = Number(volumePercent);
            if (!Number.isFinite(parsed)) {
                return;
            }
            const normalized = Math.max(0, Math.min(100, parsed)) / 100;
            this.sound.setVolume(normalized);
            this.saveAudioSettings();
            this.ui.setMenuSoundSettings(this.getMenuSettingsSnapshot());
        }

        setSoundChannelVolumeFromMenu(channel, volumePercent) {
            const parsed = Number(volumePercent);
            if (!Number.isFinite(parsed)) {
                return;
            }
            const normalized = Math.max(0, Math.min(100, parsed)) / 100;
            this.sound.setChannelVolume(channel, normalized);
            this.saveAudioSettings();
            this.ui.setMenuSoundSettings(this.getMenuSettingsSnapshot());
        }

        setSoundMuteFromMenu(muted) {
            this.sound.setMuted(Boolean(muted));
            this.saveAudioSettings();
            this.ui.setMenuSoundSettings(this.getMenuSettingsSnapshot());
        }

        setCombatSpeedFromMenu(speedId) {
            const normalizedSpeed = typeof speedId === "string" && COMBAT_SPEED_OPTIONS[speedId]
                ? speedId
                : "normal";
            this.combatSpeed = normalizedSpeed;
            this.ui.setCombatSpeedMultiplier(this.getCombatSpeedMultiplier());
            this.saveAudioSettings();
            this.ui.setMenuSoundSettings(this.getMenuSettingsSnapshot());
        }

        setCombatSynergyEnabledFromMenu(enabled) {
            this.synergyEnabled = Boolean(enabled);
            this.saveAudioSettings();
            this.ui.setMenuSoundSettings(this.getMenuSettingsSnapshot());
        }

        setAccessibilityFontScaleFromMenu(fontScale) {
            const normalized = typeof fontScale === "string" && ["normal", "large", "xlarge"].includes(fontScale)
                ? fontScale
                : "normal";
            this.accessibilitySettings = this.normalizeAccessibilitySettings({
                ...this.accessibilitySettings,
                fontScale: normalized
            });
            this.ui.applyAccessibilitySettings(this.accessibilitySettings);
            this.saveAudioSettings();
            this.ui.setMenuAccessibilitySettings(this.getMenuSettingsSnapshot());
        }

        setAccessibilityColorBlindFromMenu(enabled) {
            this.accessibilitySettings = this.normalizeAccessibilitySettings({
                ...this.accessibilitySettings,
                colorBlind: Boolean(enabled)
            });
            this.ui.applyAccessibilitySettings(this.accessibilitySettings);
            this.saveAudioSettings();
            this.ui.setMenuAccessibilitySettings(this.getMenuSettingsSnapshot());
        }

        setAccessibilityReducedMotionFromMenu(enabled) {
            this.accessibilitySettings = this.normalizeAccessibilitySettings({
                ...this.accessibilitySettings,
                reducedMotion: Boolean(enabled)
            });
            this.ui.applyAccessibilitySettings(this.accessibilitySettings);
            this.saveAudioSettings();
            this.ui.setMenuAccessibilitySettings(this.getMenuSettingsSnapshot());
        }

        testSoundFromMenu() {
            if (this.sound.getSettings().muted) {
                this.ui.showMessage("Sound ist stumm geschaltet.", 1200);
                return;
            }
            this.sound.play("uiClick");
            window.setTimeout(() => this.sound.play("turnToPlayer"), 100);
        }

        openCampaignMenu() {
            this.ui.showMenuCampaign(this.getCampaignMenuSnapshot());
        }

        setCampaignRegion(regionId) {
            this.campaignProgress.selectedRegionId = this.getCampaignRegionById(regionId).id;
            this.savePersistentCampaign();
            this.ui.showMenuCampaign(this.getCampaignMenuSnapshot());
            this.ui.setMenuCampaignStatus(this.getCampaignStatusText());
        }

        startCampaignFromMenu() {
            const region = this.getCampaignRegionById(this.campaignProgress.selectedRegionId);
            const activeRun = this.campaignProgress.activeRun;
            const clearedCount = this.campaignProgress.clearedByRegion[region.id] || 0;
            const nodeIndex = activeRun && activeRun.regionId === region.id
                ? activeRun.nodeIndex
                : (clearedCount >= region.nodes.length ? 0 : clearedCount);

            this.campaignProgress.activeRun = this.createCampaignRunState(
                region.id,
                nodeIndex,
                activeRun && activeRun.regionId === region.id ? activeRun : null
            );
            this.savePersistentCampaign();
            this.startCurrentCampaignNode();
        }

        getCurrentCampaignNode() {
            const run = this.campaignProgress.activeRun;
            if (!run) {
                return null;
            }
            const region = this.getCampaignRegionById(run.regionId);
            const node = region.nodes[run.nodeIndex];
            if (!node) {
                return null;
            }
            return { region, node };
        }

        resolveCampaignUtilityNode(current) {
            const run = this.campaignProgress.activeRun;
            if (!run || !current?.node || !current?.region) {
                return { finished: true, message: "Kampagnenlauf nicht verfuegbar." };
            }
            const nodeType = this.getCampaignNodeType(current.node);
            const nodeTitle = this.getCampaignNodeTitle(current.node);
            const nodeTypeLabel = this.getCampaignNodeTypeLabel(nodeType);
            const rewardSummary = this.applyCampaignNodeRewards(current.node);

            const currentCleared = this.campaignProgress.clearedByRegion[current.region.id] || 0;
            this.campaignProgress.clearedByRegion[current.region.id] = Math.max(currentCleared, run.nodeIndex + 1);

            if (run.nodeIndex + 1 < current.region.nodes.length) {
                run.nodeIndex += 1;
                this.updateCampaignTitlesFromProgress(false);
                this.savePersistentCampaign();
                const message = rewardSummary
                    ? `${nodeTypeLabel}: ${nodeTitle} abgeschlossen. ${rewardSummary}`
                    : `${nodeTypeLabel}: ${nodeTitle} abgeschlossen.`;
                return { finished: false, message };
            }

            this.campaignProgress.activeRun = null;
            this.activeCampaignNode = null;
            this.updateCampaignTitlesFromProgress(true);
            this.savePersistentCampaign();
            const completionText = rewardSummary
                ? `Region abgeschlossen: ${current.region.name}. ${rewardSummary}`
                : `Region abgeschlossen: ${current.region.name}`;
            return { finished: true, message: completionText };
        }

        startCurrentCampaignNode() {
            let current = this.getCurrentCampaignNode();
            let guard = 0;
            while (current && !this.isCampaignCombatNode(current.node) && guard < 12) {
                const resolved = this.resolveCampaignUtilityNode(current);
                this.ui.showMessage(resolved.message, 1800);
                if (resolved.finished) {
                    this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
                    this.ui.setMenuCampaignStatus(this.getCampaignStatusText());
                    this.ui.showMainMenu(resolved.message);
                    return;
                }
                guard += 1;
                current = this.getCurrentCampaignNode();
            }

            if (!current) {
                this.ui.showMainMenu("Kampagne: Kein gueltiger Knoten gefunden.");
                return;
            }

            this.activeCampaignNode = current.node;
            this.activeAiPersonalityId = current.node.personalityId || "balanced";
            this.activeAiArchetypeId = current.node.archetypeId || "balanced";
            this.difficulty = current.node.difficulty;
            this.aiDeck = new Deck(this.buildAiDeckCards(this.difficulty, this.getCurrentAiArchetypeId()));
            this.ui.syncDifficulty(this.difficulty);
            this.gameActive = true;
            this.isPaused = false;
            this.ui.hideMainMenu();
            this.ui.hidePauseMenu();
            this.reset(`Kampagne: ${current.region.name} - ${current.node.enemyName} (${this.campaignProgress.activeRun.nodeIndex + 1}/${current.region.nodes.length})`);
            this.ui.setMenuCampaignStatus(this.getCampaignStatusText());
        }

        savePersistentProgression() {
            try {
                window.localStorage.setItem(this.progressionStorageKey, JSON.stringify(this.progression));
            } catch (error) {
                // Ignore storage write issues (private mode / blocked storage).
            }
        }

        grantQuestReward(quest, label) {
            const oldLevel = this.progression.level;
            this.progression.xp += quest.rewardXp;
            this.progression.level = this.calculateLevelFromXp(this.progression.xp);
            this.ui.addLog(`${label} erledigt (+${quest.rewardXp} XP)`, "player");
            if (this.progression.level > oldLevel) {
                this.unlockCosmeticsForLevel(this.progression.level);
                this.unlockRelicsForLevel(this.progression.level);
            }
            if (this.gameActive) {
                this.ui.showMessage(`${label} erledigt`, 1400);
            }
        }

        grantAchievementReward(achievement) {
            const oldLevel = this.progression.level;
            this.progression.xp += achievement.rewardXp;
            this.progression.level = this.calculateLevelFromXp(this.progression.xp);
            this.ui.addLog(`Achievement erledigt: ${achievement.title} (+${achievement.rewardXp} XP)`, "player");
            if (this.progression.level > oldLevel) {
                this.unlockCosmeticsForLevel(this.progression.level);
                this.unlockRelicsForLevel(this.progression.level);
            }
            if (this.gameActive) {
                this.ui.showMessage(`Achievement: ${achievement.title}`, 1500);
            }
        }

        trackAchievementProgress(metric, amount = 1) {
            if (!Array.isArray(this.progression.achievements)) {
                return false;
            }
            let changed = false;
            this.progression.achievements.forEach((entry) => {
                if (entry.metric !== metric || entry.completed) {
                    return;
                }
                entry.progress = Math.min(entry.target, entry.progress + amount);
                changed = true;
                while (entry.progress >= entry.target) {
                    if (entry.tier >= MAX_ACHIEVEMENT_TIER) {
                        entry.progress = entry.target;
                        entry.completed = true;
                        break;
                    }
                    this.grantAchievementReward(entry);
                    const nextTier = Math.max(1, (entry.tier || 1) + 1);
                    const nextTarget = this.calculateAchievementTarget(entry.baseTarget || entry.target, nextTier);
                    const nextReward = this.calculateAchievementReward(entry.baseRewardXp || entry.rewardXp, nextTier);
                    entry.tier = nextTier;
                    entry.title = `${entry.baseTitle || entry.title} ${nextTier}`;
                    entry.description = this.buildAchievementDescription(entry.metric, nextTarget, nextTier);
                    entry.target = nextTarget;
                    entry.rewardXp = nextReward;
                    entry.completed = nextTier >= MAX_ACHIEVEMENT_TIER && entry.progress >= nextTarget;
                }
            });
            return changed;
        }

        trackProgress(metric, amount = 1) {
            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }

            this.ensureProgressionStateCurrent();
            const daily = this.progression.daily;
            const challenge = this.progression.challenge;
            const weekly = this.progression.weekly;
            let changed = false;

            if (daily && !daily.completed && daily.metric === metric) {
                daily.progress = Math.min(daily.target, daily.progress + amount);
                if (daily.progress >= daily.target) {
                    daily.completed = true;
                    this.grantQuestReward(daily, "Tagesquest");
                }
                changed = true;
            }

            if (challenge && !challenge.completed && challenge.metric === metric) {
                challenge.progress = Math.min(challenge.target, challenge.progress + amount);
                if (challenge.progress >= challenge.target) {
                    challenge.completed = true;
                    this.grantQuestReward(challenge, "Challenge");
                    const nextTemplate = this.randomChallengeTemplate(challenge.id);
                    this.progression.challenge = this.createQuestState(nextTemplate);
                }
                changed = true;
            }

            if (weekly && !weekly.completed && weekly.metric === metric) {
                weekly.progress = Math.min(weekly.target, weekly.progress + amount);
                if (weekly.progress >= weekly.target) {
                    weekly.completed = true;
                    this.grantQuestReward(weekly, "Wochenquest");
                }
                changed = true;
            }

            if (this.trackAchievementProgress(metric, amount)) {
                changed = true;
            }

            if (changed) {
                this.savePersistentProgression();
                this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            }
        }

        loadPersistentStats() {
            try {
                const raw = window.localStorage.getItem(this.statsStorageKey);
                if (!raw) {
                    return;
                }
                const parsed = JSON.parse(raw);

                if (parsed?.byDifficulty && typeof parsed.byDifficulty === "object") {
                    this.recordByDifficulty = {
                        easy: this.sanitizeDifficultyRecord(parsed.byDifficulty.easy),
                        medium: this.sanitizeDifficultyRecord(parsed.byDifficulty.medium),
                        hard: this.sanitizeDifficultyRecord(parsed.byDifficulty.hard)
                    };
                    this.cardUsageStats = parsed?.cardUsage && typeof parsed.cardUsage === "object"
                        ? Object.fromEntries(
                            Object.entries(parsed.cardUsage)
                                .filter(([, value]) => Number.isFinite(value) && value > 0)
                                .map(([key, value]) => [key, Math.floor(value)])
                        )
                        : {};
                    this.recalcTotalsFromDifficulty();
                    return;
                }

                this.playerWins = Number.isFinite(parsed?.wins) ? Math.max(0, Math.floor(parsed.wins)) : 0;
                this.playerLosses = Number.isFinite(parsed?.losses) ? Math.max(0, Math.floor(parsed.losses)) : 0;
                this.recordByDifficulty = {
                    easy: { wins: 0, losses: 0 },
                    medium: { wins: this.playerWins, losses: this.playerLosses },
                    hard: { wins: 0, losses: 0 }
                };
                this.cardUsageStats = {};
            } catch (error) {
                this.playerWins = 0;
                this.playerLosses = 0;
                this.recordByDifficulty = {
                    easy: { wins: 0, losses: 0 },
                    medium: { wins: 0, losses: 0 },
                    hard: { wins: 0, losses: 0 }
                };
                this.cardUsageStats = {};
            }
        }

        savePersistentStats() {
            try {
                window.localStorage.setItem(
                    this.statsStorageKey,
                    JSON.stringify({
                        wins: this.playerWins,
                        losses: this.playerLosses,
                        byDifficulty: this.recordByDifficulty,
                        cardUsage: this.cardUsageStats
                    })
                );
            } catch (error) {
                // Ignore storage write issues (private mode / blocked storage).
            }
        }

        endMatchToMenu(message, outcome = "none") {
            this.ensureProgressionStateCurrent();
            const difficultyRecord = this.recordByDifficulty[this.difficulty] || this.recordByDifficulty.medium;
            let finalMessage = message;
            let triggerBossRelicSelection = false;
            let bossRewardNodeId = "";
            let bossRewardName = "";
            const outcomeTransitionText = outcome === "win"
                ? "Du hast gewonnen!"
                : outcome === "loss"
                    ? "Du wurdest besiegt!"
                    : "";
            if (outcome === "win") {
                this.playerWins += 1;
                difficultyRecord.wins += 1;
                this.savePersistentStats();
                this.trackProgress("wins", 1);
                if (this.difficulty === "hard") {
                    this.trackProgress("winsHard", 1);
                }
            } else if (outcome === "loss") {
                this.playerLosses += 1;
                difficultyRecord.losses += 1;
                this.savePersistentStats();
                this.trackProgress("losses", 1);
            }

            if (this.campaignProgress.activeRun && (outcome === "win" || outcome === "loss")) {
                const run = this.campaignProgress.activeRun;
                const region = this.getCampaignRegionById(run.regionId);
                const node = region.nodes[run.nodeIndex] || region.nodes[0];
                const nodeType = this.getCampaignNodeType(node);
                const nodeLabel = this.getCampaignNodeTypeLabel(nodeType);
                const nodeTitle = this.getCampaignNodeTitle(node);
                if (outcome === "win") {
                    triggerBossRelicSelection = nodeType === "boss";
                    if (triggerBossRelicSelection) {
                        bossRewardNodeId = node.id || "";
                        bossRewardName = node.enemyName || nodeTitle || "Boss";
                        this.progression.bossCurrency = Math.max(0, Math.floor((this.progression.bossCurrency || 0) + BOSS_SEALS_PER_BOSS_WIN));
                        this.ui.addLog(`Boss-Beute: +${BOSS_SEALS_PER_BOSS_WIN} ${SHOP_BOSS_CURRENCY_NAME}`, "player");
                    }
                    const runBonusXp = this.getCampaignRunBonuses(run).bonusXpOnWin;
                    if (runBonusXp > 0) {
                        const oldLevel = this.progression.level;
                        this.progression.xp += runBonusXp;
                        this.progression.level = this.calculateLevelFromXp(this.progression.xp);
                        if (this.progression.level > oldLevel) {
                            this.unlockCosmeticsForLevel(this.progression.level);
                            this.unlockRelicsForLevel(this.progression.level);
                        }
                        this.savePersistentProgression();
                        this.ui.addLog(`Kampagnen-Bonus: +${runBonusXp} XP`, "player");
                    }
                    const currentCleared = this.campaignProgress.clearedByRegion[region.id] || 0;
                    this.campaignProgress.clearedByRegion[region.id] = Math.max(currentCleared, run.nodeIndex + 1);
                    if (run.nodeIndex + 1 < region.nodes.length) {
                        run.nodeIndex += 1;
                        const nextNode = region.nodes[run.nodeIndex];
                        finalMessage = `Kampagne: ${nodeLabel} ${nodeTitle} abgeschlossen. Nächster Knoten: ${this.getCampaignNodeTypeLabel(this.getCampaignNodeType(nextNode))} ${this.getCampaignNodeTitle(nextNode)} (${run.nodeIndex + 1}/${region.nodes.length})`;
                    } else {
                        this.campaignProgress.activeRun = null;
                        this.activeCampaignNode = null;
                        finalMessage = `Region abgeschlossen: ${region.name}`;
                    }
                } else {
                    this.campaignProgress.activeRun = null;
                    this.activeCampaignNode = null;
                    finalMessage = `Kampagne gescheitert bei ${nodeLabel} ${nodeTitle} (${region.name})`;
                }
                this.updateCampaignTitlesFromProgress(outcome === "win");
                this.savePersistentCampaign();
            }

            if (outcome === "win" || outcome === "loss") {
                this.grantCurrencyForMatch(outcome);
                this.savePersistentProgression();
            }

            this.ui.setMenuRecord(this.getMenuRecordSnapshot());
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.ui.setMenuCampaignStatus(this.getCampaignStatusText());
            this.ui.setRoundEvent(null);
            this.ui.setMatchRelic(null);
            this.gameActive = false;
            this.isPaused = false;
            this.playerTurn = false;
            this.playerActionsRemaining = 0;
            this.enemyActionsRemaining = 0;
            if (this.lanState.role === "host" && (outcome === "win" || outcome === "loss")) {
                const remoteText = outcome === "win"
                    ? "Du wurdest besiegt!"
                    : outcome === "loss"
                        ? "Du hast gewonnen!"
                        : "Match beendet.";
                this.broadcastLanResult(remoteText);
                this.publishLanResultToStorage(remoteText);
            }
            if (this.lanState.matchActive) {
                const wasLanHost = this.lanState.role === "host";
                this.lanState.matchActive = false;
                this.lanState.connected = false;
                this.lanState.localReady = false;
                this.lanState.remoteReady = false;
                this.lanState.remoteSnapshot = null;
                const closeDelay = wasLanHost ? 520 : 0;
                if (closeDelay > 0) {
                    window.setTimeout(() => this.closeLanChannel(), closeDelay);
                } else {
                    this.closeLanChannel();
                }
            }
            this.ui.hidePauseMenu();
            this.render();
            const finishToMenu = () => {
                if (triggerBossRelicSelection) {
                    this.openBossRelicRewardMenu(finalMessage, bossRewardNodeId, bossRewardName);
                    return;
                }
                this.ui.showMainMenu(finalMessage);
            };
            if (outcomeTransitionText) {
                this.ui.showResultTransition(outcomeTransitionText, finishToMenu);
                return;
            }
            finishToMenu();
        }

        openModMenu() {
            this.ui.showMenuMod(this.progression.level);
            this.refreshModAchievementControls();
        }

        refreshModAchievementControls() {
            const options = this.progression.achievements.map((entry) => ({
                id: entry.id,
                label: entry.title
            }));
            const selectedId = this.ui.menuModAchievementSelect?.value || (options[0] ? options[0].id : "");
            this.ui.setModAchievementOptions(options, selectedId);
            this.syncModAchievementTierFromSelection();
        }

        syncModAchievementTierFromSelection() {
            const selectedId = this.ui.menuModAchievementSelect?.value;
            if (!selectedId) {
                this.ui.setModAchievementTierInput(1);
                this.ui.setModAchievementPreview("Aktuell: -");
                return;
            }
            const current = this.progression.achievements.find((entry) => entry.id === selectedId);
            const tier = current?.tier || 1;
            this.ui.setModAchievementTierInput(tier);
            if (current) {
                this.ui.setModAchievementPreview(`Aktuell: ${current.title} | Ziel ${current.target} | Reward ${current.rewardXp} XP`);
            }
        }

        unlockModTools() {
            const password = this.ui.menuModPassword ? this.ui.menuModPassword.value.trim() : "";
            if (password === MOD_PASSWORD) {
                this.ui.setModUnlocked(true);
                this.ui.setModFeedback("Zugang gewährt.");
            } else {
                this.ui.setModUnlocked(false);
                this.ui.setModFeedback("Falsches Passwort.", true);
            }
        }

        setLevelFromMod() {
            if (!this.ui.menuModLevelInput) {
                return;
            }

            const rawValue = Number.parseInt(this.ui.menuModLevelInput.value, 10);
            if (!Number.isFinite(rawValue)) {
                this.ui.setModFeedback("Bitte eine gueltige Zahl eingeben.", true);
                return;
            }

            const nextLevel = Math.max(1, Math.min(200, Math.floor(rawValue)));
            this.progression.level = nextLevel;
            this.progression.xp = (nextLevel - 1) * 100;

            this.progression.cosmetics.unlockedIds = ["initiand"];
            this.progression.cosmetics.activeId = "initiand";
            this.progression.cardBacks.unlockedIds = ["back_initiand"];
            this.progression.cardBacks.activeId = "back_initiand";
            this.progression.relics.unlockedIds = ["relic_blade"];
            this.progression.relics.activeId = "relic_blade";

            this.unlockCosmeticsForLevel(nextLevel, false);
            this.unlockCardBacksForLevel(nextLevel, false);
            this.unlockRelicsForLevel(nextLevel, false);

            if (!this.progression.cosmetics.unlockedIds.includes(this.progression.cosmetics.activeId)) {
                this.progression.cosmetics.activeId = this.progression.cosmetics.unlockedIds[this.progression.cosmetics.unlockedIds.length - 1];
            }
            if (!this.progression.relics.unlockedIds.includes(this.progression.relics.activeId)) {
                this.progression.relics.activeId = this.progression.relics.unlockedIds[this.progression.relics.unlockedIds.length - 1];
            }
            if (!this.progression.cardBacks.unlockedIds.includes(this.progression.cardBacks.activeId)) {
                this.progression.cardBacks.activeId = this.progression.cardBacks.unlockedIds[this.progression.cardBacks.unlockedIds.length - 1];
            }

            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.ui.setModCurrentLevel(nextLevel);
            this.ui.setModFeedback(`Level auf ${nextLevel} gesetzt.`);
            this.render();
        }

        resetRecordFromMod() {
            this.playerWins = 0;
            this.playerLosses = 0;
            this.recordByDifficulty = {
                easy: { wins: 0, losses: 0 },
                medium: { wins: 0, losses: 0 },
                hard: { wins: 0, losses: 0 }
            };
            this.cardUsageStats = {};
            this.savePersistentStats();
            this.ui.setMenuRecord(this.getMenuRecordSnapshot());
            this.ui.setModFeedback("Bilanz wurde zurueckgesetzt.");
        }

        resetCampaignFromMod() {
            this.campaignProgress = this.createDefaultCampaignProgress();
            this.activeCampaignNode = null;
            this.updateCampaignTitlesFromProgress(false);
            this.savePersistentCampaign();
            this.ui.setMenuCampaignStatus(this.getCampaignStatusText());
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.refreshModAchievementControls();
            this.render();
            this.ui.setModFeedback("Kampagne wurde zurueckgesetzt.");
        }

        resetAchievementsFromMod() {
            this.progression.achievements = this.normalizeAchievements([]);
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.refreshModAchievementControls();
            this.ui.setModFeedback("Achievements wurden zurueckgesetzt.");
        }

        setAchievementTierFromMod() {
            const achievementId = this.ui.menuModAchievementSelect?.value;
            const tierRaw = Number.parseInt(this.ui.menuModAchievementTierInput?.value || "1", 10);
            if (!achievementId || !Number.isFinite(tierRaw)) {
                this.ui.setModFeedback("Bitte Achievement und gueltiges Tier wählen.", true);
                return;
            }

            const tier = Math.max(1, Math.min(MAX_ACHIEVEMENT_TIER, Math.floor(tierRaw)));
            const template = ACHIEVEMENT_POOL.find((entry) => entry.id === achievementId);
            const current = this.progression.achievements.find((entry) => entry.id === achievementId);
            if (!template || !current) {
                this.ui.setModFeedback("Achievement nicht gefunden.", true);
                return;
            }

            const updated = this.createAchievementState(template, {
                tier,
                baseTarget: current.baseTarget || template.target,
                baseRewardXp: current.baseRewardXp || template.rewardXp,
                progress: 0
            });

            const idx = this.progression.achievements.findIndex((entry) => entry.id === achievementId);
            this.progression.achievements[idx] = updated;
            this.savePersistentProgression();
            this.ui.setMenuProgression(this.getMenuProgressionSnapshot());
            this.refreshModAchievementControls();
            this.ui.setModFeedback(`${template.title} auf Tier ${tier}/${MAX_ACHIEVEMENT_TIER} gesetzt.`);
        }

        togglePause() {
            if (!this.gameActive) {
                return;
            }
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                this.ui.showPauseMenu();
            } else {
                this.ui.hidePauseMenu();
            }
            this.render();
        }

        returnToMainMenuFromPause() {
            if (!this.gameActive) {
                return;
            }
            this.endMatchToMenu("Spiel pausiert - zurück im Hauptmenü.");
        }

        bindUi() {
            this.ui.bindControls({
                onEndTurn: () => this.endPlayerTurn(),
                onDrawCard: () => this.playerDrawCardAction(),
                onUseAbility: () => this.playerUseAbilityAction(),
                onDifficultyChange: (event) => {
                    this.changeDifficulty(event.target.value);
                },
                onMenuDifficultyChange: (event) => {
                    this.changeDifficulty(event.target.value);
                },
                onMenuStart: () => this.startMatchFromMenu(),
                onMenuOpenIndex: () => this.ui.showMenuIndex(this.cardIndexData),
                onMenuOpenTutorial: () => this.openTutorialFromMenu(),
                onMenuOpenRewards: () => this.ui.showMenuRewards(this.getRewardTrackData(), this.progression.level),
                onMenuOpenStats: () => this.ui.showMenuStats(this.getStatsSnapshot()),
                onMenuOpenSettings: () => this.openSoundSettingsMenu(),
                onMenuOpenMod: () => this.openModMenu(),
                onMenuOpenLan: () => this.openLanMenu(),
                onMenuOpenCustomize: () => this.ui.showMenuCustomize(),
                onMenuOpenCampaign: () => this.openCampaignMenu(),
                onMenuOpenShop: () => this.openDailyShopMenu(),
                onMenuBackHome: () => this.ui.showMenuHome(),
                onMenuCosmeticPrev: () => this.cycleActiveCosmetic(-1),
                onMenuCosmeticNext: () => this.cycleActiveCosmetic(1),
                onMenuTitlePrev: () => this.cycleActiveCampaignTitle(-1),
                onMenuTitleNext: () => this.cycleActiveCampaignTitle(1),
                onCustomizeCosmeticPrev: () => this.cycleActiveCosmetic(-1),
                onCustomizeCosmeticNext: () => this.cycleActiveCosmetic(1),
                onCustomizeCardBackPrev: () => this.cycleActiveCardBack(-1),
                onCustomizeCardBackNext: () => this.cycleActiveCardBack(1),
                onCustomizeTitlePrev: () => this.cycleActiveCampaignTitle(-1),
                onCustomizeTitleNext: () => this.cycleActiveCampaignTitle(1),
                onMenuRelicPrev: () => this.cycleActiveRelic(-1),
                onMenuRelicNext: () => this.cycleActiveRelic(1),
                onTutorialPrev: () => this.prevTutorialStep(),
                onTutorialNext: () => this.nextTutorialStep(),
                onTutorialBackHome: () => this.ui.showMenuHome(),
                onRewardsBackHome: () => this.ui.showMenuHome(),
                onStatsBackHome: () => this.ui.showMenuHome(),
                onSettingsBackHome: () => this.ui.showMenuHome(),
                onSynergyBackSettings: () => {
                    this.ui.showMenuSettings(this.getMenuSettingsSnapshot());
                    this.ui.showSettingsTab("combat");
                },
                onLanPlayerNameInput: (event) => this.setLanPlayerNameFromMenu(event.target.value),
                onLanHostAddressInput: (event) => this.setLanHostAddressFromMenu(event.target.value),
                onLanHostStart: () => this.startLanHostFromMenu(),
                onLanJoin: () => this.joinLanFromMenu(),
                onLanCopyUrl: () => this.copyLanShareUrlFromMenu(),
                onLanBackHome: () => this.leaveLanSessionFromMenu(),
                onLanReady: () => this.toggleLanReadyFromMenu(),
                onLanCancelToSetup: () => this.openLanMenu(),
                onSettingsVolumeInput: (event) => this.setSoundVolumeFromMenu(event.target.value),
                onSettingsUiVolumeInput: (event) => this.setSoundChannelVolumeFromMenu("ui", event.target.value),
                onSettingsCombatVolumeInput: (event) => this.setSoundChannelVolumeFromMenu("combat", event.target.value),
                onSettingsEventsVolumeInput: (event) => this.setSoundChannelVolumeFromMenu("events", event.target.value),
                onSettingsMuteChange: (event) => this.setSoundMuteFromMenu(event.target.checked),
                onSettingsCombatSpeedChange: (event) => this.setCombatSpeedFromMenu(event.target.value),
                onSettingsCombatSynergyChange: (event) => this.setCombatSynergyEnabledFromMenu(event.target.checked),
                onSettingsOpenSynergyIndex: () => this.ui.showMenuSynergyIndex(this.getSynergyOverviewData()),
                onSettingsTest: () => this.testSoundFromMenu(),
                onSettingsTabSound: () => this.ui.showSettingsTab("sound"),
                onSettingsTabCombat: () => this.ui.showSettingsTab("combat"),
                onSettingsTabCosmetic: () => this.ui.showSettingsTab("cosmetic"),
                onSettingsTabCampaignTitle: () => this.ui.showSettingsTab("campaignTitle"),
                onSettingsTabAccessibility: () => this.ui.showSettingsTab("accessibility"),
                onSettingsFontScaleChange: (event) => this.setAccessibilityFontScaleFromMenu(event.target.value),
                onSettingsColorblindChange: (event) => this.setAccessibilityColorBlindFromMenu(event.target.checked),
                onSettingsReducedMotionChange: (event) => this.setAccessibilityReducedMotionFromMenu(event.target.checked),
                onModUnlock: () => this.unlockModTools(),
                onModSetLevel: () => this.setLevelFromMod(),
                onModResetRecord: () => this.resetRecordFromMod(),
                onModResetCampaign: () => this.resetCampaignFromMod(),
                onModAchievementSelectionChange: () => this.syncModAchievementTierFromSelection(),
                onModSetAchievementTier: () => this.setAchievementTierFromMod(),
                onModResetAchievements: () => this.resetAchievementsFromMod(),
                onModBackHome: () => this.ui.showMenuHome(),
                onCustomizeBackHome: () => this.ui.showMenuHome(),
                onCampaignRegionChange: (event) => this.setCampaignRegion(event.target.value),
                onCampaignStart: () => this.startCampaignFromMenu(),
                onCampaignBackHome: () => this.ui.showMenuHome(),
                onShopBuyOffer: (offerId, scope) => this.purchaseDailyShopOfferFromMenu(offerId, scope),
                onShopRerollDaily: () => this.rerollDailyShopFromMenu(),
                onShopRelicUpgrade: () => this.upgradeRelicFromShopMenu(),
                onShopBackHome: () => this.ui.showMenuHome(),
                onBossRelicPick: (relicId) => this.pickBossRelicReward(relicId),
                onPauseToggle: () => this.togglePause(),
                onPauseResume: () => this.togglePause(),
                onPauseMainMenu: () => this.returnToMainMenuFromPause(),
                onFullscreenStart: () => {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                },
                onFullscreenEnd: () => {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                },
                onFullscreenChanged: () => {
                    this.ui.syncFullscreenUi();
                    window.scrollTo(0, 0);
                }
            });

            document.querySelectorAll("button").forEach((btn) => {
                btn.addEventListener("click", () => this.sound.play("uiClick"));
            });
            this.ui.syncFullscreenUi();
        }

        getCurrentMatchSetup() {
            const relicLevel = Math.max(0, Math.floor(this.progression?.relicUpgradeLevel || 0));
            const relicMaxHpBonus = relicLevel;
            const boosterStartMana = Math.max(0, Math.floor(this.progression?.pendingBoosters?.startMana || 0));
            const boosterMaxHp = Math.max(0, Math.floor(this.progression?.pendingBoosters?.maxHp || 0));
            if (!this.campaignProgress.activeRun || !this.activeCampaignNode) {
                return {
                    playerMaxHp: CONFIG.PLAYER_MAX_HP + relicMaxHpBonus + boosterMaxHp,
                    enemyMaxHp: CONFIG.ENEMY_MAX_HP,
                    playerStartMana: Math.min(CONFIG.PLAYER_MAX_MANA, CONFIG.START_MANA + boosterStartMana),
                    enemyStartMana: CONFIG.ENEMY_MAX_MANA,
                    consumedBoosters: { startMana: boosterStartMana, maxHp: boosterMaxHp }
                };
            }
            const runBonuses = this.getCampaignRunBonuses();
            return {
                playerMaxHp: CONFIG.PLAYER_MAX_HP + runBonuses.playerMaxHpBonus + relicMaxHpBonus + boosterMaxHp,
                enemyMaxHp: this.activeCampaignNode.enemyHp,
                playerStartMana: Math.min(CONFIG.PLAYER_MAX_MANA, CONFIG.START_MANA + runBonuses.playerStartManaBonus + boosterStartMana),
                enemyStartMana: CONFIG.ENEMY_MAX_MANA,
                consumedBoosters: { startMana: boosterStartMana, maxHp: boosterMaxHp }
            };
        }

        getEnemyDisplayName() {
            if (this.isLanHostMatchActive()) {
                return this.lanState.remoteName || "Spieler 2";
            }
            if (this.activeCampaignNode?.enemyName) {
                return this.activeCampaignNode.enemyName;
            }
            const run = this.campaignProgress?.activeRun;
            if (run) {
                const region = this.getCampaignRegionById(run.regionId);
                return region?.nodes?.[run.nodeIndex]?.enemyName || "KI-Gegner";
            }
            return "KI-Gegner";
        }

        getAiLogSource() {
            return this.getEnemyDisplayName() === "KI-Gegner" ? "ai" : "ai-boss";
        }

        reset(previousResult = "") {
            const matchSetup = this.getCurrentMatchSetup();
            const consumedBoosters = matchSetup.consumedBoosters || { startMana: 0, maxHp: 0 };
            this.roundNumber = 1;
            this.activeRoundEvent = null;
            this.activeRoundEventRoundsLeft = 0;
            this.activeMatchRelic = null;
            this.enemySignatureUsed = false;
            this.playerTurn = true;
            this.playerActionsRemaining = CONFIG.PLAYER_ACTIONS_PER_TURN;
            this.enemyActionsRemaining = 0;
            this.playerAbilityUsed = false;
            this.enemyAbilityUsed = false;
            this.resetAllCombos();
            this.resetSynergyState();
            this.player.maxHp = matchSetup.playerMaxHp;
            this.enemy.maxHp = matchSetup.enemyMaxHp;
            this.player.reset(matchSetup.playerStartMana);
            this.enemy.reset(matchSetup.enemyStartMana);
            if (consumedBoosters.startMana > 0 || consumedBoosters.maxHp > 0) {
                this.progression.pendingBoosters.startMana = 0;
                this.progression.pendingBoosters.maxHp = 0;
                this.savePersistentProgression();
            }

            this.playerDeck.reset();
            this.aiDeck.reset();

            this.drawToHand(this.player, this.playerDeck, CONFIG.HAND_SIZE);
            this.drawToHand(this.enemy, this.aiDeck, CONFIG.HAND_SIZE);
            this.setupCampaignBossPhase();

            this.ui.clearLog();
            this.ui.clearDamageLogs();
            if (previousResult) {
                this.ui.addLog(previousResult);
            }
            this.ui.addLog("Neues Spiel gestartet.");
            if (consumedBoosters.startMana > 0 || consumedBoosters.maxHp > 0) {
                const boosterText = [];
                if (consumedBoosters.startMana > 0) boosterText.push(`+${consumedBoosters.startMana} Start-Mana`);
                if (consumedBoosters.maxHp > 0) boosterText.push(`+${consumedBoosters.maxHp} Max-HP`);
                this.ui.addLog(`Verbrauchte Shop-Booster: ${boosterText.join(", ")}`, "player");
            }
            if (this.campaignProgress.activeRun && this.activeCampaignNode) {
                this.ui.addLog(`Kampagnenziel: ${this.activeCampaignNode.enemyName} (HP ${this.activeCampaignNode.enemyHp})`);
                const runBonuses = this.getCampaignRunBonuses();
                if (runBonuses.playerMaxHpBonus > 0 || runBonuses.playerStartManaBonus > 0 || runBonuses.bonusXpOnWin > 0) {
                    const bonusText = [];
                    if (runBonuses.playerMaxHpBonus > 0) bonusText.push(`+${runBonuses.playerMaxHpBonus} Max-HP`);
                    if (runBonuses.playerStartManaBonus > 0) bonusText.push(`+${runBonuses.playerStartManaBonus} Start-Mana`);
                    if (runBonuses.bonusXpOnWin > 0) bonusText.push(`+${runBonuses.bonusXpOnWin} XP/Kampfsieg`);
                    this.ui.addLog(`Run-Boni: ${bonusText.join(", ")}`, "player");
                }
            }
            if (this.isLanHostMatchActive()) {
                this.ui.addLog(`LAN-Gegner: ${this.lanState.remoteName || "Spieler 2"}`, "ai");
            } else {
                this.ui.addLog(`KI-Persoenlichkeit: ${this.getCurrentAiPersonalityLabel()}`);
                this.ui.addLog(`KI-Archetyp: ${this.getCurrentAiArchetypeLabel()}`);
                if (this.activeCampaignNode?.signatureCardId) {
                    this.ui.addLog(`Boss-Signatur: ${this.getSignatureCardName(this.activeCampaignNode.signatureCardId)}`, this.getAiLogSource());
                }
                if (this.activeCampaignNode?.phase2) {
                    this.ui.addLog(`Boss-Mechanik: ${this.activeCampaignNode.phase2.name} (Phase 2 bei 50% HP)`, this.getAiLogSource());
                }
            }
            this.rollMatchRelic();
            this.rollRoundEvent();
            this.render();
        }

        drawToHand(combatant, deck, amount) {
            while (combatant.hand.length < CONFIG.HAND_SIZE && amount > 0) {
                const card = deck.draw();
                if (!card) {
                    break;
                }
                combatant.hand.push(card);
                amount -= 1;
            }
        }

        drawSingleCard(combatant, deck) {
            if (combatant.hand.length >= CONFIG.MAX_HAND_SIZE) {
                return null;
            }
            const card = deck.draw();
            if (!card) {
                return null;
            }
            combatant.hand.push(card);
            return card;
        }

        drawCardsForEffect(combatant, deck, amount) {
            const count = Math.max(0, Math.floor(amount || 0));
            let drawn = 0;
            for (let i = 0; i < count; i += 1) {
                const card = this.drawSingleCard(combatant, deck);
                if (!card) {
                    break;
                }
                drawn += 1;
            }
            return drawn;
        }

        playerDrawCardAction() {
            if (this.isLanClientMatchActive()) {
                this.sendLanMessage({ type: "command", command: "draw_card" });
                return;
            }
            if (!this.gameActive || this.isPaused || !this.playerTurn || this.playerActionsRemaining <= 0 || this.isCardPlayAnimating) {
                return;
            }
            if (this.player.hand.length >= CONFIG.HAND_SIZE) {
                this.ui.showMessage("Hand ist voll!", 1500);
                return;
            }

            const card = this.drawSingleCard(this.player, this.playerDeck);
            if (!card) {
                this.ui.showMessage("Kein Kartenzug moeglich", 1500);
                return;
            }

            this.consumePlayerAction();
            this.ui.addLog(`Spieler zieht ${card.name}`, "player");
            this.trackProgress("cardsDrawn", 1);
            this.render();
            this.tryAutoEndPlayerTurn();
        }

        playerUseAbilityAction() {
            if (this.isLanClientMatchActive()) {
                this.sendLanMessage({ type: "command", command: "use_ability" });
                return;
            }
            if (!this.gameActive || this.isPaused || !this.playerTurn || this.playerActionsRemaining <= 0 || this.playerAbilityUsed || this.isCardPlayAnimating) {
                return;
            }
            if (this.player.statuses.silenceTurns > 0) {
                this.ui.showMessage("Silence aktiv: Fokus ist blockiert.", 1500);
                return;
            }

            const manaGain = 2;
            const shieldGain = 2;
            this.player.mana = Math.min(CONFIG.PLAYER_MAX_MANA, this.player.mana + manaGain);
            this.player.addShield(shieldGain);
            this.playerAbilityUsed = true;
            this.consumePlayerAction();
            this.ui.showMessage("Fähigkeit: Fokus (+2 Mana, +2 Schild)", 1500);
            this.ui.addLog("Spieler nutzt Fokus (+2 Mana, +2 Schild)", "player");
            this.trackProgress("abilitiesUsed", 1);
            this.render();
            this.tryAutoEndPlayerTurn();
        }

        tryAutoEndPlayerTurn() {
            if (this.playerTurn && this.playerActionsRemaining <= 0) {
                this.ui.showMessage("Keine Aktionen mehr - Zug endet", 1200);
                window.setTimeout(() => {
                    if (this.playerTurn) {
                        this.endPlayerTurn();
                    }
                }, this.getScaledDelay(300));
            }
        }

        render() {
            if (this.isLanClientMatchActive() && this.lanState.remoteSnapshot) {
                this.renderLanClientSnapshot();
                return;
            }
            const activeCosmetic = this.getCosmeticById(this.progression.cosmetics.activeId) || COSMETIC_REWARDS[0];
            const activeCampaignTitle = this.getActiveCampaignTitle();
            const enemyName = this.getEnemyDisplayName();
            this.ui.renderStats(this.player, this.enemy, {
                gameActive: this.gameActive,
                isPaused: this.isPaused,
                playerTurn: this.playerTurn,
                playerActionsRemaining: this.playerActionsRemaining,
                enemyActionsRemaining: this.enemyActionsRemaining,
                enemyName,
                playerAbilityUsed: this.playerAbilityUsed,
                playerHandSize: this.player.hand.length,
                playerTitle: `${activeCampaignTitle.title} | ${activeCosmetic.title}`
            });
            this.ui.renderPlayerHand(this.player.hand, this.player.mana, (index, cardElement) => this.playPlayerCard(index, cardElement));
            this.ui.renderAIHand(this.enemy.hand);
            this.pushLanStateToClient();
        }

        cardCountsAsDamage(card) {
            if (!card) {
                return false;
            }
            return (card.damage || 0) > 0 || card.special?.kind === "execute_damage";
        }

        isCardBlockedByControlStatus(card, actor) {
            if (!card || !actor?.statuses) {
                return { blocked: false, reason: "" };
            }

            if (actor.statuses.silenceTurns > 0 && (card.type === "special" || Boolean(card.status))) {
                return { blocked: true, reason: "Silence aktiv: Nur Basis-Karten ohne Spezial/Status." };
            }

            const currentMana = Number.isFinite(actor.mana) ? actor.mana : 0;
            const hasDamageOption = Array.isArray(actor.hand)
                && actor.hand.some((handCard) => this.cardCountsAsDamage(handCard) && currentMana >= (handCard.cost || 0));
            if (actor.statuses.tauntTurns > 0 && hasDamageOption && !this.cardCountsAsDamage(card)) {
                return { blocked: true, reason: "Taunt aktiv: Du musst eine Schadenskarte spielen." };
            }

            return { blocked: false, reason: "" };
        }

        evaluateCardCondition(card, actor, target) {
            if (!card.condition) {
                return { ok: true, reason: "" };
            }

            if (card.condition.kind === "self_hp_at_or_below") {
                const ok = actor.hp <= card.condition.value;
                return { ok, reason: `Nur bei eigenen HP <= ${card.condition.value}` };
            }

            if (card.condition.kind === "target_hp_at_or_below") {
                const ok = target.hp <= card.condition.value;
                return { ok, reason: `Nur bei Gegner-HP <= ${card.condition.value}` };
            }

            if (card.condition.kind === "self_has_negative_status") {
                const ok = actor.hasNegativeStatus();
                return { ok, reason: "Nur wenn du Brand oder Gift hast" };
            }

            return { ok: true, reason: "" };
        }

        playPlayerCard(index, cardElement = null) {
            if (this.isLanClientMatchActive()) {
                this.sendLanMessage({ type: "command", command: "play_card", index });
                return;
            }
            if (!this.gameActive || this.isPaused || !this.playerTurn) {
                this.ui.showMessage("Spiel ist pausiert!", 2000);
                return;
            }
            if (this.isCardPlayAnimating) {
                return;
            }
            if (this.playerActionsRemaining <= 0) {
                this.ui.showMessage("Keine Aktionen mehr!", 1500);
                return;
            }

            const card = this.player.hand[index];
            if (!card) {
                return;
            }

            const controlBlock = this.isCardBlockedByControlStatus(card, this.player);
            if (controlBlock.blocked) {
                this.ui.showMessage(controlBlock.reason, 1800);
                return;
            }

            const conditionCheck = this.evaluateCardCondition(card, this.player, this.enemy);
            if (!conditionCheck.ok) {
                this.ui.showMessage(conditionCheck.reason, 1800);
                return;
            }

            if (this.player.mana < card.cost) {
                this.ui.showMessage("Nicht genug Mana!", 2000);
                return;
            }

            const finishCardPlay = () => {
                this.player.mana -= card.cost;
                this.player.hand.splice(index, 1);
                this.playerDeck.discard(card);
                this.consumePlayerAction();
                this.trackCardUsage(card.id);
                this.trackProgress("cardsPlayed", 1);

                this.resolveCardEffect(card, "player");

                if (this.enemy.hp <= 0) {
                    this.ui.showMessage("Du hast gewonnen!", 2000);
                    window.setTimeout(() => this.endMatchToMenu("Spieler hat gewonnen!", "win"), 1400);
                    return;
                }

                this.render();
                this.tryAutoEndPlayerTurn();
            };

            if (cardElement) {
                this.isCardPlayAnimating = true;
                this.ui.animatePlayedCard(cardElement, () => {
                    this.isCardPlayAnimating = false;
                    finishCardPlay();
                }, this.getCombatSpeedMultiplier());
                return;
            }

            finishCardPlay();
        }

        endPlayerTurn() {
            if (this.isLanClientMatchActive()) {
                this.sendLanMessage({ type: "command", command: "end_turn" });
                return;
            }
            if (!this.gameActive || this.isPaused || !this.playerTurn || this.isCardPlayAnimating) {
                return;
            }
            this.consumeControlStatusTurns(this.player, "Spieler", "player");

            this.playerTurn = false;
            this.resetCombo("player");
            this.resetCombo("ai");
            this.resetSynergyState("player");
            this.resetSynergyState("ai");
            this.enemyActionsRemaining = this.getAiActionsPerTurn();
            this.enemyAbilityUsed = false;
            this.enemy.mana = CONFIG.ENEMY_MAX_MANA + this.getTotalModifier("manaDelta");
            this.render();
            const enemyLabel = this.getEnemyDisplayName();
            const enemyLogSource = this.getAiLogSource();
            const enemyAlive = this.applyStatusTick(this.enemy, enemyLabel, enemyLogSource, "enemy");
            if (!enemyAlive) {
                this.ui.showMessage("Du hast gewonnen!", 2000);
                this.ui.addLog(`${enemyLabel} wurde durch Status-Effekte besiegt.`, enemyLogSource);
                this.render();
                window.setTimeout(() => this.endMatchToMenu("Spieler hat gewonnen!", "win"), 1400);
                return;
            }

            this.drawToHand(this.enemy, this.aiDeck, CONFIG.HAND_SIZE);
            if (this.isLanHostMatchActive()) {
                const enemyName = this.lanState.remoteName || "Spieler 2";
                this.ui.showMessage(`${enemyName} ist am Zug...`, 1500);
                this.render();
                return;
            }
            this.ui.showMessage("KI ist am Zug...", 2000);
            this.sound.play("turnToAi");
            this.runAfterDelayWhenActive(1000, () => {
                this.runAiTurn();

                if (this.player.hp <= 0) {
                    this.ui.showMessage("Du wurdest besiegt!", 2000);
                    this.ui.addLog("Spieler wurde besiegt.");
                    window.setTimeout(() => this.endMatchToMenu(`${this.getEnemyDisplayName()} hat gewonnen!`, "loss"), 1400);
                    return;
                }

                this.ui.showMessage("Neue Runde startet...", 1000);
                this.runAfterDelayWhenActive(550, () => this.startNextRound());
            });
        }

        runAiTurn() {
            if (this.tryUseBossSignatureCard() && this.player.hp <= 0) {
                return;
            }
            while (this.enemyActionsRemaining > 0) {
                const choice = this.ai.chooseCardIndex(this.enemy.hand, this.enemy.mana, this.difficulty, {
                    playerHP: this.player.hp,
                    enemyHP: this.enemy.hp,
                    enemyActionsRemaining: this.enemyActionsRemaining,
                    playerShield: this.player.statuses.shield,
                    enemyShield: this.enemy.statuses.shield,
                    selfFireCombo: this.getCurrentFireCombo("ai"),
                    playerDotDamage: this.player.getTotalDotDamage(),
                    playerStatuses: this.player.statuses,
                    enemyStatuses: this.enemy.statuses,
                    eventModifiers: this.getCurrentGlobalModifiers(),
                    selfLastAction: this.turnSynergyState.ai.lastAction,
                    selfSchoolCounts: { ...(this.turnSynergyState.ai.schoolCounts || { fire: 0, shadow: 0, nature: 0 }) },
                    synergyEnabled: this.synergyEnabled,
                    aiPersonality: this.getCurrentAiPersonalityId(),
                    aiArchetype: this.getCurrentAiArchetypeId()
                });

                const canPlay = choice >= 0;
                const canDraw = this.enemy.hand.length < CONFIG.MAX_HAND_SIZE;
                const canUseAbility = !this.enemyAbilityUsed && this.enemy.statuses.silenceTurns <= 0;

                if (!canPlay) {
                    if (canUseAbility && this.enemy.mana <= 1) {
                        this.aiUseAbilityAction();
                    } else if (canDraw) {
                        const card = this.drawSingleCard(this.enemy, this.aiDeck);
                        if (card) {
                            this.consumeEnemyAction();
                            this.ui.addLog(`${this.getEnemyDisplayName()} zieht ${card.name}`, this.getAiLogSource());
                        } else if (canUseAbility) {
                            this.aiUseAbilityAction();
                        } else {
                            break;
                        }
                    } else if (canUseAbility) {
                        this.aiUseAbilityAction();
                    } else {
                        break;
                    }

                    if (this.player.hp <= 0) {
                        break;
                    }
                    continue;
                }

                const card = this.enemy.hand[choice];
                this.enemy.hand.splice(choice, 1);
                this.aiDeck.discard(card);
                this.enemy.mana -= card.cost;
                this.consumeEnemyAction();

                this.resolveCardEffect(card, "ai");

                if (this.player.hp <= 0) {
                    break;
                }
            }
        }

        renderLanClientSnapshot() {
            const snap = this.lanState.remoteSnapshot;
            if (!snap) {
                return;
            }
            const clientPlayer = {
                hp: snap.enemy?.hp ?? 0,
                mana: snap.enemy?.mana ?? 0,
                statuses: snap.enemy?.statuses || this.player.statuses
            };
            const clientEnemy = {
                hp: snap.player?.hp ?? 0,
                mana: snap.player?.mana ?? 0,
                statuses: snap.player?.statuses || this.enemy.statuses
            };
            const isClientTurn = !snap.playerTurn;
            this.ui.renderStats(clientPlayer, clientEnemy, {
                gameActive: true,
                isPaused: false,
                playerTurn: isClientTurn,
                playerActionsRemaining: snap.enemyActionsRemaining ?? 0,
                enemyActionsRemaining: snap.playerActionsRemaining ?? 0,
                enemyName: snap.hostName || "Host",
                playerAbilityUsed: Boolean(snap.enemyAbilityUsed),
                playerHandSize: Array.isArray(snap.enemyHand) ? snap.enemyHand.length : 0,
                playerTitle: this.lanState.playerName || "Spieler 2"
            });
            this.ui.renderPlayerHand(Array.isArray(snap.enemyHand) ? snap.enemyHand : [], clientPlayer.mana, (index) => this.playPlayerCard(index));
            this.ui.renderAIHand(Array.isArray(snap.playerHand) ? snap.playerHand : []);
        }

        applyLanClientCommand(command, index = -1) {
            if (!this.isLanHostMatchActive() || !this.gameActive || this.isPaused || this.playerTurn) {
                return;
            }
            if (command === "play_card") {
                this.playEnemyCardFromNetwork(index);
                return;
            }
            if (command === "draw_card") {
                this.enemyDrawCardActionFromNetwork();
                return;
            }
            if (command === "use_ability") {
                const used = this.aiUseAbilityAction();
                if (used) {
                    this.render();
                }
                return;
            }
            if (command === "end_turn") {
                this.endEnemyTurnFromNetwork();
            }
        }

        playEnemyCardFromNetwork(index) {
            if (!this.gameActive || this.playerTurn || this.enemyActionsRemaining <= 0) {
                return;
            }
            const card = this.enemy.hand[index];
            if (!card) {
                return;
            }
            const controlBlock = this.isCardBlockedByControlStatus(card, this.enemy);
            if (controlBlock.blocked) {
                return;
            }
            const conditionCheck = this.evaluateCardCondition(card, this.enemy, this.player);
            if (!conditionCheck.ok) {
                return;
            }
            if (this.enemy.mana < card.cost) {
                return;
            }
            this.enemy.hand.splice(index, 1);
            this.aiDeck.discard(card);
            this.enemy.mana -= card.cost;
            this.consumeEnemyAction();
            this.resolveCardEffect(card, "ai");

            if (this.player.hp <= 0) {
                this.ui.showMessage("Du wurdest besiegt!", 2000);
                this.sendLanMessage({ type: "result", text: "Du wurdest besiegt!" });
                window.setTimeout(() => this.endMatchToMenu(`${this.lanState.remoteName || "Spieler 2"} hat gewonnen!`, "loss"), 1400);
                return;
            }
            this.render();
        }

        enemyDrawCardActionFromNetwork() {
            if (!this.gameActive || this.playerTurn || this.enemyActionsRemaining <= 0) {
                return;
            }
            if (this.enemy.hand.length >= CONFIG.HAND_SIZE) {
                return;
            }
            const card = this.drawSingleCard(this.enemy, this.aiDeck);
            if (!card) {
                return;
            }
            this.consumeEnemyAction();
            this.ui.addLog(`${this.lanState.remoteName || "Spieler 2"} zieht ${card.name}`, this.getAiLogSource());
            this.render();
        }

        endEnemyTurnFromNetwork() {
            if (!this.gameActive || this.playerTurn) {
                return;
            }
            this.ui.showMessage("Neue Runde startet...", 1000);
            this.runAfterDelayWhenActive(500, () => this.startNextRound());
        }

        aiUseAbilityAction() {
            if (this.enemyAbilityUsed || this.enemyActionsRemaining <= 0) {
                return false;
            }
            if (this.enemy.statuses.silenceTurns > 0) {
                return false;
            }

            const manaGain = 2;
            const shieldGain = 2;
            this.enemy.mana = Math.min(CONFIG.ENEMY_MAX_MANA + this.getTotalModifier("manaDelta"), this.enemy.mana + manaGain);
            this.enemy.addShield(shieldGain);
            this.enemyAbilityUsed = true;
            this.consumeEnemyAction();
            this.ui.addLog(`${this.getEnemyDisplayName()} nutzt Fokus (+2 Mana, +2 Schild)`, this.getAiLogSource());
            return true;
        }

        tryUseBossSignatureCard() {
            const signatureId = this.activeCampaignNode?.signatureCardId;
            if (!signatureId || this.enemySignatureUsed || this.enemyActionsRemaining <= 0) {
                return false;
            }
            const signatureCard = CARD_LIBRARY.ai.find((card) => card.id === signatureId);
            if (!signatureCard) {
                return false;
            }
            if (this.enemy.mana < signatureCard.cost) {
                return false;
            }
            const controlBlock = this.isCardBlockedByControlStatus(signatureCard, this.enemy);
            if (controlBlock.blocked) {
                return false;
            }
            const conditionCheck = this.evaluateCardCondition(signatureCard, this.enemy, this.player);
            if (!conditionCheck.ok) {
                return false;
            }

            this.enemy.mana -= signatureCard.cost;
            this.consumeEnemyAction();
            this.enemySignatureUsed = true;
            this.ui.addLog(`${this.getEnemyDisplayName()} entfesselt Signaturkarte: ${signatureCard.name}!`, this.getAiLogSource());
            this.resolveCardEffect({ ...signatureCard }, "ai");
            return true;
        }

        startNextRound() {
            const playerAlive = this.applyStatusTick(this.player, "Spieler", "player", "player");
            if (!playerAlive) {
                this.ui.showMessage("Du wurdest besiegt!", 2000);
                this.ui.addLog("Spieler wurde durch Status-Effekte besiegt.");
                this.render();
                window.setTimeout(() => this.endMatchToMenu(`${this.getEnemyDisplayName()} hat gewonnen!`, "loss"), 1400);
                return;
            }
            this.consumeControlStatusTurns(this.enemy, this.getEnemyDisplayName(), this.getAiLogSource());

            this.roundNumber += 1;
            this.advanceRoundEvent();
            this.playerTurn = true;
            this.playerActionsRemaining = CONFIG.PLAYER_ACTIONS_PER_TURN;
            this.playerAbilityUsed = false;
            this.enemyActionsRemaining = 0;
            this.resetCombo("player");
            this.resetCombo("ai");
            this.resetSynergyState("player");
            this.resetSynergyState("ai");
            this.player.mana = Math.min(
                CONFIG.PLAYER_MAX_MANA,
                this.player.mana + CONFIG.START_MANA + this.getTotalModifier("manaDelta")
            );
            this.drawToHand(this.player, this.playerDeck, CONFIG.HAND_SIZE);
            this.sound.play("turnToPlayer");
            this.render();
        }

        applyStatusTick(target, label, sourceLog, targetSide) {
            let totalDamage = 0;

            ["burn", "hardBurn", "poison"].forEach((kind) => {
                const effect = target.statuses[kind];
                if (effect.turns <= 0 || effect.damage <= 0) {
                    return;
                }
                const tickDamage = this.getModifiedStatusTickDamage(effect.damage);
                const damageResult = target.receiveDamage(tickDamage);
                const dealtDamage = damageResult.dealt;
                totalDamage += dealtDamage;
                if (dealtDamage > 0) {
                    this.ui.addDamageLog(targetSide, kind, dealtDamage);
                    this.ui.showActorImpact(targetSide, dealtDamage, "tick", `${kind.toUpperCase()} -${dealtDamage}`);
                    this.playImpactSound("tick");
                }
                if (damageResult.shieldBroken) {
                    this.ui.showActorImpact(targetSide, 0, "shieldbreak", "SHIELD BREAK!");
                    this.playImpactSound("shieldbreak");
                }
                effect.turns -= 1;
                if (effect.turns <= 0) {
                    effect.damage = 0;
                }

                if (target === this.enemy) {
                    this.maybeTriggerCampaignBossPhase();
                }
            });

            if (totalDamage > 0) {
                this.ui.addLog(`${label} erleidet ${totalDamage} Status-Schaden`, sourceLog);
                if (sourceLog === "player") {
                    this.ui.blink(this.ui.playerHP, "tick");
                } else {
                    this.ui.blink(this.ui.enemyHP, "tick");
                }
            }

            return target.hp > 0;
        }

        consumeControlStatusTurns(target, label, sourceLog) {
            if (!target?.statuses) {
                return;
            }
            let changed = false;
            if (target.statuses.silenceTurns > 0) {
                target.statuses.silenceTurns = Math.max(0, target.statuses.silenceTurns - 1);
                changed = true;
            }
            if (target.statuses.tauntTurns > 0) {
                target.statuses.tauntTurns = Math.max(0, target.statuses.tauntTurns - 1);
                changed = true;
            }
            if (changed) {
                this.ui.addLog(`${label}: Kontrolleffekte klingen ab.`, sourceLog);
            }
        }

        applyCardStatus(target, card, sourceLabel, sourceLog, synergyBonus = null) {
            if (!card.status) {
                return;
            }
            const bonus = synergyBonus || { bonusStatusDamage: 0, bonusStatusTurns: 0 };
            const { kind, turns, damage } = card.status;
            const finalTurns = Math.max(0, turns + (bonus.bonusStatusTurns || 0));
            const finalDamage = Math.max(0, damage + (bonus.bonusStatusDamage || 0));
            target.addStatusEffect(kind, finalTurns, finalDamage);
            this.ui.addLog(`${sourceLabel} verursacht ${kind} (${finalDamage} fuer ${finalTurns} Runden)`, sourceLog);
        }

        applySpecialEffect(card, attacker, defender, attackerLabel, sourceLog, isPlayer, synergyBonus = null) {
            if (!card.special) {
                return;
            }
            const bonus = synergyBonus || { bonusDamage: 0, bonusHeal: 0, bonusShield: 0 };

            if (card.special.kind === "execute_damage") {
                const aiBonusDamage = isPlayer ? 0 : this.getBossPhaseBonus("damage");
                const specialDamage = this.getModifiedDamage(card.special.damage || 0) + aiBonusDamage + (bonus.bonusDamage || 0);
                const damageResult = defender.receiveDamage(specialDamage);
                const dealt = damageResult.dealt;
                const defenderSide = isPlayer ? "enemy" : "player";
                if (isPlayer && dealt > 0) {
                    this.trackProgress("damageDealt", dealt);
                }
                this.ui.addDamageLog(defenderSide, card.name, dealt);
                const critical = dealt >= 10;
                this.ui.showActorImpact(
                    defenderSide,
                    dealt,
                    critical ? "crit" : "hit",
                    critical ? `KRIT! -${dealt}` : ""
                );
                this.playImpactSound(critical ? "crit" : "hit");
                if (damageResult.shieldBroken) {
                    this.ui.showActorImpact(defenderSide, 0, "shieldbreak", "SHIELD BREAK!");
                    this.playImpactSound("shieldbreak");
                }
                if (isPlayer) {
                    this.ui.blink(this.ui.enemyHP, critical ? "crit" : "hit");
                } else {
                    this.ui.blink(this.ui.playerHP, critical ? "crit" : "hit");
                }
                this.ui.addLog(`${attackerLabel} entfesselt ${card.name} (${dealt} Spezial-Schaden)`, sourceLog);
                if (critical) {
                    this.ui.addLog(`Kritischer Treffer von ${attackerLabel}!`, sourceLog);
                }
                if (isPlayer) {
                    this.maybeTriggerCampaignBossPhase();
                }
                return;
            }

            if (card.special.kind === "heal_and_shield") {
                const aiHealBonus = isPlayer ? 0 : this.getBossPhaseBonus("heal");
                const aiShieldBonus = isPlayer ? 0 : this.getBossPhaseBonus("shield");
                const healValue = this.getModifiedHeal(card.special.heal || 0) + aiHealBonus + (bonus.bonusHeal || 0);
                const shieldValue = this.getModifiedShield(card.special.shield || 0) + aiShieldBonus + (bonus.bonusShield || 0);
                attacker.receiveHeal(healValue);
                attacker.addShield(shieldValue);
                this.ui.showActorImpact(isPlayer ? "player" : "enemy", healValue, "heal");
                this.playImpactSound("heal");
                if (isPlayer) {
                    this.ui.blink(this.ui.playerHP, "heal");
                } else {
                    this.ui.blink(this.ui.enemyHP, "heal");
                }
                this.ui.addLog(`${attackerLabel} aktiviert ${card.name} (+${healValue} HP, +${shieldValue} Schild)`, sourceLog);
                return;
            }

            if (card.special.kind === "cleanse_and_heal") {
                const removed = attacker.clearNegativeStatuses();
                const aiHealBonus = isPlayer ? 0 : this.getBossPhaseBonus("heal");
                const healValue = this.getModifiedHeal(card.special.heal || 0) + aiHealBonus + (bonus.bonusHeal || 0);
                attacker.receiveHeal(healValue);
                this.ui.showActorImpact(isPlayer ? "player" : "enemy", healValue, "heal");
                this.playImpactSound("heal");
                if (isPlayer) {
                    this.ui.blink(this.ui.playerHP, "heal");
                } else {
                    this.ui.blink(this.ui.enemyHP, "heal");
                }
                this.ui.addLog(`${attackerLabel} nutzt ${card.name} (reinigt ${removed} Effekte, +${healValue} HP)`, sourceLog);
                return;
            }

            if (card.special.kind === "dispel") {
                const removeShield = card.special.removeShield !== false;
                const dispel = defender.clearDispellableEffects(removeShield);
                const summary = [
                    `Status ${dispel.negativeRemoved + dispel.controlRemoved}`
                ];
                if (removeShield) {
                    summary.push(`Schild ${dispel.shieldRemoved}`);
                }
                this.ui.addLog(`${attackerLabel} wirkt ${card.name} (${summary.join(", ")} entfernt)`, sourceLog);
                return;
            }

            if (card.special.kind === "silence") {
                const turns = Math.max(1, Math.floor(card.special.turns || 1));
                defender.addSilence(turns);
                this.ui.addLog(`${attackerLabel} wirkt ${card.name} (Silence ${turns})`, sourceLog);
                return;
            }

            if (card.special.kind === "taunt") {
                const turns = Math.max(1, Math.floor(card.special.turns || 1));
                defender.addTaunt(turns);
                this.ui.addLog(`${attackerLabel} wirkt ${card.name} (Taunt ${turns})`, sourceLog);
                return;
            }

            if (card.special.kind === "draw_engine") {
                const drawCount = Math.max(1, Math.floor(card.special.draw || 1));
                const deck = isPlayer ? this.playerDeck : this.aiDeck;
                const drawn = this.drawCardsForEffect(attacker, deck, drawCount);
                if (isPlayer && drawn > 0) {
                    this.trackProgress("cardsDrawn", drawn);
                }
                this.ui.addLog(`${attackerLabel} aktiviert ${card.name} (+${drawn} Karten)`, sourceLog);
            }
        }

        resolveCardEffect(card, source) {
            const isPlayer = source === "player";
            const attacker = isPlayer ? this.player : this.enemy;
            const defender = isPlayer ? this.enemy : this.player;
            const attackerLabel = isPlayer ? "Spieler" : this.getEnemyDisplayName();
            const sourceLog = isPlayer ? "player" : this.getAiLogSource();
            const side = isPlayer ? "player" : "ai";
            const comboBonus = this.applyComboForCard(card, side);
            this.trackCardSchoolForSide(side, card);
            const synergyBonus = this.getCardSynergyBonus(card, side);

            if (card.damage) {
                const aiDamageBonus = isPlayer ? 0 : this.getBossPhaseBonus("damage");
                const damageValue = this.getModifiedDamage(card.damage) + comboBonus + aiDamageBonus + synergyBonus.bonusDamage;
                const damageResult = defender.receiveDamage(damageValue);
                const damageDealt = damageResult.dealt;
                const defenderSide = isPlayer ? "enemy" : "player";
                if (isPlayer && damageDealt > 0) {
                    this.trackProgress("damageDealt", damageDealt);
                }
                const critical = damageDealt >= 10;
                if (isPlayer) {
                    this.ui.blink(this.ui.enemyHP, critical ? "crit" : "hit");
                } else {
                    this.ui.blink(this.ui.playerHP, critical ? "crit" : "hit");
                    this.ui.showMessage(`${this.getEnemyDisplayName()} spielt ${card.name}`, 1500);
                }
                this.ui.addDamageLog(defenderSide, card.name, damageDealt);
                this.ui.showActorImpact(
                    defenderSide,
                    damageDealt,
                    critical ? "crit" : "hit",
                    critical ? `KRIT! -${damageDealt}` : ""
                );
                this.playImpactSound(critical ? "crit" : "hit");
                if (damageResult.shieldBroken) {
                    this.ui.showActorImpact(defenderSide, 0, "shieldbreak", "SHIELD BREAK!");
                    this.playImpactSound("shieldbreak");
                }
                this.ui.addLog(`${attackerLabel} spielt ${card.name} (${damageDealt} Schaden)`, sourceLog);
                if (critical) {
                    this.ui.addLog(`Kritischer Treffer von ${attackerLabel}!`, sourceLog);
                }
                if (comboBonus > 0) {
                    this.ui.addLog(`${attackerLabel} aktiviert Feuer-Kombo (+${comboBonus} Schaden)`, sourceLog);
                }
                if (isPlayer) {
                    this.maybeTriggerCampaignBossPhase();
                }
            }

            if (card.heal) {
                const aiHealBonus = isPlayer ? 0 : this.getBossPhaseBonus("heal");
                const healValue = this.getModifiedHeal(card.heal) + aiHealBonus + synergyBonus.bonusHeal;
                attacker.receiveHeal(healValue);
                this.ui.showActorImpact(isPlayer ? "player" : "enemy", healValue, "heal");
                this.playImpactSound("heal");
                if (isPlayer) {
                    this.ui.blink(this.ui.playerHP, "heal");
                } else {
                    this.ui.blink(this.ui.enemyHP, "heal");
                    this.ui.showMessage(`${this.getEnemyDisplayName()} heilt sich um ${healValue}`, 1500);
                }
                this.ui.addLog(`${attackerLabel} heilt sich um ${healValue}`, sourceLog);
            }

            if (card.shield) {
                const aiShieldBonus = isPlayer ? 0 : this.getBossPhaseBonus("shield");
                const shieldValue = this.getModifiedShield(card.shield) + aiShieldBonus + synergyBonus.bonusShield;
                attacker.addShield(shieldValue);
                this.ui.addLog(`${attackerLabel} erhält ${shieldValue} Schild`, sourceLog);
            }

            if (card.status) {
                this.applyCardStatus(defender, card, attackerLabel, sourceLog, synergyBonus);
            }

            if (card.type === "special") {
                this.applySpecialEffect(card, attacker, defender, attackerLabel, sourceLog, isPlayer, synergyBonus);
            }

            if (synergyBonus.active && synergyBonus.rule?.description) {
                this.ui.addLog(`${attackerLabel} aktiviert Synergie: ${synergyBonus.rule.description}`, sourceLog);
            }
            if (synergyBonus.schoolActive && synergyBonus.schoolRule?.description) {
                this.ui.addLog(`${attackerLabel} aktiviert ${synergyBonus.schoolRule.description}`, sourceLog);
            }

            this.setLastActionForSide(side, this.getCardActionTag(card));
        }
    }

    const ui = new UI();
    const aiController = new AIController();
    new GameEngine(ui, aiController);
})();
