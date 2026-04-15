export const archiveRecords = [
  {
    id: "adaptive-cache-optimizer",
    date: "2026-03-19",
    project: "Adaptive Cache Optimizer",
    failureType: "Model Drift",
    technicalKey: "Non-stationary reward gradients",
    abstract:
      "The project aimed to train a lightweight reinforcement policy that dynamically reallocated cache blocks across heterogeneous workloads in a shared cluster. We expected the agent to infer temporal locality patterns and reduce miss penalties under volatile demand. Initial simulations looked promising, but real traces introduced abrupt shifts that corrupted reward estimation and destabilized policy updates. The optimizer oscillated between aggressive eviction and over-retention, producing worse latency than static heuristics. Our intended contribution was a self-correcting cache strategy for mixed scientific pipelines, yet the architecture could not maintain convergence once reward landscapes became non-stationary and measurement noise masked true utility boundaries.",
    breakingPoint: "J(theta) = E_t[r_t]\\n\\ntheta_(k+1) = theta_k + alpha * grad_theta J(theta_k)\\n\\nif d/dt Var(r_t) >> 0, then grad estimate -> high variance -> policy collapse",
    pivot:
      "The failure now informs my current research on robust control under changing objective surfaces. Instead of direct policy optimization, I use uncertainty-aware bandit envelopes and bounded regret diagnostics to separate environmental volatility from estimator error before adaptation is triggered."
  },
  {
    id: "graph-scheduler",
    date: "2025-11-02",
    project: "Graph-Constrained Scheduler",
    failureType: "Complexity Explosion",
    technicalKey: "State-space blowup in edge cases",
    abstract:
      "This study sought to build a scheduler that guaranteed dependency-safe execution for distributed experiment graphs while minimizing wall-clock completion time. The design merged topological sorting with a local search objective that reprioritized tasks whenever node runtimes deviated from forecast. In small and medium graphs, scheduling quality improved. In production graphs with deep fan-out and recurrent retries, however, search breadth expanded combinatorially. Pruning assumptions failed when error recovery inserted late-arriving dependency edges, forcing repeated global recomputation. The core objective remained valid, but the implementation crossed practical complexity limits. The dead end clarified that deterministic optimality was less valuable than predictable bounded latency under adversarial workflow growth.",
    breakingPoint: "for each frontier F_k:\\n  candidates = permutations(F_k)\\n  score all candidates\\n\\n|F_k| = 11 -> 39,916,800 orderings",
    pivot:
      "The negative result shaped my present shift toward approximation schedules with certifiable bounds. I now use incremental DAG partitioning and monotonic priority constraints, accepting minor suboptimality to guarantee tractable response times during dynamic graph mutation."
  },
  {
    id: "symbolic-verifier",
    date: "2025-06-14",
    project: "Symbolic Protocol Verifier",
    failureType: "Assumption Violation",
    technicalKey: "Unsound abstraction layer",
    abstract:
      "The verifier was intended to prove safety properties for a protocol family by translating implementation traces into symbolic constraints checked by an SMT solver. The hypothesis was that abstraction over transport semantics would preserve correctness while reducing formula size. During adversarial testing, we discovered counterexamples that bypassed the abstraction boundary through timing-coupled retransmission behavior. The solver returned satisfiable proofs under abstractions that were invalid in actual executions, creating a false guarantee of safety. Although throughput improved, semantic fidelity was compromised at the exact layer tasked with preserving invariants. The project failed as a verification system because performance gains depended on abstractions that erased critical temporal interactions.",
    breakingPoint: "Assumed: send(a) before ack(a) implies ordered delivery\\nObserved: resend(a, t+delta) interleaves with ack(b)\\nResult: abstraction violated causality constraints",
    pivot:
      "This record now anchors my current work on multi-layer verification contracts. I treat abstraction mappings as first-class artifacts with explicit soundness tests, and I instrument runtime witness traces to continuously validate whether proof assumptions remain aligned with deployment behavior."
  }
];
