# -*- coding: utf-8 -*-
"""Filter GRE-WORD-REVIEW.xlsx into a detailed Traditional Chinese GRE vocab MD."""
from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent
XLSX = ROOT / "GRE-WORD-REVIEW.xlsx"
OUT = ROOT / "GRE vocabulary.md"

WORD_RE = re.compile(r"^[A-Za-z][A-Za-z\-']*$")
PHRASE_RE = re.compile(
    r"^[A-Za-z][A-Za-z\-']*(?:\s+(?:[A-Za-z][A-Za-z\-']*|but|of|to|in|for|all|your|the|a|an)){1,4}$"
)
PHRASE_ALLOW = {
    "anything but",
    "butt in",
    "by virtue of",
    "for all",
    "hew to",
    "in eclipse",
    "in tenor of",
    "irrespective of",
    "meant to be",
    "no mean feat",
    "above board",
}
LIST_RE = re.compile(r"^List\s*\d+$", re.I)
HAS_HAN = re.compile(r"[\u4e00-\u9fff]")

SOURCE_TRAD = {
    "红宝书": "紅寶書",
    "复习词": "複習詞",
    "重要词": "重要詞",
    "救命800": "救命800",
    "GRE3000": "GRE3000",
    "填空1300": "填空1300",
}

# Classic GRE / academic antonym seeds (lemma → antonyms)
GRE_ANTONYMS: dict[str, list[str]] = {
    "abate": ["intensify", "increase", "amplify"],
    "abjure": ["embrace", "affirm"],
    "abolish": ["establish", "institute"],
    "abridge": ["expand", "extend"],
    "abstain": ["indulge", "partake"],
    "abundant": ["scarce", "sparse"],
    "acclaim": ["criticize", "denounce"],
    "acquiesce": ["resist", "oppose"],
    "acute": ["dull", "chronic"],
    "adulation": ["criticism", "censure"],
    "adversary": ["ally", "supporter"],
    "advocate": ["oppose", "criticize"],
    "aesthetic": ["unaesthetic"],
    "affable": ["surly", "aloof"],
    "affinity": ["aversion", "disgust"],
    "affluent": ["destitute", "impoverished"],
    "aggravate": ["alleviate", "mitigate"],
    "aggregate": ["disperse", "separate"],
    "agile": ["clumsy", "awkward"],
    "alleviate": ["aggravate", "exacerbate"],
    "aloof": ["friendly", "approachable"],
    "altruistic": ["selfish", "egoistic"],
    "ambiguous": ["clear", "unambiguous"],
    "ambivalent": ["decisive", "certain"],
    "ameliorate": ["worsen", "exacerbate"],
    "amiable": ["hostile", "unfriendly"],
    "amorphous": ["structured", "definite"],
    "anachronistic": ["contemporary", "timely"],
    "analogous": ["dissimilar", "unrelated"],
    "animosity": ["friendship", "goodwill"],
    "anomaly": ["normality", "regularity"],
    "antagonistic": ["friendly", "supportive"],
    "antipathy": ["affinity", "sympathy"],
    "apathy": ["enthusiasm", "interest"],
    "appease": ["provoke", "agitate"],
    "apprehensive": ["confident", "calm"],
    "arbitrary": ["reasoned", "systematic"],
    "arduous": ["easy", "effortless"],
    "articulate": ["inarticulate", "mute"],
    "ascetic": ["hedonistic", "indulgent"],
    "assuage": ["intensify", "aggravate"],
    "astute": ["naive", "obtuse"],
    "attenuate": ["strengthen", "intensify"],
    "audacious": ["timid", "cautious"],
    "austere": ["luxurious", "indulgent"],
    "authentic": ["fake", "spurious"],
    "autonomous": ["dependent", "subordinate"],
    "avarice": ["generosity", "liberality"],
    "aversion": ["affinity", "liking"],
    "banal": ["original", "fresh"],
    "belie": ["confirm", "corroborate"],
    "benevolent": ["malevolent", "malicious"],
    "benign": ["malignant", "hostile"],
    "biased": ["impartial", "unbiased"],
    "blatant": ["subtle", "concealed"],
    "bolster": ["undermine", "weaken"],
    "bombastic": ["understated", "modest"],
    "brevity": ["verbosity", "length"],
    "cacophony": ["harmony", "euphony"],
    "candid": ["evasive", "guarded"],
    "capricious": ["steady", "consistent"],
    "caustic": ["gentle", "kind"],
    "censure": ["praise", "commend"],
    "chicanery": ["honesty", "integrity"],
    "circumscribe": ["expand", "free"],
    "circumspect": ["reckless", "rash"],
    "clandestine": ["open", "overt"],
    "coalesce": ["separate", "disperse"],
    "coerce": ["persuade", "coax"],
    "cogent": ["unconvincing", "weak"],
    "commensurate": ["disproportionate"],
    "complacent": ["concerned", "vigilant"],
    "complementary": ["contradictory"],
    "compliant": ["defiant", "rebellious"],
    "conciliate": ["provoke", "antagonize"],
    "concise": ["verbose", "prolix"],
    "condone": ["condemn", "censure"],
    "conflagration": ["drizzle", "trickle"],
    "congenial": ["disagreeable", "hostile"],
    "conscientious": ["careless", "negligent"],
    "consensus": ["disagreement", "discord"],
    "conspicuous": ["inconspicuous", "hidden"],
    "constrain": ["free", "liberate"],
    "contentious": ["agreeable", "pacific"],
    "contrite": ["unrepentant", "defiant"],
    "convoluted": ["straightforward", "simple"],
    "corroborate": ["contradict", "refute"],
    "credulous": ["skeptical", "wary"],
    "cursory": ["thorough", "meticulous"],
    "daunt": ["encourage", "embolden"],
    "debilitate": ["strengthen", "fortify"],
    "decorous": ["improper", "indecorous"],
    "deferential": ["disrespectful", "arrogant"],
    "deleterious": ["beneficial", "salutary"],
    "demur": ["accept", "agree"],
    "denounce": ["praise", "commend"],
    "deplete": ["replenish", "augment"],
    "deride": ["praise", "respect"],
    "derivative": ["original", "innovative"],
    "desiccate": ["moisten", "hydrate"],
    "desultory": ["methodical", "focused"],
    "deter": ["encourage", "incite"],
    "detrimental": ["beneficial", "advantageous"],
    "devious": ["straightforward", "honest"],
    "didactic": ["undidactic"],
    "diffident": ["confident", "bold"],
    "diffuse": ["concentrated", "focused"],
    "dilatory": ["prompt", "punctual"],
    "diligent": ["lazy", "negligent"],
    "discernible": ["imperceptible", "obscure"],
    "discord": ["harmony", "concord"],
    "discreet": ["indiscreet", "blatant"],
    "discrete": ["continuous", "connected"],
    "disparage": ["praise", "commend"],
    "disparate": ["similar", "alike"],
    "dispassionate": ["emotional", "biased"],
    "disseminate": ["withhold", "suppress"],
    "dissent": ["agree", "concur"],
    "dissipate": ["accumulate", "gather"],
    "dissonance": ["harmony", "consonance"],
    "divergent": ["convergent", "similar"],
    "docile": ["obstinate", "rebellious"],
    "dogmatic": ["flexible", "open-minded"],
    "dormant": ["active", "awakened"],
    "dubious": ["certain", "reliable"],
    "duplicitous": ["honest", "candid"],
    "ebullient": ["apathetic", "listless"],
    "eclectic": ["narrow", "exclusive"],
    "efficacy": ["inefficacy", "ineffectiveness"],
    "effrontery": ["modesty", "deference"],
    "elegy": ["paean", "encomium"],
    "elicit": ["suppress", "stifle"],
    "eloquent": ["inarticulate", "tongue-tied"],
    "elusive": ["obvious", "accessible"],
    "emulate": ["ignore", "shun"],
    "enervate": ["invigorate", "strengthen"],
    "engender": ["destroy", "extinguish"],
    "enhance": ["diminish", "impair"],
    "enigma": ["clarity", "certainty"],
    "enmity": ["friendship", "amity"],
    "ephemeral": ["permanent", "enduring"],
    "equanimity": ["agitation", "anxiety"],
    "equivocal": ["clear", "unambiguous"],
    "erratic": ["steady", "consistent"],
    "erudite": ["ignorant", "unenlightened"],
    "esoteric": ["accessible", "commonplace"],
    "eulogy": ["invective", "condemnation"],
    "euphemism": ["dysphemism"],
    "exacerbate": ["alleviate", "mitigate"],
    "exculpate": ["incriminate", "accuse"],
    "exemplary": ["unworthy", "deplorable"],
    "exonerate": ["convict", "incriminate"],
    "expedient": ["imprudent", "unwise"],
    "explicit": ["implicit", "vague"],
    "extant": ["extinct", "lost"],
    "extol": ["criticize", "denounce"],
    "extraneous": ["essential", "relevant"],
    "extricate": ["entangle", "ensnare"],
    "exuberant": ["restrained", "subdued"],
    "facilitate": ["hinder", "obstruct"],
    "fallacious": ["valid", "sound"],
    "fanatical": ["moderate", "temperate"],
    "fastidious": ["careless", "sloppy"],
    "fawn": ["insult", "defy"],
    "fervor": ["apathy", "indifference"],
    "fickle": ["constant", "steadfast"],
    "florid": ["plain", "austere"],
    "fluctuate": ["stabilize", "steady"],
    "foolhardy": ["cautious", "prudent"],
    "fortuitous": ["intentional", "planned"],
    "fractious": ["agreeable", "docile"],
    "frugal": ["extravagant", "wasteful"],
    "garrulous": ["taciturn", "reticent"],
    "germane": ["irrelevant", "extraneous"],
    "gregarious": ["solitary", "unsociable"],
    "guile": ["candor", "honesty"],
    "hackneyed": ["original", "fresh"],
    "harangue": ["praise", "eulogy"],
    "harbinger": ["aftermath", "result"],
    "hedonist": ["ascetic", "puritan"],
    "heterogeneous": ["homogeneous", "uniform"],
    "homogeneous": ["heterogeneous", "varied"],
    "hyperbole": ["understatement"],
    "iconoclast": ["conformist", "traditionalist"],
    "idiosyncrasy": ["norm", "convention"],
    "idolatry": ["iconoclasm"],
    "immutable": ["changeable", "mutable"],
    "impair": ["improve", "enhance"],
    "impassive": ["emotional", "expressive"],
    "impeccable": ["flawed", "faulty"],
    "impede": ["facilitate", "assist"],
    "impervious": ["permeable", "vulnerable"],
    "impetuous": ["cautious", "deliberate"],
    "implacable": ["merciful", "forgiving"],
    "implicit": ["explicit", "stated"],
    "impugn": ["support", "endorse"],
    "inadvertent": ["deliberate", "intentional"],
    "inane": ["meaningful", "sensible"],
    "incongruous": ["compatible", "fitting"],
    "inconsequential": ["important", "significant"],
    "incontrovertible": ["disputable", "doubtful"],
    "incorrigible": ["reformable", "corrigible"],
    "indecorous": ["proper", "decorous"],
    "indifferent": ["concerned", "caring"],
    "indigenous": ["foreign", "alien"],
    "indolent": ["industrious", "diligent"],
    "ineffable": ["expressible", "describable"],
    "inert": ["active", "dynamic"],
    "inevitable": ["avoidable", "uncertain"],
    "inexorable": ["flexible", "yielding"],
    "ingenious": ["unimaginative", "clumsy"],
    "ingenuous": ["disingenuous", "artful"],
    "inherent": ["extrinsic", "acquired"],
    "innocuous": ["harmful", "dangerous"],
    "insipid": ["flavorful", "exciting"],
    "insular": ["cosmopolitan", "broad-minded"],
    "intractable": ["manageable", "tractable"],
    "intransigent": ["compromising", "flexible"],
    "intrepid": ["timid", "cowardly"],
    "inundate": ["drain", "deplete"],
    "inure": ["sensitize"],
    "invective": ["praise", "eulogy"],
    "irascible": ["calm", "placid"],
    "ironic": ["sincere", "literal"],
    "irresolute": ["decisive", "resolute"],
    "itinerant": ["settled", "stationary"],
    "jargon": ["plain language"],
    "jettison": ["retain", "keep"],
    "jovial": ["morose", "gloomy"],
    "judicious": ["foolish", "imprudent"],
    "laconic": ["verbose", "wordy"],
    "lament": ["celebrate", "rejoice"],
    "laud": ["criticize", "censure"],
    "lavish": ["sparing", "meager"],
    "lethargic": ["energetic", "vivacious"],
    "levity": ["seriousness", "gravity"],
    "lucid": ["obscure", "confused"],
    "luminous": ["dim", "dull"],
    "magnanimous": ["petty", "mean"],
    "maladroit": ["skillful", "adept"],
    "malevolent": ["benevolent", "kind"],
    "malleable": ["rigid", "inflexible"],
    "maverick": ["conformist"],
    "mendacious": ["truthful", "honest"],
    "mercurial": ["steady", "constant"],
    "meticulous": ["careless", "sloppy"],
    "misanthrope": ["philanthropist"],
    "mitigate": ["aggravate", "exacerbate"],
    "mollify": ["provoke", "agitate"],
    "morose": ["cheerful", "jovial"],
    "mundane": ["extraordinary", "unusual"],
    "munificent": ["stingy", "miserly"],
    "naive": ["sophisticated", "worldly"],
    "nascent": ["mature", "waning"],
    "nebulous": ["clear", "definite"],
    "nefarious": ["virtuous", "honorable"],
    "negligent": ["careful", "diligent"],
    "neophyte": ["veteran", "expert"],
    "noisome": ["pleasant", "fragrant"],
    "nonchalant": ["anxious", "concerned"],
    "novel": ["familiar", "hackneyed"],
    "noxious": ["beneficial", "harmless"],
    "obdurate": ["flexible", "yielding"],
    "obfuscate": ["clarify", "elucidate"],
    "objective": ["subjective", "biased"],
    "obsequious": ["assertive", "domineering"],
    "obsolete": ["current", "modern"],
    "obstinate": ["compliant", "flexible"],
    "obviate": ["necessitate", "require"],
    "occlude": ["open", "clear"],
    "opaque": ["transparent", "clear"],
    "opprobrium": ["praise", "acclaim"],
    "oscillate": ["stabilize", "steady"],
    "ostentatious": ["modest", "understated"],
    "ostracize": ["welcome", "include"],
    "overt": ["covert", "hidden"],
    "pacify": ["provoke", "agitate"],
    "paean": ["dirge", "elegy"],
    "parsimonious": ["generous", "lavish"],
    "partisan": ["impartial", "neutral"],
    "pathos": ["humor", "levity"],
    "paucity": ["abundance", "plenty"],
    "pedantic": ["unscholarly", "casual"],
    "pejorative": ["complimentary", "laudatory"],
    "penchant": ["aversion", "dislike"],
    "penury": ["wealth", "affluence"],
    "perfunctory": ["thorough", "careful"],
    "peripheral": ["central", "essential"],
    "permeable": ["impermeable", "impervious"],
    "pernicious": ["beneficial", "harmless"],
    "perpetual": ["temporary", "fleeting"],
    "pervasive": ["limited", "localized"],
    "philanthropy": ["misanthropy"],
    "phlegmatic": ["excitable", "emotional"],
    "pious": ["impious", "irreverent"],
    "placate": ["provoke", "enrage"],
    "plasticity": ["rigidity", "inflexibility"],
    "platitude": ["originality", "insight"],
    "plethora": ["dearth", "scarcity"],
    "pragmatic": ["idealistic", "impractical"],
    "precipitous": ["gradual", "gentle"],
    "preclude": ["allow", "permit"],
    "precocious": ["backward", "slow"],
    "predilection": ["aversion", "dislike"],
    "prevaricate": ["speak frankly"],
    "pristine": ["spoiled", "tainted"],
    "probity": ["dishonesty", "corruption"],
    "prodigal": ["frugal", "thrifty"],
    "prodigious": ["ordinary", "unremarkable"],
    "profound": ["superficial", "shallow"],
    "proliferate": ["decrease", "dwindle"],
    "prolific": ["unproductive", "barren"],
    "propensity": ["aversion", "disinclination"],
    "propitiate": ["provoke", "antagonize"],
    "propriety": ["impropriety", "indecorum"],
    "prosaic": ["poetic", "imaginative"],
    "proscribe": ["permit", "allow"],
    "protagonist": ["antagonist", "opponent"],
    "prudent": ["reckless", "imprudent"],
    "pugnacious": ["peaceable", "amiable"],
    "punctilious": ["careless", "lax"],
    "quiescent": ["active", "turbulent"],
    "quixotic": ["practical", "realistic"],
    "rancor": ["goodwill", "amity"],
    "rarefied": ["commonplace", "dense"],
    "recalcitrant": ["compliant", "obedient"],
    "recant": ["affirm", "maintain"],
    "recluse": ["socialite", "extrovert"],
    "recondite": ["accessible", "simple"],
    "refractory": ["manageable", "obedient"],
    "refute": ["confirm", "corroborate"],
    "relegate": ["promote", "elevate"],
    "remonstrate": ["agree", "acquiesce"],
    "renounce": ["embrace", "claim"],
    "replete": ["empty", "depleted"],
    "reprehensible": ["praiseworthy", "admirable"],
    "repress": ["express", "release"],
    "repudiate": ["accept", "acknowledge"],
    "rescind": ["enact", "confirm"],
    "reserved": ["outgoing", "demonstrative"],
    "reticent": ["talkative", "garrulous"],
    "reverent": ["irreverent", "disrespectful"],
    "rhetoric": ["plain speech"],
    "rigorous": ["lax", "lenient"],
    "robust": ["fragile", "weak"],
    "sagacious": ["foolish", "naive"],
    "salient": ["inconspicuous", "minor"],
    "sanction": ["prohibit", "forbid"],
    "satiate": ["starve", "deprive"],
    "secular": ["religious", "sacred"],
    "sedulous": ["lazy", "careless"],
    "serene": ["agitated", "turbulent"],
    "servile": ["domineering", "assertive"],
    "skeptical": ["credulous", "gullible"],
    "solicitous": ["indifferent", "unconcerned"],
    "soporific": ["stimulating", "invigorating"],
    "sparse": ["dense", "abundant"],
    "specious": ["valid", "genuine"],
    "sporadic": ["constant", "frequent"],
    "spurious": ["genuine", "authentic"],
    "stolid": ["emotional", "excitable"],
    "stringent": ["lenient", "lax"],
    "stymie": ["assist", "facilitate"],
    "submissive": ["domineering", "assertive"],
    "substantiate": ["disprove", "refute"],
    "subversive": ["loyal", "supportive"],
    "succinct": ["verbose", "wordy"],
    "superfluous": ["necessary", "essential"],
    "supplant": ["preserve", "retain"],
    "surreptitious": ["overt", "open"],
    "sycophant": ["critic", "detractor"],
    "tacit": ["explicit", "spoken"],
    "taciturn": ["talkative", "garrulous"],
    "tangential": ["relevant", "central"],
    "tenacious": ["yielding", "irresolute"],
    "tenuous": ["strong", "substantial"],
    "timorous": ["bold", "courageous"],
    "tirade": ["eulogy", "encomium"],
    "torpor": ["energy", "vitality"],
    "tortuous": ["direct", "straightforward"],
    "tractable": ["stubborn", "intractable"],
    "transient": ["permanent", "lasting"],
    "transparent": ["opaque", "obscure"],
    "treacherous": ["loyal", "faithful"],
    "trite": ["original", "fresh"],
    "truculent": ["gentle", "amiable"],
    "ubiquitous": ["rare", "scarce"],
    "unalloyed": ["mixed", "impure"],
    "unassailable": ["vulnerable", "weak"],
    "uncanny": ["ordinary", "familiar"],
    "unconventional": ["conventional", "orthodox"],
    "undermine": ["support", "bolster"],
    "underscore": ["understate", "downplay"],
    "unequivocal": ["ambiguous", "vague"],
    "unflappable": ["agitated", "nervous"],
    "unorthodox": ["orthodox", "conventional"],
    "unprecedented": ["common", "familiar"],
    "unwarranted": ["justified", "warranted"],
    "upbraid": ["praise", "commend"],
    "urbane": ["rustic", "uncouth"],
    "vacillate": ["decide", "resolve"],
    "vapid": ["lively", "stimulating"],
    "venerate": ["despise", "scorn"],
    "veracity": ["falsehood", "deceit"],
    "verbose": ["concise", "succinct"],
    "viable": ["unworkable", "impractical"],
    "vilify": ["praise", "extol"],
    "vindicate": ["blame", "convict"],
    "virtuoso": ["amateur", "novice"],
    "vitriolic": ["mild", "kind"],
    "volatile": ["stable", "steady"],
    "voracious": ["indifferent", "satiated"],
    "wary": ["trusting", "careless"],
    "whimsical": ["serious", "practical"],
    "zealous": ["apathetic", "indifferent"],
}

