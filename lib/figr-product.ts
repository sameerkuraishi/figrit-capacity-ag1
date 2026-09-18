export type CoreSkill =
  | "Numerical"
  | "Logical"
  | "Communication"
  | "Creativity"
  | "Organization"
  | "Practical";

export type StudentStep =
  | "profile"
  | "assessment"
  | "analysis"
  | "careers"
  | "college-selection"
  | "counselling"
  | "gaps"
  | "roadmap"
  | "learning"
  | "tutor"
  | "quiz"
  | "adaptation"
  | "handoff"
  | "alumni";

export type ChatMessage = { from: "student" | "guide"; text: string };

export interface GapItem {
  skill: CoreSkill;
  current: number;
  required: number;
  gap: number;
}

export interface RoadmapItem {
  title: string;
  type: string;
  objective: string;
  resource: string;
  weeks: string;
  duration: string;
}

export interface VerifiedResource {
  provider: string;
  type: string;
  url: string;
  cost: string;
}

export interface Counsellor {
  id: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  languages: string;
  experience: string;
  rating: string;
}

export type Track =
  | "Exploring all fields"
  | "Technology & Engineering"
  | "Commerce & Finance"
  | "Creative & Media"
  | "Hospitality & Service"
  | "Healthcare & People"
  | "Law & Public Service";

export type StudentProfile = {
  name: string;
  level: string;
  track: Track;
  budget: string;
  weeklyHours: number;
  interests: string[];
  selfRatings: Record<CoreSkill, number>;
};

export type Question = {
  id: string;
  skill: CoreSkill;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: "Foundation" | "Applied";
  /** Optional metadata used by the Interest Constellation assessment engine. */
  relatedInterests?: string[];
  kind?: "Aptitude" | "Scenario" | "Field awareness" | "Cross-interest";
  why?: string;
};

export type Career = {
  id: string;
  title: string;
  category: Exclude<Track, "Exploring all fields">;
  summary: string;
  tags: string[];
  color: string;
  requirements: Record<CoreSkill, number>;
  focusSkills: string[];
  trialTask: string;
  project: string;
  checkpoint: Question;
};

export type CareerResult = Career & {
  match: number;
  readiness: number;
  interestAlignment: number;
  supporting: CoreSkill[];
  missing: CoreSkill[];
};

export const coreSkills: CoreSkill[] = [
  "Numerical",
  "Logical",
  "Communication",
  "Creativity",
  "Organization",
  "Practical",
];

export const tracks: Track[] = [
  "Exploring all fields",
  "Technology & Engineering",
  "Commerce & Finance",
  "Creative & Media",
  "Hospitality & Service",
  "Healthcare & People",
  "Law & Public Service",
];

export const interestChoices = [
  "Programming",
  "Mathematics",
  "Problem Solving",
  "AI & Data",
  "Cybersecurity",
  "Design",
  "Writing",
  "Communication",
  "Public Speaking",
  "Teaching",
  "Science",
  "Medicine",
  "Law & Society",
  "Business",
  "Entrepreneurship",
  "Finance",
  "Accounting",
  "Marketing",
  "Food & Cooking",
  "Hospitality",
  "Robotics",
  "Gaming",
  "Helping People",
  "Leadership",
];

const q = (
  id: string,
  skill: CoreSkill,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  difficulty: Question["difficulty"] = "Foundation",
): Question => ({ id, skill, prompt, options, answer, explanation, difficulty });

