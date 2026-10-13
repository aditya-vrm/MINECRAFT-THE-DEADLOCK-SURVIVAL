DeadlockGuard — Interactive Deadlock Simulator
DeadlockGuard is a web application that simulates how an operating system allocates resources to processes and determines whether the system can continue operating safely.
The core idea is to build a working operating-system algorithm simulator, not just a website that explains deadlocks.
For your college project, I'd build it as a modular React application with a JavaScript simulation engine, a Node.js API, and optional MongoDB persistence.
1. Core functionalities
Separate the application into these functional modules.
Module	Functionality
Process & resource management	Create processes and resource types; configure resource quantities.
Allocation state manager	Store each process's current Allocation and Max values.
Need calculator	Calculate Need = Max − Allocation automatically.
Safety algorithm engine	Determine whether a safe sequence exists using the Banker's Algorithm.
Resource request simulator	Simulate a request, tentatively allocate resources, run the safety check, then grant or defer it.
Step-by-step execution	Show Work, Need, Allocation and Available values at each iteration.
Resource allocation graph	Visualize processes, resources, allocations and requests.
Scenario manager	Load example scenarios, reset the simulation, and compare different states.
Validation and error handling	Reject invalid matrices, negative values, impossible allocations and requests exceeding Need.
Results and explanation	Report the safe sequence, unsafe state, rejected request or invalid input with the reason.
A critical distinction: an unsafe state is not automatically a deadlock. Your simulator must report these separately.




2. System architecture
React frontend
Process forms · Matrices · Simulation controls · Graph · Results

HTTP / JSON API

Node.js + Express backend
Request validation · Scenario API · Simulation orchestration · Optional persistence


Deadlock simulation engine
Need calculation · Safety algorithm · Request algorithm · Detection algorithm

Optional storage

MongoDB
Saved scenarios · Simulation history · User accounts, if needed


Why this architecture?
- React manages inputs, tables, simulation state and visual updates.
- Express exposes API endpoints and validates requests.
- Simulation engine contains the actual operating-system algorithms, separated from HTTP and UI code.
- MongoDB is optional: the simulation can work entirely in memory. Add a database only if you want to save scenarios or maintain history.
For a college demonstration, you don't need authentication, microservices, Redis, or a message queue. A modular monolithic backend is sufficient.
3. How the main algorithm works
The simulator should implement three distinct algorithmic capabilities.

A. Need calculation
For every process and resource type:
Need[i][j] = Max[i][j] - Allocation[i][j]
Validate that Allocation never exceeds Max and that the resource matrices are consistent with the total resource counts.




B. Safety algorithm
1. Initialize Work = Available.
2. Find an unfinished process where Need[i] ≤ Work for every resource type.
3. Simulate its completion.
4. Add its Allocation to Work.
5. Repeat until all processes finish or no eligible process remains.
If all processes finish, return a safe sequence. Otherwise, report that no safe sequence was found.




C. Resource request algorithm
Given a request from process Pi:
1. Check Request ≤ Need[i].
2. Check Request ≤ Available.
3. Make a tentative allocation in a copy of the current state.
4. Run the safety algorithm on that copy.
5. Commit the new state if safe; otherwise preserve the original state and defer the request.
The original state must remain unchanged when a request is rejected or deferred.



Important implementation detail: the engine should be a pure, deterministic module. It receives a state and returns a result without directly changing React state, sending HTTP responses, or writing to MongoDB.
That separation makes the algorithms easier to test and debug.




4. Backend API structure
Keep the API small and organized by responsibility.
Method	Endpoint	Purpose
POST	/api/simulations	Create a simulation with processes and resources.
GET	/api/simulations/:id	Retrieve a saved simulation.
PUT	/api/simulations/:id	Update its configuration.
POST	/api/simulations/:id/safety-check	Run the safety algorithm.
POST	/api/simulations/:id/requests	Test and apply a resource request.
POST	/api/simulations/:id/reset	Restore the initial state.
GET	/api/scenarios	List predefined example scenarios.
POST	/api/simulations/:id/detect-deadlock	Run a separate deadlock-detection algorithm.
You can add GET /api/simulations/:id/history if you want to persist simulation runs.
For a first version, you can also expose a stateless POST /api/safety-check endpoint that accepts matrices directly and returns the result without creating a database record.
Example API response
A safety check could return a structure like this:
{
  "status": "SAFE",
  "safeSequence": ["P1", "P3", "P4", "P0", "P2"],
  "steps": [
    {
      "process": "P1",
      "workBefore": [3, 3, 2],
      "need": [1, 2, 2],
      "allocationReleased": [2, 0, 0],
      "workAfter": [5, 3, 2]
    }
  ]
}


The steps array should contain one entry per simulated completion. The example above shows only the first step; your engine should generate the complete trace.
5. Suggested folder structure
I'd use a monorepo with a separate frontend and backend.
deadlockguard/

client/
React application
src/components/ — tables, forms, graph, results
src/pages/ — simulator, scenarios, history
src/services/ — API client
src/hooks/ — simulation and request state
src/utils/ — matrix formatting and validation helpers



server/
Express backend
src/routes/ — API route definitions
src/controllers/ — request and response handling
src/services/ — simulation orchestration
src/algorithms/ — pure algorithm implementations
src/validators/ — input and state validation
src/models/ — optional Mongoose models
src/middleware/ — error handling and validation
src/app.js — Express configuration
src/server.js — server startup