try:
    from opencc import OpenCC  # type: ignore

    _cc = OpenCC("s2t")

    def to_trad(s: str) -> str:
        return _cc.convert(s) if s else s

except Exception:

    def to_trad(s: str) -> str:
        return s


def clean(s) -> str:
    if s is None or (isinstance(s, float) and pd.isna(s)):
        return ""
    t = str(s).strip()
    if t.lower() in ("nan", "none"):
        return ""
    return t


def is_en_word(s: str, allow_phrase: bool = False) -> bool:
    if not s or LIST_RE.match(s):
        return False
    if s.lower() in ("生词", "英文单词", "形近词总结-mewow"):
        return False
    if WORD_RE.match(s):
        return True
    if allow_phrase and s.lower() in PHRASE_ALLOW and PHRASE_RE.match(s):
        return True
    return False


def normalize_lemma(raw: str) -> str:
    s = clean(raw)
    if not s:
        return ""
    s = s.replace("·", "").replace("•", "")
    s = re.split(r"[\u4e00-\u9fff]", s, maxsplit=1)[0].strip()
    if not s:
        return ""
    if is_en_word(s, allow_phrase=True):
        return s
    m = re.match(r"^([A-Za-z][A-Za-z\-']*)", s)
    if m and is_en_word(m.group(1), allow_phrase=False):
        return m.group(1)
    return ""


