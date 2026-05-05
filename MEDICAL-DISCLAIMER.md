# Medical Disclaimer

This software is **not medical advice**. It is an educational rules engine
that produces general supplement and lab-screening suggestions based on
answers to a structured questionnaire. It is not a substitute for
diagnosis, treatment, or care from a qualified clinician.

**The engine is not clinically validated.** It has not been evaluated by
any regulatory body. It is not FDA-approved, MHRA-registered, or CE-marked
as a medical device. It is published as an educational artifact and as a
research-grade rules base.

**Do not act on output from this engine without consulting a qualified
healthcare professional.** This is especially important if you:

- Are pregnant, planning pregnancy, or breastfeeding
- Are under 18 or over 80
- Are taking prescription medications, including blood thinners,
  anti-platelet agents (including daily aspirin/NSAIDs), SSRIs or other
  serotonergic medications, glucose-lowering agents, statins, thyroid
  medications, or immunosuppressants
- Have a diagnosed condition affecting the kidneys, liver, thyroid,
  heart, blood, or immune system
- Have any active symptoms that could indicate a serious or
  time-sensitive condition

**Red-flag symptoms require immediate clinical attention, not
supplements.** If you have new chest pain, blood in stool or urine,
unexplained weight loss, suicidal thoughts, severe persistent or sudden
"worst headache of life," sudden weakness/numbness/vision change/slurred
speech, a new breast lump, or persistent fever, contact emergency
services or your doctor — do not consult a supplement engine.

**Supplements are not regulated as drugs.** Quality, identity, and dose
accuracy vary by manufacturer. Even a well-evidenced supplement
recommendation can fail in practice if the product taken is mislabeled,
adulterated, or contaminated. The engine's `qualityRequirements` field
identifies preferred third-party certifications (USP Verified, NSF
Certified, NSF Certified for Sport, Informed Sport, Informed Choice,
third-party CoA), but it cannot guarantee the quality of any specific
product you purchase.

**Drug-supplement interactions are an active area of research.** The
engine encodes 20 anticoagulant interaction guards and additional
guards for serotonergic medications, glucose-lowering agents, statins,
and thyroid medications. There are thousands of theoretical
pairings; the engine encodes the ones with meaningful clinical signal.
The absence of an exclusion in the engine does not mean a combination
is safe.

**Lab recommendations require a clinician.** The engine produces a
personalised lab discussion sheet anchored to USPSTF, AAFP, ATA,
Endocrine Society, ADA, ACC/AHA, ACG, AAAAI, ASRM, ACOG, KDIGO, AASLD,
NICE, ESC, and BSH guidelines. The output is informational, intended to
support a conversation with a clinician — not a prescription, ordering
authority, or diagnostic interpretation.

**Use at your own risk.** Apache License 2.0 disclaims warranties to the
fullest extent permitted by law. The maintainers, contributors, and
operators of any deployed instance of this engine accept no liability
for outcomes arising from its use.

If you build a product on top of this engine, you are responsible for
ensuring that product complies with the medical-device, advertising,
data-protection, and consumer-protection laws of every jurisdiction in
which it operates.

---

If you are a clinician and you find an error in the rules, citations,
exclusions, or safety guards, please open an issue or PR. That is the
single most valuable contribution this project can receive.
