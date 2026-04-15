export const archiveRecords = [
  {
    serial: "LE-2026-004",
    title: "Probabilistic Memory Router",
    class: "Scaling",
    status: "Technical Post-Mortem",
    objective:
      "This project attempted to design a probabilistic routing layer that allocated latent memory shards to distributed model workers under rapidly shifting token loads. The intention was to reduce synchronization overhead while preserving retrieval quality at cluster scale. We expected confidence-weighted routing to preserve coherence and lower communication latency by avoiding full broadcasts. During benchmark expansion, worker-local confidence calibration diverged from global uncertainty signals, and contention appeared in the exact windows where retrieval precision mattered most. The route planner became unstable under bursty workloads, producing allocation thrashing and degraded throughput. The objective remained compelling, but the implementation could not hold both calibration fidelity and horizontal elasticity at once.",
    bottleneck:
      "P(route_i | x_t) = softmax(W h_t)_i\\n\\nif KL(P_local || P_global) > epsilon:\\n  reassignment_rate -> O(n * m)\\n  lock_contention -> saturation\\n\\nResult: throughput collapse under burst ingress",
    pivot:
      "This dead end now informs my dissertation chapter on calibration-first scaling. I shifted to bounded-assignment windows with delayed global reconciliation, using confidence audits as a gating mechanism before worker migration is allowed."
  },
  {
    serial: "LE-2026-003",
    title: "Constraint-First Topology Compiler",
    class: "Architectural",
    status: "Internal Draft",
    objective:
      "The compiler was initiated to automatically transform research pipelines into constrained execution graphs that guaranteed reproducibility and deterministic rollback behavior. The design intent was to integrate structural validation with deployment templating so that every run produced auditable state transitions. Early prototypes succeeded for shallow dependency trees, and generated plans were readable by collaborators. Failure emerged once recursive task families and exception handlers were introduced. The compiler over-constrained legal transitions and produced brittle execution paths that broke during recovery scenarios. Instead of enabling robust experimentation, the architecture amplified edge-case complexity. The project stalled because strict compile-time guarantees prevented the runtime flexibility needed for real laboratory conditions.",
    bottleneck:
      "G = (V, E)\\nConstraint set C = {c_1 ... c_k}\\n\\nfor v in V:\\n  enforce all c in C on incoming and outgoing edges\\n\\nWhen |C| grows with recovery rules, satisfiable subgraphs -> empty in nontrivial branches",
    pivot:
      "The failed compiler now serves as negative evidence in my current architecture work. I replaced rigid global constraints with layered contracts: static checks for invariants and runtime adapters for exception-heavy branches."
  },
  {
    serial: "LE-2026-002",
    title: "Symbolic Sequence Verifier",
    class: "Theoretical",
    status: "Technical Post-Mortem",
    objective:
      "This verifier was started to prove ordering invariants in adaptive protocol sequences by mapping execution traces into a symbolic constraint space. The objective was to formalize guarantees for asynchronous message handling without requiring full state enumeration. We expected abstraction over transport timing to preserve soundness while making proof generation tractable. In adversarial replay tests, timing-coupled retransmissions violated the abstraction assumptions and produced satisfiable proofs that were invalid in live systems. The tool became epistemically dangerous: fast, elegant, and wrong at exactly the moments where confidence was needed. The theoretical frame remained useful, but its initial abstraction design could not represent temporal interference safely.",
    bottleneck:
      "Assume: send(a) < ack(a) => ordered delivery\\nObserved trace: resend(a, t+delta) interleaves ack(b)\\n\\nTherefore: model relation R_order is non-transitive under retransmission noise",
    pivot:
      "This project now anchors my current PhD work on soundness envelopes. I keep symbolic abstractions, but each assumption is paired with runtime witness tests that can invalidate proofs when temporal drift appears."
  },
  {
    serial: "LE-2026-001",
    title: "Sparse Context Distiller",
    class: "Scaling",
    status: "Internal Draft",
    objective:
      "The distiller project aimed to compress multi-session research context into sparse latent summaries that remained semantically faithful across long-horizon experiments. The plan was to improve retrieval speed and lower memory costs while preserving justifications for each inference step. Compression benchmarks looked strong in isolation, but quality collapsed when summaries were recursively distilled over multiple update cycles. Important minority signals were repeatedly dropped, creating brittle contexts that looked coherent yet omitted critical caveats. The system performed well on static snapshots and failed under living research workflows. The objective survives, but this implementation did not maintain evidence continuity across iterative compression.",
    bottleneck:
      "z_t = Distill(context_t, k)\\ncontext_(t+1) = Merge(context_t, z_t)\\n\\nRepeated distillation => information loss accumulates:\\nI(context_0; context_t) -> 0 as t increases",
    pivot:
      "This failure redirected my dissertation toward trace-preserving summarization, where compression is constrained by citation retention and uncertainty markers rather than token limits alone."
  }
];