def parse_pair_grid(df: pd.DataFrame) -> dict[str, tuple[str, str]]:
    out: dict[str, tuple[str, str]] = {}
    for _, row in df.iterrows():
        vals = [clean(row[c]) for c in df.columns]
        i = 0
        while i < len(vals) - 1:
            a, b = vals[i], vals[i + 1]
            if is_en_word(a, allow_phrase=False) and HAS_HAN.search(b or ""):
                key = a.lower()
                prev = out.get(key)
                if prev is None or len(b) > len(prev[1]):
                    out[key] = (a, b)
                i += 2
                continue
            i += 1
    return out


def parse_jiuming800(df: pd.DataFrame) -> dict[str, dict]:
    cols = list(df.columns)
    records: dict[str, dict] = {}
    for _, row in df.iterrows():
        en = normalize_lemma(row[cols[1]] if len(cols) > 1 else "")
        zh = clean(row[cols[2]] if len(cols) > 2 else "")
        endef = clean(row[cols[3]] if len(cols) > 3 else "")
        ex = clean(row[cols[4]] if len(cols) > 4 else "")
        syn = clean(row[cols[5]] if len(cols) > 5 else "")
        der = clean(row[cols[6]] if len(cols) > 6 else "")
        if not en:
            continue
        key = en.lower()
        score = sum(bool(x) for x in (zh, endef, ex, syn, der))
        prev = records.get(key)
        if prev and prev.get("_score", 0) >= score:
            continue
        records[key] = {
            "en": en,
            "zh": zh,
            "endef": endef,
            "example": ex,
            "synonyms": syn,
            "derivatives": der,
            "_score": score,
            "sources": {"救命800"},
        }
    return records