export const questionBanks: Record<Track, Question[]> = {
  "Exploring all fields": [
    q("all-num", "Numerical", "A ₹800 item has a 25% discount. What is the final price?", ["₹200", "₹600", "₹625", "₹750"], 1, "25% of ₹800 is ₹200, so the final price is ₹600."),
    q("all-log", "Logical", "What comes next: 3, 6, 12, 24, …?", ["30", "36", "42", "48"], 3, "Each number is doubled, so 24 becomes 48."),
    q("all-com", "Communication", "A teammate misunderstood your idea. What is the clearest response?", ["Repeat it louder", "Use a simple example", "Ignore it", "Use more jargon"], 1, "A relevant example makes an abstract idea easier to understand."),
    q("all-cre", "Creativity", "Before redesigning a school poster, what should you understand first?", ["The audience and message", "The most expensive font", "How many effects fit", "What another school copied"], 0, "Creative choices should begin with the audience and intended message."),
    q("all-org", "Organization", "Three assignments have different deadlines. What should you do first?", ["Start randomly", "List deadlines and effort", "Wait for reminders", "Do only the easiest"], 1, "Prioritising by deadline and effort produces a workable plan."),
    q("all-pra", "Practical", "Your model stops working before a demonstration. What is the best first step?", ["Throw it away", "Check power and connections", "Change the topic", "Hide the problem"], 1, "Start with the simplest likely failure before replacing or redesigning anything.", "Applied"),
  ],
  "Technology & Engineering": [
    q("tech-log", "Logical", "A loop repeats five times and adds 2 each time. What is added in total?", ["5", "7", "10", "12"], 2, "Five additions of 2 produce 10."),
    q("tech-num", "Numerical", "A 1.5 GB file is divided into 500 MB parts. Roughly how many parts are needed?", ["2", "3", "4", "5"], 1, "1.5 GB is roughly 1500 MB, which makes three 500 MB parts."),
    q("tech-pra", "Practical", "A website button does nothing. What should you check first?", ["Its click action", "The logo colour", "The wallpaper", "The project name"], 0, "The button event is the closest part of the system to the observed failure.", "Applied"),
    q("tech-com", "Communication", "What makes a useful software bug report?", ["Only 'broken'", "Steps, expected result and actual result", "An emoji", "A guess about blame"], 1, "Reproduction steps and expected versus actual behaviour make the bug testable."),
    q("tech-org", "Organization", "What is the safest way to build a large feature?", ["One giant change", "Small tested steps", "No plan", "Skip saved versions"], 1, "Small verifiable changes are easier to review and repair."),
    q("tech-cre", "Creativity", "Two app ideas solve the same problem. Which is stronger?", ["The one with more colours", "The one tested with users", "The longer name", "The one with more screens"], 1, "User evidence is more useful than visual quantity when comparing product ideas.", "Applied"),
  ],
  "Commerce & Finance": [
    q("fin-num", "Numerical", "A product costs ₹500 and sells for ₹600. What is the profit?", ["₹50", "₹100", "₹500", "₹1,100"], 1, "Profit is selling price minus cost price: ₹600 − ₹500 = ₹100."),
    q("fin-log", "Logical", "Two financial totals disagree. What should you do first?", ["Choose the larger", "Trace the entries", "Delete both", "Round randomly"], 1, "Tracing source entries helps locate the actual discrepancy."),
    q("fin-com", "Communication", "How should you explain a budget gap to a client?", ["Hide it", "Show the cause and available options", "Use only technical words", "Change the subject"], 1, "Clear causes and options support an informed decision."),
    q("fin-org", "Organization", "Which record best tracks daily business sales?", ["A dated ledger", "A photo gallery", "A blank notebook", "A social post"], 0, "A dated ledger creates a consistent auditable record."),
    q("fin-pra", "Practical", "A receipt is missing during reconciliation. What should you do?", ["Invent an amount", "Flag and verify it", "Ignore it", "Delete the month"], 1, "The honest action is to flag the missing evidence and verify the transaction.", "Applied"),
    q("fin-cre", "Creativity", "A shop wants more repeat customers. Which idea is easiest to test?", ["Change everything", "Try a simple loyalty offer", "Copy a random brand", "Raise every price"], 1, "A small loyalty trial has a clear audience and measurable outcome.", "Applied"),
  ],
  "Creative & Media": [
    q("cre-cre", "Creativity", "What should guide the first version of a poster?", ["Audience and purpose", "Every available colour", "The most fonts", "A random trend"], 0, "The audience and purpose define whether a design works."),
    q("cre-com", "Communication", "A client says 'make it better.' What should you ask?", ["Nothing", "What outcome should improve?", "Can I add more effects?", "Why are you wrong?"], 1, "Asking about the desired outcome turns vague feedback into a useful goal."),
    q("cre-log", "Logical", "Users repeatedly miss a menu item. Which evidence matters most?", ["Your taste", "Observed user behaviour", "A friend's guess", "Logo size"], 1, "Repeated observed behaviour is stronger evidence than preference."),
    q("cre-org", "Organization", "How should design files be handed to a team?", ["Unnamed versions", "Clearly named and organised", "Screenshots only", "One unlabelled folder"], 1, "Clear naming and structure let collaborators find and reuse work."),
    q("cre-num", "Numerical", "A 1200 px banner is split into three equal columns. Each column is:", ["300 px", "400 px", "600 px", "900 px"], 1, "1200 divided by 3 is 400."),
    q("cre-pra", "Practical", "A design looks attractive but its text is difficult to read. What should change first?", ["Add animation", "Improve contrast and size", "Add another image", "Hide the text"], 1, "Readable contrast and type size are fundamental usability requirements.", "Applied"),
  ],
  "Hospitality & Service": [
    q("hos-num", "Numerical", "A recipe for four needs two cups of flour. How much is needed for eight?", ["2 cups", "3 cups", "4 cups", "8 cups"], 2, "Doubling the servings doubles the flour from two to four cups."),
    q("hos-org", "Organization", "Three dishes must finish together. What helps most?", ["A timing plan", "Starting randomly", "Cooking one tomorrow", "Ignoring preparation"], 0, "A timing plan coordinates preparation and cooking durations."),
    q("hos-com", "Communication", "A guest reports a wrong order. What should you do first?", ["Argue", "Listen, apologise and confirm", "Walk away", "Blame the kitchen"], 1, "Listening and confirming the issue begins a calm resolution."),
    q("hos-pra", "Practical", "An ingredient is unavailable. What is the best response?", ["Use anything", "Choose a safe suitable substitute", "Hide it", "Cancel every order"], 1, "A safe substitute preserves quality while responding to the constraint.", "Applied"),
    q("hos-cre", "Creativity", "A new dish should first be judged by:", ["Taste, safety and audience", "Name length", "Plate price only", "Ingredient count"], 0, "A useful dish must be safe, suitable for its audience and enjoyable."),
    q("hos-log", "Logical", "Orders are delayed at one station. What should be checked?", ["The bottleneck process", "The wall colour", "The music", "The menu font"], 0, "The bottleneck is the step limiting the overall flow.", "Applied"),
  ],
  "Healthcare & People": [
    q("hea-com", "Communication", "Someone is nervous while explaining a problem. What helps most?", ["Interrupting", "Listening and clarifying", "Judging quickly", "Changing the topic"], 1, "Calm listening and clarification help the person feel understood."),
    q("hea-log", "Logical", "A conclusion is based on one example. What is the main risk?", ["Too much evidence", "Overgeneralising", "Clear reasoning", "Better planning"], 1, "One example may not represent the wider population or situation."),
    q("hea-org", "Organization", "Several learners need follow-up. What is the safest approach?", ["Rely on memory", "Keep a clear confidential schedule", "Post names publicly", "Contact randomly"], 1, "A confidential schedule supports consistent and responsible follow-up."),
    q("hea-pra", "Practical", "A student does not understand your explanation. What should you try?", ["Repeat exactly", "Use another example or method", "Skip it", "Lower the score"], 1, "A different representation can match the learner's way of understanding.", "Applied"),
    q("hea-num", "Numerical", "A class has 30 students and 80% attend. How many are present?", ["18", "20", "24", "28"], 2, "80% of 30 is 24."),
    q("hea-cre", "Creativity", "Which activity best explains a difficult idea?", ["A relevant demonstration", "More jargon", "No examples", "Longer copying"], 0, "A concrete demonstration makes an unfamiliar concept observable."),
  ],
  "Law & Public Service": [
    q("law-log", "Logical", "An argument gives a conclusion but no evidence. What is missing?", ["A louder speaker", "Supporting reasons", "A longer title", "More repetition"], 1, "A conclusion needs relevant reasons or evidence to be persuasive."),
    q("law-com", "Communication", "Two people disagree about a rule. What is the clearest next step?", ["Insult one person", "Read the rule and define the disputed point", "Ignore both", "Choose at random"], 1, "Clarifying the source and exact disagreement creates a fair basis for discussion."),
    q("law-org", "Organization", "How should documents for a public application be prepared?", ["Unlabelled", "Indexed and checked", "Mixed with personal notes", "Submitted incomplete"], 1, "An indexed checklist reduces omissions and makes review efficient."),
    q("law-num", "Numerical", "A town budget is ₹10 lakh and 30% funds education. How much is that?", ["₹1 lakh", "₹2 lakh", "₹3 lakh", "₹7 lakh"], 2, "30% of ₹10 lakh is ₹3 lakh."),
    q("law-cre", "Creativity", "A policy is difficult for citizens to understand. What could help?", ["More jargon", "A plain-language visual guide", "A smaller font", "No explanation"], 1, "A plain-language guide improves public access without changing the rule."),
    q("law-pra", "Practical", "You discover an error in a submitted report. What is the responsible action?", ["Hide it", "Report and correct it through the proper process", "Blame someone", "Delete the evidence"], 1, "Transparent correction protects accuracy and trust.", "Applied"),
  ],
};

