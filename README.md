# SteelsSystem.github.io
Lex Forensica — Live Archive
 and protocol-o-core repositories.
1. Ecosystem context
This simulator implements a small but fully functional O‑Gate kernel – a decision layer that determines whether a given output (O‑proposition) may be published as “true”, shown only as an internal preview, blocked, or hard‑overridden to O>FALSE. �
Within your GitHub ecosystem it connects these projects: �
protocol-o-core – formal core (axioms, O‑space logic, definition of O(s) and SAT / UNSAT / UNKNOWN states).
CobraLayer – diagnostic and protective layer (anomaly, override, blocking, critical states).
lexforensica – forensic and lexical layer (canonical error and state formulations, engagement, explanation of decisions).
The simulator ties these three lines together in a single visual and experimental artefact. �
2. Purpose of the simulator
The simulator acts as a visual kernel for experimenting with:
four independent verification channels (Structural Integrity, Internal Sequence, External Cross‑Check, Regulatory Protection),
two higher‑priority conditions (anomaly and O>FALSE override),
O‑space mathematics (regularityScore, O(s), vectorMap),
forensic language (LOGIC_ERR, SYS_ERR, REG_ERR, ANOMALY, OVERRIDE),
output modes (PUBLIC OUTPUT, INTERNAL PREVIEW, BLOCKED, CRITICAL ANOMALY, O>FALSE OVERRIDE). �
3. Component architecture
The main React component ProtocolSimulator is organised into several logical blocks: �
State control – manages switches c1–c4 and flags hasAnomaly, isAligning, forceOFalse.
O‑space mathematical modelling – generates historyPoints and computes regularityScore.
Diagnostics & cross‑check – computes vectorMap, O_s and verifies score consistency.
Forensic findings – generates textual explanations of failures and interventions.
Mode resolution – selects the final output mode.
O‑space position – computes the current case position in a 2D representation of O‑space.
Live timestamp – time‑stamps the current simulation run.
Handlers – user interaction (toggling checks, recalibrate, O>FALSE override).
4. State model
4.1 Base checks
The checks state contains four boolean values: �
c1 – Structural Integrity (weight 35)
c2 – Internal Sequence (weight 35)
c3 – External Cross‑Check (weight 15)
c4 – Regulatory Protection (weight 15)
Each check represents an independent verification axis.
4.2 Higher‑priority flags
Two flags have higher priority than any combination of checks: �
hasAnomaly – global interference / anomaly that collapses integrity.
forceOFalse – hard O>FALSE override that zeroes the O‑gate regardless of other inputs.
The auxiliary flag isAligning is used for the “recalibrate” transition (temporary freeze of controls and return to a healthy configuration).
5. O‑space mathematics
5.1 Regularity score
regularityScore is a scalar measure of configuration “health”: �
if hasAnomaly or forceOFalse → regularityScore = 15 (short‑circuit to crisis / override state),
otherwise the weights of active checks are summed: 35 (c1) + 35 (c2) + 15 (c3) + 15 (c4).
This yields a 0–100 scale where 100 means a fully healthy configuration.
5.2 Cross‑check and O(s)
The crossCheck block implements a small Boolean algebra: �
bit variables b1..b4 mirror c1..c4 (1 = true, 0 = false),
vectorMap is a 4‑bit vector (e.g. 0x0F) encoding the check configuration,
logicalProduct = b1 × b2 × b3 × b4 is the pure AND of all checks,
anomalyM = hasAnomaly ? 0 : 1, overrideM = forceOFalse ? 0 : 1,
O(s) is defined as O_s = logicalProduct × anomalyM × overrideM,
expectedScore is the weighted sum of checks,
isValid ensures that regularityScore matches expectedScore (or 15 in anomaly / override cases).
This block keeps the bit pattern and scalar score internally consistent.
6. Forensic / lexical layer
The forensicFindings block produces canonical forensic messages explaining why the system treats a configuration as problematic: �
CRITICAL: Mathematical vector cross-check failed.
OVERRIDE: [O>FALSE] O-Gate zeroed by multiplier = 0.
ANOMALY: Interference detected. Integrity multiplier collapsed to 0.
LOGIC_ERR (Bit 3): Structural integrity s(x) invalid.
LOGIC_ERR (Bit 2): Internal sequence fails logical operation.
SYS_ERR (Bit 1): External hash cross-match failed.
REG_ERR (Bit 0): Regulatory norm (GDPR) non-conformant with space vector.
These messages are the basis for lexforensica: each one can be given a lexicogrammatical profile (e.g. Engagement: proclaim / deny / attribute / entertain).
7. Output modes (mode resolution)
The mode block maps system state to one of five output modes: �
FORCED_FALSE / O>FALSE OVERRIDE – if forceOFalse === true.
CRITICAL ANOMALY – if hasAnomaly === true and no override.
PUBLIC OUTPUT – if crossCheck.O_s === 1 (all checks true, no anomaly / override).
INTERNAL PREVIEW – if checks.c1 && checks.c2 && regularityScore >= 70 while O_s !== 1.
BLOCKED – default branch when none of the above applies.
These modes are the system’s “speech acts”: they define what the protocol is allowed to say about a given O‑proposition.
8. O‑space visualisation
The O‑SPACE POSITION block gives the configuration a geometric representation: �
historyPoints represent past cases distributed around the centre,
currentCasePos places the current case in 2D space:
centred at (50, 50) for isAligning or O_s === 1,
offset proportional to (100 − regularityScore) × 0.4 otherwise.
Distance from the centre thus approximates deviation from the ideal configuration.
9. Repository integration
protocol-o-core – keeps formal definitions of O(s), SAT / UNSAT / UNKNOWN and axioms A5–A13; the simulator acts as a reference implementation of the O‑Gate decision function.
CobraLayer – extends diagnostics, anomaly detection and override behaviour; this document specifies how anomaly and O>FALSE override behave at kernel level.
lexforensica – builds on forensicFindings; each message can be mapped to a lexical / engagement profile, while the simulator serves as a testbed for these mappings. �
Protocol O – Forensic Lex Simulator (CZ)
(Česká verze odpovídá obsahu výše.)
1. Kontext ekosystému
Tento simulátor představuje malý, ale plně funkční O‑Gate kernel – rozhodovací vrstvu, která určuje, zda může být určitý výstup (O‑propozice) publikován jako „pravdivý“, pouze interně náhledový, blokovaný, nebo tvrdě přepsaný na O>FALSE. �
V rámci GitHub ekosystému zapadá takto: �
protocol-o-core – formální jádro (axiomata, logika O‑prostoru, definice O(s) a stavů SAT / UNSAT / UNKNOWN).
CobraLayer – diagnostická a ochranná vrstva (anomaly, override, blokace, kritické stavy).
lexforensica – forenzní a lexikální vrstva (kanonické formulace chyb a stavů, engagement, vysvětlování rozhodnutí).
Simulátor spojuje všechny tři linie do jednoho vizuálního a výukového artefaktu. �
2. Cíl simulátoru
Simulátor slouží jako vizuální kernel pro experimentování s tím, jak se chovají:
čtyři nezávislé kontrolní kanály (Structural Integrity, Internal Sequence, External Cross‑Check, Regulatory Protection),
dvě nadřazené podmínky (anomaly a O>FALSE override),
matematika O‑prostoru (regularityScore, O(s), vectorMap),
forenzní jazyk (LOGIC_ERR, SYS_ERR, REG_ERR, ANOMALY, OVERRIDE),
režimy výstupu (PUBLIC OUTPUT, INTERNAL PREVIEW, BLOCKED, CRITICAL ANOMALY, O>FALSE OVERRIDE). �
(A dál můžeš nechat stejnou českou verzi, kterou jsme právě upravili – sekce 3–9 jsou 1:1 s anglickou částí.)
 bilingual README.