def parse_xingjin(df: pd.DataFrame) -> list[list[str]]:
    groups: list[list[str]] = []
    for _, row in df.iterrows():
        cells = [clean(row[c]) for c in df.columns]
        items = []
        for c in cells:
            if not c or "未经" in c or "形近词" in c:
                continue
            m = re.match(r"^([A-Za-z][A-Za-z\-']*)\b(.*)$", c)
            if m:
                items.append(c)
        if len(items) >= 2:
            groups.append(items)
    return groups


def merge_glosses(base: dict[str, dict], pairs: dict[str, tuple[str, str]], source: str):
    for key, (en, zh) in pairs.items():
        if key in base:
            base[key]["sources"].add(source)
            cur = base[key].get("zh") or ""
            if zh and (not cur or len(zh) >= len(cur)):
                if not cur or len(zh) > len(cur) or re.match(r"^[nvadj]+\.", zh, re.I):
                    base[key]["zh"] = zh if (not cur or len(zh) >= len(cur)) else cur
            continue
        base[key] = {
            "en": en,
            "zh": zh,
            "endef": "",
            "example": "",
            "synonyms": "",
            "derivatives": "",
            "_score": 1,
            "sources": {source},
        }


def split_syn_ant(syn_field: str) -> tuple[str, str]:
    if not syn_field:
        return "", ""
    ant = ""
    syn = syn_field
    for pat in (r"[Aa]nt(?:onym)?s?\s*[:：]\s*(.+)$", r"反[义词]*\s*[:：]\s*(.+)$"):
        m = re.search(pat, syn_field)
        if m:
            ant = m.group(1).strip()
            syn = re.sub(pat, "", syn_field).strip(" ,;；、")
            break
    return syn, ant