const career = (
  id: string,
  title: string,
  category: Career["category"],
  summary: string,
  tags: string[],
  color: string,
  requirements: Record<CoreSkill, number>,
  focusSkills: string[],
  trialTask: string,
  project: string,
  checkpoint: Question,
): Career => ({ id, title, category, summary, tags, color, requirements, focusSkills, trialTask, project, checkpoint });

export const careers: Career[] = [
  career("ml", "AI / Machine Learning Engineer", "Technology & Engineering", "Build systems that learn from data and improve through evidence.", ["Programming", "Mathematics", "AI & Data", "Problem Solving"], "#5147D9", { Numerical: 9, Logical: 9, Communication: 6, Creativity: 7, Organization: 7, Practical: 8 }, ["Python", "Probability", "Model evaluation"], "Classify a small set of examples and explain the rule you used.", "Train and explain a beginner classification model.", q("ml-check", "Logical", "Why should a model be tested on data it did not train on?", ["To make training longer", "To check whether it generalises", "To remove all errors", "To avoid collecting evidence"], 1, "Unseen data checks whether the model learned a useful pattern rather than memorising examples.", "Applied")),
  career("data-science", "Data Scientist", "Technology & Engineering", "Use statistics, code and experimentation to answer complex questions.", ["AI & Data", "Mathematics", "Programming", "Research"], "#3C64C7", { Numerical: 10, Logical: 9, Communication: 7, Creativity: 7, Organization: 8, Practical: 7 }, ["Statistics", "Python", "Experiment design"], "Find one useful pattern in a small table and explain its limits.", "Complete an evidence-based data investigation.", q("ds-check", "Numerical", "Which measure is least affected by one extreme value?", ["Mean", "Median", "Range", "Maximum"], 1, "The median depends on order, so one extreme value usually changes it less than the mean.")),
  career("data-analyst", "Data Analyst", "Technology & Engineering", "Turn raw data into clear findings that support decisions.", ["AI & Data", "Mathematics", "Business", "Communication"], "#24899A", { Numerical: 9, Logical: 8, Communication: 8, Creativity: 6, Organization: 9, Practical: 8 }, ["Spreadsheets", "SQL", "Data visualisation"], "Turn a five-row dataset into one chart and a one-sentence finding.", "Build a small decision dashboard.", q("da-check", "Practical", "Which chart is clearest for comparing five categories?", ["Bar chart", "World map", "Scatter plot", "Gauge"], 0, "A bar chart makes categorical lengths easy to compare.")),
  career("software", "Software Engineer", "Technology & Engineering", "Design dependable software by breaking problems into testable parts.", ["Programming", "Problem Solving", "Technology"], "#355ED7", { Numerical: 7, Logical: 10, Communication: 7, Creativity: 7, Organization: 9, Practical: 9 }, ["Programming", "Algorithms", "Software design"], "Write steps for a simple app feature before writing any code.", "Build and test a small useful application.", q("se-check", "Logical", "A program gives the wrong output. What is the best first debugging step?", ["Rewrite everything", "Check the smallest failing input", "Add features", "Ignore it"], 1, "A small failing input helps isolate the cause.")),
  career("full-stack", "Full Stack Developer", "Technology & Engineering", "Create complete web products from user interface to server logic.", ["Programming", "Design", "Problem Solving"], "#496FCA", { Numerical: 6, Logical: 9, Communication: 7, Creativity: 8, Organization: 8, Practical: 10 }, ["Web foundations", "APIs", "Databases"], "Sketch a form and list what data its backend must receive.", "Build a small end-to-end web product.", q("fs-check", "Practical", "What format is commonly used to exchange data between a web frontend and API?", ["JPEG", "JSON", "MP3", "CSS"], 1, "JSON is a common structured format for web requests and responses.")),
  career("cyber", "Cybersecurity Analyst", "Technology & Engineering", "Protect systems, investigate threats and communicate digital risk.", ["Cybersecurity", "Programming", "Law & Society", "Problem Solving"], "#4A68AA", { Numerical: 6, Logical: 10, Communication: 8, Creativity: 6, Organization: 9, Practical: 9 }, ["Networking", "Security fundamentals", "Threat analysis"], "Inspect a sample message and list three phishing clues.", "Write a beginner incident-analysis report.", q("cy-check", "Practical", "You receive an unexpected login link. What should you do first?", ["Open it", "Forward it", "Verify sender and URL", "Enter a password"], 2, "Verification reduces the chance of entering credentials into a phishing page.")),
  career("cloud", "Cloud Engineer", "Technology & Engineering", "Build reliable online infrastructure and manage scalable services.", ["Programming", "Technology", "Problem Solving"], "#476F9E", { Numerical: 6, Logical: 9, Communication: 7, Creativity: 5, Organization: 10, Practical: 9 }, ["Cloud concepts", "Linux", "Networking"], "Draw how a browser request reaches a hosted application.", "Deploy and document a small static service.", q("cl-check", "Organization", "Why are infrastructure changes recorded as code?", ["To add colours", "To make them repeatable and reviewable", "To avoid testing", "To hide settings"], 1, "Recorded configuration can be reviewed and reproduced consistently.")),
  career("devops", "DevOps Engineer", "Technology & Engineering", "Improve how teams build, test, release and operate software.", ["Programming", "Leadership", "Problem Solving"], "#557692", { Numerical: 6, Logical: 9, Communication: 8, Creativity: 6, Organization: 10, Practical: 10 }, ["Git", "Automation", "Monitoring"], "Create a checklist that prevents one common release failure.", "Automate a small build-and-check workflow.", q("do-check", "Organization", "What is the main value of an automated test before deployment?", ["It guarantees perfection", "It detects known failures consistently", "It removes users", "It changes the design"], 1, "Automation repeatedly checks expected behaviour and catches regressions.")),
  career("ux", "UI/UX Designer", "Creative & Media", "Research people’s needs and design useful, understandable experiences.", ["Design", "Creativity", "Helping People", "Communication"], "#8B61B5", { Numerical: 4, Logical: 7, Communication: 9, Creativity: 10, Organization: 7, Practical: 8 }, ["Visual design", "UX research", "Prototyping"], "Observe someone completing one task and note where they hesitate.", "Create a tested mobile app case study.", q("ux-check", "Logical", "Users cannot find an important button. What should a designer do first?", ["Add animation", "Observe and test the flow", "Hide more controls", "Change every colour"], 1, "Testing the task reveals why the control is being missed.")),
  career("product-design", "Product Designer", "Creative & Media", "Connect user research, product strategy and interface design.", ["Design", "Business", "Communication", "Creativity"], "#9A62A8", { Numerical: 5, Logical: 8, Communication: 9, Creativity: 10, Organization: 8, Practical: 8 }, ["Research", "Product thinking", "Design systems"], "Interview one classmate about a repeated problem and map the steps.", "Design and validate a focused product concept.", q("pd-check", "Communication", "Which interview question is least likely to lead the participant?", ["You like this, right?", "What happened the last time you did this?", "Isn't this confusing?", "Wouldn't this button help?"], 1, "Asking about a past event encourages specific evidence without suggesting an answer.")),
  career("game", "Game Developer", "Creative & Media", "Combine code, systems and storytelling to create interactive experiences.", ["Gaming", "Programming", "Creativity", "Design"], "#7564C5", { Numerical: 7, Logical: 9, Communication: 6, Creativity: 10, Organization: 7, Practical: 9 }, ["Game loops", "Programming", "Level design"], "Design a paper game with one rule and test it with a friend.", "Build a small playable prototype.", q("gd-check", "Practical", "What is a game loop responsible for?", ["Only the title", "Repeatedly updating input, state and output", "Writing the store page", "Choosing a username"], 1, "A game loop repeatedly processes input, updates the game state and renders output.")),
  career("robotics", "Robotics Engineer", "Technology & Engineering", "Combine mechanics, electronics and software to build intelligent machines.", ["Robotics", "Science", "Mathematics", "Programming"], "#2F7B86", { Numerical: 9, Logical: 9, Communication: 6, Creativity: 8, Organization: 8, Practical: 10 }, ["Electronics", "Mechanics", "Control systems"], "Map the sensor, decision and action parts of a line-following robot.", "Prototype a simple sensing-and-action system.", q("ro-check", "Logical", "In a robot, a sensor primarily provides:", ["Decoration", "Information about the environment", "Battery power", "A final report"], 1, "Sensors convert an observed physical condition into information a system can use.")),
  career("doctor", "Doctor / Medical Professional", "Healthcare & People", "Use scientific evidence and compassionate communication to support health.", ["Medicine", "Science", "Helping People"], "#C65B72", { Numerical: 7, Logical: 9, Communication: 9, Creativity: 5, Organization: 10, Practical: 9 }, ["Biology", "Scientific reasoning", "Empathy"], "Explain a simple body system to a younger student without jargon.", "Create an evidence-based health education brief.", q("med-check", "Logical", "Why is one symptom alone rarely enough for a diagnosis?", ["Symptoms are never useful", "Different conditions can share symptoms", "Tests are decorative", "Doctors should guess"], 1, "Multiple conditions can produce similar symptoms, so context and evidence matter.")),
  career("lawyer", "Lawyer / Legal Professional", "Law & Public Service", "Research rules, analyse arguments and communicate cases clearly.", ["Law & Society", "Writing", "Public Speaking", "Research"], "#A85D50", { Numerical: 4, Logical: 10, Communication: 10, Creativity: 7, Organization: 9, Practical: 7 }, ["Legal reasoning", "Research", "Argumentation"], "Read two short arguments and identify the claim and evidence in each.", "Prepare a structured case brief and oral argument.", q("law-check", "Logical", "What makes evidence relevant to an argument?", ["It is lengthy", "It directly supports or challenges the claim", "It uses difficult words", "It is repeated"], 1, "Relevant evidence has a clear logical relationship to the claim.")),
  career("teacher", "Teacher / Learning Designer", "Healthcare & People", "Help learners understand ideas through explanation, planning and feedback.", ["Teaching", "Helping People", "Communication", "Leadership"], "#28739A", { Numerical: 6, Logical: 7, Communication: 10, Creativity: 9, Organization: 9, Practical: 8 }, ["Subject knowledge", "Explanation", "Assessment"], "Teach a five-minute concept and ask one question that checks understanding.", "Create and deliver a short learning experience.", q("te-check", "Communication", "Which activity best checks understanding during a lesson?", ["Only attendance", "A short concept question", "More copying", "Speaking without pauses"], 1, "A targeted question reveals whether learners understood the concept.")),
  career("chef", "Chef / Culinary Professional", "Hospitality & Service", "Combine creativity, food science, discipline and service in professional kitchens.", ["Food & Cooking", "Hospitality", "Creativity", "Leadership"], "#D76849", { Numerical: 6, Logical: 6, Communication: 8, Creativity: 10, Organization: 10, Practical: 10 }, ["Food safety", "Culinary technique", "Kitchen management"], "Plan the timing and hygiene steps for preparing one simple dish.", "Create a recipe, costing sheet and plated result.", q("chef-check", "Practical", "What is the safest way to avoid raw-food cross-contamination?", ["Use the same board", "Rinse hands only", "Separate tools and wash properly", "Cook everything together"], 2, "Separate equipment and proper washing prevent harmful transfer.")),
  career("bpo", "BPO / Customer Support Associate", "Hospitality & Service", "Help customers solve problems through patient communication, process knowledge and accurate follow-up.", ["Communication", "Helping People", "Business", "Organization"], "#168C82", { Numerical: 5, Logical: 7, Communication: 10, Creativity: 6, Organization: 9, Practical: 9 }, ["Active listening", "Customer communication", "Process accuracy"], "Respond to a fictional customer complaint in four calm, useful sentences.", "Create a small customer-support response guide and escalation checklist.", q("bpo-check", "Communication", "A customer is upset and explains several problems at once. What should you do first?", ["End the conversation", "Acknowledge the concern and clarify the main issue", "Promise an impossible result", "Transfer them without explanation"], 1, "Acknowledging the concern and clarifying the issue creates a respectful, accurate starting point.", "Applied")),
  career("marketing", "Digital Marketing Specialist", "Creative & Media", "Grow audiences through clear stories, experiments and data-informed campaigns.", ["Marketing", "Communication", "Creativity", "AI & Data"], "#BE6B8F", { Numerical: 6, Logical: 7, Communication: 10, Creativity: 9, Organization: 8, Practical: 8 }, ["Content strategy", "Analytics", "Campaign testing"], "Write two headlines for the same message and define how you would compare them.", "Plan and evaluate a small digital campaign.", q("mk-check", "Numerical", "A campaign gets 50 clicks from 1,000 views. Its click-through rate is:", ["0.5%", "5%", "20%", "50%"], 1, "50 divided by 1,000 equals 0.05, or 5%.")),
  career("finance", "Financial Analyst", "Commerce & Finance", "Evaluate performance, risk and investment information for decisions.", ["Finance", "Mathematics", "Business", "AI & Data"], "#9B7627", { Numerical: 10, Logical: 9, Communication: 8, Creativity: 5, Organization: 10, Practical: 7 }, ["Business mathematics", "Financial statements", "Risk"], "Compare two years of a fictional business and explain one trend.", "Produce a beginner company-analysis report.", q("fa-check", "Logical", "Why compare financial results across several years?", ["To use more pages", "To identify trends", "To avoid calculations", "To remove all risk"], 1, "A time series helps distinguish a pattern from a one-off result.")),
  career("ca", "Chartered Accountant", "Commerce & Finance", "Work with accounting, taxation, audit and financial compliance.", ["Accounting", "Finance", "Mathematics", "Law & Society"], "#A66834", { Numerical: 10, Logical: 9, Communication: 8, Creativity: 4, Organization: 10, Practical: 8 }, ["Accounting", "Taxation", "Audit"], "Classify five sample transactions and check whether totals balance.", "Create a small audit-ready record set.", q("ca-check", "Numerical", "In the accounting equation, assets equal:", ["Income minus tax", "Liabilities plus equity", "Sales plus profit", "Cash minus expenses"], 1, "The standard accounting equation is Assets = Liabilities + Equity.")),
  career("civil-service", "Civil Services / Public Administration", "Law & Public Service", "Organise public programmes, analyse policy and serve communities fairly.", ["Law & Society", "Leadership", "Writing", "Public Speaking"], "#5D6F83", { Numerical: 7, Logical: 9, Communication: 10, Creativity: 6, Organization: 10, Practical: 8 }, ["Current affairs", "Policy analysis", "Public communication"], "Summarise a local issue, affected groups and two possible actions.", "Write a balanced public-policy briefing.", q("cs-check", "Communication", "A good public notice should primarily be:", ["Vague", "Clear, accurate and accessible", "Full of jargon", "Unverifiable"], 1, "Public communication should help people understand what happened and what to do.")),
];