tests/
Algorithm, API and integration tests


package.json, .env.example, README.md



Keep the algorithm implementations independent of Express and Mongoose. For example, safetyAlgorithm.js should work when imported directly into a Jest test.
6. Frontend-to-backend workflow
The typical user journey should be:
#chatgpt-mermaid-_r_1es_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_1es_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_1es_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_1es_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_1es_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_1es_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_1es_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_1es_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_1es_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_1es_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_1es_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_1es_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_1es_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-_r_1es_ p{margin:0;}#chatgpt-mermaid-_r_1es_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_1es_ .label text,#chatgpt-mermaid-_r_1es_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ .node rect,#chatgpt-mermaid-_r_1es_ .node circle,#chatgpt-mermaid-_r_1es_ .node ellipse,#chatgpt-mermaid-_r_1es_ .node polygon,#chatgpt-mermaid-_r_1es_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_1es_ .rough-node .label text,#chatgpt-mermaid-_r_1es_ .node .label text,#chatgpt-mermaid-_r_1es_ .image-shape .label,#chatgpt-mermaid-_r_1es_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_1es_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_1es_ .rough-node .label,#chatgpt-mermaid-_r_1es_ .node .label,#chatgpt-mermaid-_r_1es_ .image-shape .label,#chatgpt-mermaid-_r_1es_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_1es_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_1es_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_1es_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-_r_1es_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-_r_1es_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-_r_1es_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_1es_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-_r_1es_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_1es_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-_r_1es_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-_r_1es_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_1es_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_1es_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_1es_ .icon-shape,#chatgpt-mermaid-_r_1es_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_1es_ .icon-shape p,#chatgpt-mermaid-_r_1es_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-_r_1es_ .icon-shape .label rect,#chatgpt-mermaid-_r_1es_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_1es_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_1es_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_1es_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_1es_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_1es_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_1es_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_1es_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_1es_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_1es_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_1es_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_1es_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_1es_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-_r_1es_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_1es_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_1es_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_1es_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_1es_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_1es_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_1es_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_1es_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_1es_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_1es_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_1es_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_1es_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-_r_1es_ .node rect,#chatgpt-mermaid-_r_1es_ .node circle,#chatgpt-mermaid-_r_1es_ .node ellipse,#chatgpt-mermaid-_r_1es_ .node polygon,#chatgpt-mermaid-_r_1es_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_1es_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_1es_ .node.mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-_r_1es_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_1es_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_1es_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Create processes andresourcesValidate inputCalculate Need matrixRun safety checkSafe state?Display safe sequenceDisplay no safe sequencefoundSubmit resource requestValidate requestTentative allocationRun safety algorithm againResultCommit allocationKeep original state and deferUpdate simulation resultsYesNoSafeUnsafe





For step-by-step execution, the frontend should consume the trace returned by the backend and display one step at a time. The algorithm itself can run immediately; the frontend controls how the results are revealed.
7. Database model
MongoDB is only necessary if users should save and revisit their simulations.
A Simulation document could contain:
- name
- resources: resource names and total instances
- processes: process IDs, maximum demands and current allocations
- initialState: the state used for reset
- createdAt and updatedAt
Keep derived values such as Need recalculated or verified by the backend rather than trusting a value submitted by the client.
For history, use a separate SimulationRun collection containing the simulation ID, request details, resulting status, safe sequence and timestamp.
For a simple academic version, in-memory scenarios are enough.
8. What about deadlock detection?
Don't treat detection as identical to the Banker's safety check.
- Banker's safety algorithm: determines whether a state has a safe sequence, using maximum future resource requirements.
- Deadlock detection: examines current allocations and outstanding requests to determine whether processes are deadlocked under the modeled resource assumptions.
Implement detection as a separate module. For a multiple-instance resource model, a detection algorithm can use current outstanding requests and available resources; it does not simply reuse the Banker's Need matrix.
Likewise, prevention is primarily a policy or design strategy. Your application can demonstrate prevention policies, but it should not label a safety check as prevention.
9. Testing requirements
Before adding advanced features, write tests for the algorithm engine.
Test	Expected behavior
Known safe example	Returns P1 → P3 → P4 → P0 → P2.
Unsafe state	Reports that no safe sequence exists.
Request exceeds Need	Rejects as an invalid request.
Request exceeds Available	Defers because resources are unavailable.
Tentative request creates unsafe state	Defers and preserves the original state.
Zero-resource request	Handles correctly without corrupting state.
Invalid matrix dimensions or negative values	Returns a validation error.
All processes complete	Returns a valid safe sequence.
Also verify that each step in the returned trace satisfies Need ≤ Work and that Work increases by the completed process's Allocation.

10. Recommended implementation order
1. Build the algorithm engine first. Implement Need calculation and the safety algorithm with unit tests.
2. Implement resource requests. Add tentative allocation, rollback and state validation.
3. Build the React simulator. Add editable matrices, process/resource inputs, safety results and step controls.
4. Connect the API. Use Express to validate inputs and run the engine.
5. Add graph visualization. Represent processes, resources, allocations and requests; keep the graph consistent with the actual state.
6. Add persistence and detection. Only after the core simulation is correct.
7. Prepare the classroom demo. Preload a known safe scenario and an unsafe-request scenario so you can demonstrate both outcomes reliably.