def wordnet_antonyms(lemma: str) -> list[str]:
    try:
        from nltk.corpus import wordnet as wn  # type: ignore
    except Exception:
        return []
    out: set[str] = set()
    for synset in wn.synsets(lemma):
        for lem in synset.lemmas():
            for ant in lem.antonyms():
                name = ant.name().replace("_", " ")
                if name.lower() != lemma.lower():
                    out.add(name)
    return sorted(out)


def collect_antonyms(lemma: str, syn_field: str) -> str:
    key = lemma.lower()
    found: list[str] = []
    seen: set[str] = set()

    def add_many(items: list[str]):
        for x in items:
            x = x.strip()
            if not x:
                continue
            lk = x.lower()
            if lk == key or lk in seen:
                continue
            seen.add(lk)
            found.append(x)

    add_many(GRE_ANTONYMS.get(key, []))
    add_many(wordnet_antonyms(key))

    # chain: antonyms of listed synonyms
    for part in re.split(r"[,;/；、]", syn_field or ""):
        token = part.strip()
        m = re.match(r"^([A-Za-z][A-Za-z\-']*)", token)
        if not m:
            continue
        syn = m.group(1)
        add_many(GRE_ANTONYMS.get(syn.lower(), []))
        add_many(wordnet_antonyms(syn))

    return ", ".join(found[:8])