export const blankProfile: StudentProfile = {
  name: "",
  level: "Class 11",
  track: "Exploring all fields",
  budget: "Free resources only",
  weeklyHours: 5,
  interests: [],
  selfRatings: {
    Numerical: 5,
    Logical: 5,
    Communication: 5,
    Creativity: 5,
    Organization: 5,
    Practical: 5,
  },
};

export const demoProfile: StudentProfile = {
  name: "Aarav Sharma",
  level: "Class 11",
  track: "Exploring all fields",
  budget: "Free resources only",
  weeklyHours: 8,
  interests: ["Programming", "Mathematics", "AI & Data", "Problem Solving"],
  selfRatings: {
    Numerical: 5,
    Logical: 7,
    Communication: 6,
    Creativity: 6,
    Organization: 6,
    Practical: 7,
  },
};

export function calculateEffectiveSkills(
  profile: StudentProfile,
  questions: Question[],
  answers: Record<string, number>,
) {
  const scores = {} as Record<CoreSkill, number>;
  coreSkills.forEach((skill) => {
    const relevant = questions.filter((question) => question.skill === skill && answers[question.id] !== undefined);
    const demonstrated = relevant.length
      ? (relevant.filter((question) => answers[question.id] === question.answer).length / relevant.length) * 10
      : profile.selfRatings[skill];
    scores[skill] = Number((profile.selfRatings[skill] * 0.45 + demonstrated * 0.55).toFixed(1));
  });
  return scores;
}

export function assessmentScore(questions: Question[], answers: Record<string, number>) {
  if (!questions.length) return 0;
  return Math.round((questions.filter((question) => answers[question.id] === question.answer).length / questions.length) * 100);
}

export function rankCareers(profile: StudentProfile, skills: Record<CoreSkill, number>): CareerResult[] {
  return careers
    .map((item) => {
      // Career matching is evidence-led: the personalized assessment changes the
      // effective skill scores, which are then compared with each career's needs.
      // Higher-requirement skills carry slightly more weight than lower ones.
      const totalRequirementWeight = coreSkills.reduce((sum, skill) => sum + item.requirements[skill], 0);
      const requirementFit =
        (coreSkills.reduce(
          (sum, skill) =>
            sum + Math.min(1, skills[skill] / item.requirements[skill]) * item.requirements[skill],
          0,
        ) / totalRequirementWeight) * 100;
      const skillEvidence = (coreSkills.reduce((sum, skill) => sum + skills[skill], 0) / coreSkills.length) * 10;
      const tagMatches = item.tags.filter((tag) => profile.interests.includes(tag)).length;
      const trackMatch = profile.track === item.category ? 1 : profile.track === "Exploring all fields" ? 0.35 : 0;
      const interestAlignment = Math.min(100, Math.round(tagMatches * 24 + trackMatch * 28));

      // 55% demonstrated/self-rated competency fit + 35% stated interests +
      // 10% broad evidence. This is a transparent demo heuristic, not a claim
      // of psychometric validation or a final career decision.
      const match = Math.round(requirementFit * 0.55 + interestAlignment * 0.35 + skillEvidence * 0.1);
      const supporting = coreSkills.filter((skill) => skills[skill] >= item.requirements[skill] - 1.5);
      const missing = [...coreSkills]
        .filter((skill) => item.requirements[skill] - skills[skill] > 0.5)
        .sort((a, b) => item.requirements[b] - skills[b] - (item.requirements[a] - skills[a]));
      return {
        ...item,
        match: Math.min(99, match),
        readiness: Math.round(requirementFit),
        interestAlignment,
        supporting,
        missing,
      };
    })
    .sort((a, b) => b.match - a.match);
}