def source_label(name: str) -> str:
    return SOURCE_TRAD.get(name, to_trad(name))


def letter_section(en: str) -> str:
    ch = en[0].upper()
    return ch if ch.isalpha() else "#"


def field_or_na(value: str, na: str = "（原表未提供）") -> str:
    v = (value or "").strip()
    return v if v else na


def build() -> None:
    xl = pd.ExcelFile(XLSX)
    base: dict[str, dict] = {}

    df800 = pd.read_excel(xl, sheet_name="救命800")
    base.update(parse_jiuming800(df800))

    for sheet in ("GRE3000", "填空1300", "红宝书", "重要词", "复习词"):
        df = pd.read_excel(xl, sheet_name=sheet)
        pairs = parse_pair_grid(df)
        merge_glosses(base, pairs, sheet)

    xj = pd.read_excel(xl, sheet_name="形近词")
    lookalike = parse_xingjin(xj)

    look_map: dict[str, list[str]] = defaultdict(list)
    for g in lookalike:
        heads = []
        for item in g:
            m = re.match(r"^([A-Za-z][A-Za-z\-']*)", item)
            if m:
                heads.append(m.group(1))
        for h in heads:
            look_map[h.lower()] = g

    drop_keys = []
    for k, v in base.items():
        en = v["en"]
        if len(en) < 2:
            drop_keys.append(k)
            continue
        if not v.get("zh") and not v.get("endef"):
            drop_keys.append(k)
    for k in drop_keys:
        del base[k]

    items = sorted(base.values(), key=lambda x: x["en"].lower())

    # Enrich antonyms
    ant_filled = 0
    for rec in items:
        syn_raw = rec.get("synonyms", "")
        syn, ant_inline = split_syn_ant(syn_raw)
        rec["synonyms"] = syn
        ant = ant_inline or collect_antonyms(rec["en"], syn)
        rec["antonyms"] = ant
        if ant:
            ant_filled += 1

    detailed = sum(
        1 for x in items if x.get("endef") or x.get("example") or x.get("synonyms")
    )
    sources_count = defaultdict(int)
    for x in items:
        for s in x["sources"]:
            sources_count[s] += 1

    lines: list[str] = []
    lines.append("# GRE 單字清單（整合篩選版）")
    lines.append("")
    lines.append("> 來源：`GRE-WORD-REVIEW.xlsx`（多工作表去重整合）  ")
    lines.append("> 篩選：去除空白／非詞條；合併同 lemma；以「救命800」為詳情主來源，其餘表補中文義  ")
    lines.append("> 說明：全文繁體；每詞固定欄位（缺資料標「原表未提供」）；反義詞由 GRE 對照表＋WordNet 補齊  ")
    lines.append(
        f"> 詞條數：**{len(items)}**（較完整詳情約 **{detailed}**；已標反義詞約 **{ant_filled}**）"
    )
    lines.append("")
    lines.append("## 來源覆蓋")
    lines.append("")
    for s, n in sorted(sources_count.items(), key=lambda kv: -kv[1]):
        lines.append(f"- {source_label(s)}：{n} 詞（含與他表重疊）")
    lines.append("")
    lines.append("---")
    lines.append("")

    current = ""
    for rec in items:
        sec = letter_section(rec["en"])
        if sec != current:
            current = sec
            lines.append(f"## {current}")
            lines.append("")

        en = rec["en"]
        zh = to_trad(rec.get("zh", ""))
        endef = rec.get("endef", "")
        example = rec.get("example", "")
        syn = rec.get("synonyms", "")
        ant = rec.get("antonyms", "")
        der = rec.get("derivatives", "")
        if HAS_HAN.search(example or ""):
            example = to_trad(example)
        if HAS_HAN.search(syn or ""):
            syn = to_trad(syn)
        if HAS_HAN.search(der or ""):
            der = to_trad(der)

        la = look_map.get(en.lower())
        la_txt = ""
        if la:
            la_txt = " ｜ ".join(to_trad(x) if HAS_HAN.search(x) else x for x in la)

        src = "、".join(source_label(s) for s in sorted(rec["sources"]))

        lines.append(f"### {en}")
        lines.append(f"- **中文**：{field_or_na(zh)}")
        lines.append(f"- **英文釋義**：{field_or_na(endef)}")
        lines.append(f"- **用法／例句／詞組**：{field_or_na(example)}")
        lines.append(f"- **相似詞／近義**：{field_or_na(syn)}")
        lines.append(f"- **相反詞**：{field_or_na(ant, '（詞庫暫無）')}")
        lines.append(f"- **派生詞**：{field_or_na(der)}")
        lines.append(f"- **形近詞組**：{field_or_na(la_txt)}")
        lines.append(f"- **來源**：{src}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## 附錄｜形近詞分組")
    lines.append("")
    lines.append("整理自工作表「形近詞」，便於對照易混拼寫。")
    lines.append("")
    for i, g in enumerate(lookalike, 1):
        lines.append(
            f"{i}. "
            + " ｜ ".join(to_trad(x) if HAS_HAN.search(x) else x for x in g)
        )
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 附註")
    lines.append("")
    lines.append("- 反義詞優先取自內建 GRE 對照表，其次 WordNet，並參考近義詞鏈；非原 Excel 欄位。")
    lines.append("- 「GRE3000／紅寶書／填空」等表多為詞＋中文；英文釋義與例句以「救命800」為主。")
    lines.append("- 未自動上網杜撰例句；標「原表未提供」者可另開 enrichment。")
    lines.append("")

    text = "\n".join(lines)
    # Final full-document Traditional conversion (covers leftover simplified)
    text = to_trad(text)
    OUT.write_text(text, encoding="utf-8")
    print(
        f"Wrote {OUT} ({len(items)} entries, detailed~{detailed}, "
        f"antonyms~{ant_filled}, lookalike groups={len(lookalike)})"
    )


if __name__ == "__main__":
    build()