export const counsellors = [
  {
    id: "priya",
    name: "Dr. Priya Menon",
    initials: "PM",
    role: "School career exploration",
    focus: "Classes 9–12 · STEM, finance and early career decisions",
    languages: "English · Hindi · Malayalam",
    experience: "15 years",
    rating: "4.9 · 320 demo sessions",
  },
  {
    id: "rahul",
    name: "Rahul Verma",
    initials: "RV",
    role: "Skills and pathway mentor",
    focus: "Technology, commerce and evidence-building projects",
    languages: "English · Hindi · Tamil",
    experience: "12 years",
    rating: "4.8 · 280 demo sessions",
  },
  {
    id: "sneha",
    name: "Sneha Iyer",
    initials: "SI",
    role: "Creative and people-focused careers",
    focus: "Design, education, communication and hospitality",
    languages: "English · Hindi · Kannada",
    experience: "10 years",
    rating: "4.9 · 195 demo sessions",
  },
];

export const verifiedResources = [
  { provider: "SWAYAM", type: "Course catalog", url: "https://swayam.gov.in", cost: "Free" },
  { provider: "NPTEL", type: "University lectures", url: "https://nptel.ac.in", cost: "Free" },
  { provider: "Khan Academy", type: "Foundations", url: "https://www.khanacademy.org", cost: "Free" },
  { provider: "freeCodeCamp", type: "Guided practice", url: "https://www.freecodecamp.org", cost: "Free" },
];
