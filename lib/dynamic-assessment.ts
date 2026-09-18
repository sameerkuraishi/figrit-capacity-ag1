import type { CoreSkill, Question, StudentProfile } from "./figr-product";

type DynamicQuestion = Question & {
  relatedInterests?: string[];
  kind?: "Aptitude" | "Scenario" | "Field awareness" | "Cross-interest";
  why?: string;
};

const make = (
  id: string,
  skill: CoreSkill,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  relatedInterests: string[],
  kind: DynamicQuestion["kind"] = "Scenario",
  difficulty: Question["difficulty"] = "Foundation",
): DynamicQuestion => ({
  id,
  skill,
  prompt,
  options,
  answer,
  explanation,
  difficulty,
  relatedInterests,
  kind,
  why: `This question checks ${skill.toLowerCase()} evidence in the context of ${relatedInterests.join(" + ")}.`,
});

/**
 * Curated, age-appropriate evidence questions for every Interest Constellation
 * option currently available in FIGR.IT. The assessment is assembled from this
 * bank at runtime so the same student does not receive a generic fixed quiz.
 */
export const interestQuestionBank: Record<string, DynamicQuestion[]> = {
  Programming: [
    make("int-programming-1", "Logical", "A program gives the correct result for most inputs but fails for one edge case. What should you do first?", ["Rewrite the whole project", "Reproduce the failing case and trace the logic", "Change the colours", "Ignore the case"], 1, "Reproducing the failing case gives testable evidence about where the logic breaks.", ["Programming"], "Scenario", "Applied"),
    make("int-programming-2", "Practical", "A button in an app does nothing when clicked. Which check is most useful first?", ["The click handler", "The page title", "The logo size", "The laptop wallpaper"], 0, "The click handler is directly connected to the observed behaviour.", ["Programming"], "Field awareness"),
  ],
  Mathematics: [
    make("int-math-1", "Numerical", "A value rises from 80 to 100. What is the percentage increase?", ["20%", "25%", "40%", "80%"], 1, "The increase is 20 on a base of 80, so 20/80 = 25%.", ["Mathematics"], "Aptitude"),
    make("int-math-2", "Logical", "Which statement is enough to prove that an even number is divisible by 2?", ["It is larger than 10", "It can be written as 2 × an integer", "It ends in 5", "It is positive"], 1, "That is the definition of an even integer.", ["Mathematics"], "Aptitude"),
  ],
  "Problem Solving": [
    make("int-problem-1", "Logical", "A project has three possible causes for the same error. What is the strongest next step?", ["Guess the most complicated cause", "Test one cause at a time", "Change everything together", "Wait for the error to disappear"], 1, "Testing one variable at a time helps isolate the real cause.", ["Problem Solving"], "Scenario", "Applied"),
    make("int-problem-2", "Organization", "You have four tasks and only one hour. What should you do first?", ["Start randomly", "Rank tasks by urgency and impact", "Do the longest task regardless", "Open all tasks together"], 1, "Prioritising by urgency and impact creates a workable sequence.", ["Problem Solving"], "Scenario"),
  ],
  "AI & Data": [
    make("int-ai-1", "Numerical", "A dataset is 10, 12, 11, 13, 54. Which value should you investigate as a possible outlier?", ["10", "12", "13", "54"], 3, "54 is far away from the cluster of values around 10–13.", ["AI & Data"], "Aptitude"),
    make("int-ai-2", "Logical", "A model performs well on training data but poorly on new data. What is the main concern?", ["Overfitting", "The font size", "Too many users", "The file name"], 0, "Strong training performance with weak new-data performance is a classic sign of overfitting.", ["AI & Data"], "Field awareness", "Applied"),
  ],
  Cybersecurity: [
    make("int-cyber-1", "Practical", "You receive an urgent email asking you to reset your password through an unfamiliar link. What is safest?", ["Click immediately", "Open the official site separately and verify the request", "Forward your password", "Disable antivirus"], 1, "Verifying through the official service avoids trusting a potentially malicious link.", ["Cybersecurity"], "Scenario"),
    make("int-cyber-2", "Logical", "Why is reusing one password across many websites risky?", ["It makes typing slower", "One breach can expose multiple accounts", "It changes your username", "It reduces internet speed"], 1, "Credential reuse lets attackers try the same password on other services.", ["Cybersecurity"], "Field awareness"),
  ],
  Design: [
    make("int-design-1", "Creativity", "Users repeatedly miss an important button. What should guide the redesign first?", ["Observed user behaviour", "Your favourite colour", "More animation", "A longer page"], 0, "Observed behaviour is stronger design evidence than personal preference.", ["Design"], "Scenario"),
    make("int-design-2", "Practical", "Text looks stylish but is difficult to read. Which change should come first?", ["Improve contrast and size", "Add another font", "Add more decoration", "Hide the text"], 0, "Readability is a basic usability requirement.", ["Design"], "Field awareness"),
  ],
  Writing: [
    make("int-writing-1", "Communication", "Which opening is strongest for an explanatory article?", ["A clear statement of the topic and why it matters", "Five unrelated quotes", "A list with no context", "A conclusion before the topic"], 0, "A clear opening gives readers purpose and direction.", ["Writing"], "Aptitude"),
    make("int-writing-2", "Organization", "You have many ideas for an essay. What should you do before drafting?", ["Arrange them into a logical outline", "Use all ideas in random order", "Delete the main point", "Change topics repeatedly"], 0, "An outline helps organize evidence around a clear argument.", ["Writing"], "Scenario"),
  ],
  Communication: [
    make("int-communication-1", "Communication", "A teammate misunderstands your explanation. What is the most useful response?", ["Repeat the same words louder", "Use a simpler example and check understanding", "Stop explaining", "Use more jargon"], 1, "Adapting the explanation and checking understanding improves communication.", ["Communication"], "Scenario"),
    make("int-communication-2", "Logical", "Which feedback is most actionable?", ["This is bad", "Improve the introduction by stating the main point earlier", "I do not like it", "Make everything better"], 1, "Specific feedback identifies what to change and where.", ["Communication"], "Aptitude"),
  ],
  "Public Speaking": [
    make("int-speaking-1", "Communication", "Your audience looks confused during a presentation. What should you do?", ["Speed up", "Pause, rephrase, and use an example", "Ignore them", "Read the slide word for word"], 1, "A speaker should adapt when audience understanding drops.", ["Public Speaking"], "Scenario"),
    make("int-speaking-2", "Organization", "What makes a short presentation easier to follow?", ["One clear message with a beginning, middle and end", "As many topics as possible", "No structure", "Only complex terms"], 0, "A simple structure helps the audience follow the argument.", ["Public Speaking"], "Field awareness"),
  ],
  Teaching: [
    make("int-teaching-1", "Communication", "After explaining a concept, what is the best way to check understanding?", ["Ask a targeted concept question", "Ask only if everyone is present", "Repeat the same sentence", "Give the answer immediately"], 0, "A targeted question reveals whether the learner understood the idea.", ["Teaching"], "Scenario"),
    make("int-teaching-2", "Creativity", "A learner does not understand your first explanation. What is a strong next move?", ["Use a different example or representation", "Say the same words faster", "Skip the concept", "Blame the learner"], 0, "Alternative examples can connect the same concept to prior knowledge.", ["Teaching"], "Scenario"),
  ],
  Science: [
    make("int-science-1", "Logical", "An experiment gives an unexpected result. What should you do before concluding the theory is wrong?", ["Repeat and check the method", "Hide the result", "Change the data", "Stop measuring"], 0, "Replication and method checks help distinguish error from genuine evidence.", ["Science"], "Aptitude"),
    make("int-science-2", "Numerical", "Three measurements are 9.8, 10.0 and 10.2. What is their mean?", ["9.8", "10.0", "10.2", "30.0"], 1, "The sum is 30, divided by 3 gives 10.0.", ["Science"], "Aptitude"),
  ],
  Medicine: [
    make("int-medicine-1", "Practical", "A patient reports two symptoms. What is the safest first professional step?", ["Assume a diagnosis immediately", "Gather relevant history and observations", "Ignore one symptom", "Recommend random medicine"], 1, "Careful history and observation should come before conclusions.", ["Medicine"], "Scenario"),
    make("int-medicine-2", "Organization", "Why are accurate patient records important?", ["They support continuity and safe decisions", "They make pages longer", "They replace examination", "They remove all uncertainty"], 0, "Accurate records help clinicians understand prior findings and care.", ["Medicine"], "Field awareness"),
  ],
  "Law & Society": [
    make("int-law-1", "Logical", "Which evidence is most relevant to an argument?", ["Evidence directly supporting or challenging the claim", "The longest paragraph", "The most difficult vocabulary", "Anything repeated many times"], 0, "Relevant evidence has a logical relationship to the claim.", ["Law & Society"], "Aptitude"),
    make("int-law-2", "Communication", "Two sides disagree about a rule. What is the strongest way to present your position?", ["State the claim, evidence and reasoning", "Attack the other person", "Avoid the rule itself", "Use only emotion"], 0, "A clear argument links a claim to evidence and reasoning.", ["Law & Society"], "Scenario"),
  ],
  Business: [
    make("int-business-1", "Numerical", "A product costs ₹400 and sells for ₹500. What is the profit?", ["₹50", "₹100", "₹400", "₹900"], 1, "Profit is selling price minus cost price: ₹100.", ["Business"], "Aptitude"),
    make("int-business-2", "Logical", "Sales fall for two months. What is the best first management response?", ["Inspect customer, product and sales data", "Raise every price immediately", "Ignore the trend", "Change the logo only"], 0, "Evidence should be reviewed before choosing a response.", ["Business"], "Scenario"),
  ],
  Entrepreneurship: [
    make("int-entrepreneurship-1", "Practical", "You have an idea for an app. What is the strongest early test?", ["Build every feature first", "Show a simple prototype to target users", "Buy ads immediately", "Choose a logo for a month"], 1, "A small prototype tests whether the problem and solution matter to users.", ["Entrepreneurship"], "Scenario"),
    make("int-entrepreneurship-2", "Organization", "A startup has limited time and money. What should it prioritize?", ["The highest-value assumptions and core problem", "Every possible feature", "Office decoration", "The longest business plan"], 0, "Testing the riskiest, highest-value assumptions conserves scarce resources.", ["Entrepreneurship"], "Field awareness"),
  ],
  Finance: [
    make("int-finance-1", "Numerical", "₹10,000 earns 10% simple interest for one year. What is the interest?", ["₹100", "₹500", "₹1,000", "₹10,000"], 2, "10% of ₹10,000 is ₹1,000.", ["Finance"], "Aptitude"),
    make("int-finance-2", "Logical", "Why compare a company's results across several years?", ["To identify trends", "To avoid calculations", "To guarantee profit", "To remove risk"], 0, "Multi-year comparison helps distinguish trends from one-off results.", ["Finance"], "Field awareness"),
  ],
  Accounting: [
    make("int-accounting-1", "Numerical", "In the accounting equation, Assets equal:", ["Liabilities + Equity", "Revenue − Tax", "Cash + Sales", "Expenses − Profit"], 0, "The standard accounting equation is Assets = Liabilities + Equity.", ["Accounting"], "Field awareness"),
    make("int-accounting-2", "Organization", "A receipt is missing during reconciliation. What should you do?", ["Invent an amount", "Flag it and verify the transaction", "Delete the month", "Ignore the difference"], 1, "A missing record should be flagged and verified, not guessed.", ["Accounting"], "Scenario", "Applied"),
  ],
  Marketing: [
    make("int-marketing-1", "Numerical", "A campaign gets 50 clicks from 1,000 views. What is the click-through rate?", ["0.5%", "5%", "20%", "50%"], 1, "50/1000 = 0.05, or 5%.", ["Marketing"], "Aptitude"),
    make("int-marketing-2", "Creativity", "You want to compare two headlines fairly. What should you do?", ["Show each version to similar audience groups and compare results", "Change the headline and audience at the same time", "Ask only the writer", "Choose the longer headline"], 0, "A controlled comparison isolates the effect of the headline.", ["Marketing"], "Scenario", "Applied"),
  ],
  "Food & Cooking": [
    make("int-food-1", "Practical", "What is the safest way to reduce raw-food cross-contamination?", ["Use the same board for everything", "Separate tools and wash surfaces properly", "Only rinse with water", "Store raw food above cooked food"], 1, "Separate equipment and proper cleaning reduce harmful transfer.", ["Food & Cooking"], "Field awareness"),
    make("int-food-2", "Numerical", "A recipe for four uses 2 cups of flour. How much is needed for eight?", ["2 cups", "3 cups", "4 cups", "8 cups"], 2, "Doubling servings doubles the flour to 4 cups.", ["Food & Cooking"], "Aptitude"),
  ],
  Hospitality: [
    make("int-hospitality-1", "Communication", "A guest reports the wrong order. What should you do first?", ["Argue", "Listen, acknowledge and confirm the issue", "Walk away", "Blame another team"], 1, "Listening and confirming the issue starts a calm resolution.", ["Hospitality"], "Scenario"),
    make("int-hospitality-2", "Organization", "Several guest requests arrive at once. What helps most?", ["Prioritize by urgency and communicate expected timing", "Ignore the difficult ones", "Do them randomly", "Promise all will be instant"], 0, "Prioritization and clear expectations improve service reliability.", ["Hospitality"], "Scenario"),
  ],
  Robotics: [
    make("int-robotics-1", "Practical", "A robot moves in the wrong direction after a motor change. What should you check first?", ["Motor wiring and direction settings", "The project name", "The table colour", "The presentation font"], 0, "Wiring and direction settings directly affect motor movement.", ["Robotics"], "Scenario", "Applied"),
    make("int-robotics-2", "Logical", "A distance sensor returns noisy values. Which action is most reasonable?", ["Take repeated readings and inspect the pattern", "Use the first value forever", "Remove all sensors", "Increase wheel size"], 0, "Repeated readings help determine whether the noise is random or systematic.", ["Robotics"], "Aptitude"),
  ],
  Gaming: [
    make("int-gaming-1", "Logical", "A game level is too easy for most players. What evidence should guide a change?", ["Player completion and failure data", "Only the developer's favourite level", "The logo", "The game title length"], 0, "Gameplay data gives evidence about actual player difficulty.", ["Gaming"], "Scenario"),
    make("int-gaming-2", "Creativity", "Which prototype best tests a new game mechanic?", ["A small playable version focused on that mechanic", "A finished cinematic trailer", "A complete 50-level game", "Only a logo sketch"], 0, "A focused playable prototype tests whether the mechanic is engaging.", ["Gaming"], "Field awareness"),
  ],
  "Helping People": [
    make("int-helping-1", "Communication", "Someone explains a problem but you are not sure what they need. What should you do first?", ["Give immediate advice", "Ask a clarifying question and listen", "Change the subject", "Assume the cause"], 1, "Clarifying the need before advising reduces misunderstanding.", ["Helping People"], "Scenario"),
    make("int-helping-2", "Practical", "A person needs support beyond your knowledge. What is the responsible action?", ["Pretend to know", "Connect them with an appropriate qualified resource", "Ignore them", "Promise a guaranteed outcome"], 1, "Responsible support includes knowing when to refer to qualified help.", ["Helping People"], "Scenario"),
  ],
  Leadership: [
    make("int-leadership-1", "Organization", "Two teammates disagree about priorities. What should a leader do first?", ["Choose a side immediately", "Clarify the shared goal and evidence for each priority", "Ignore the disagreement", "Give both the same task"], 1, "A shared goal and evidence create a basis for a fair decision.", ["Leadership"], "Scenario"),
    make("int-leadership-2", "Communication", "A teammate makes a mistake. Which response best supports improvement?", ["Publicly embarrass them", "Discuss the issue specifically and agree on a next step", "Say nothing", "Take over all their work"], 1, "Specific, constructive feedback supports accountability and learning.", ["Leadership"], "Scenario"),
  ],
};

const universalQuestions: DynamicQuestion[] = [
  make("dyn-universal-logical", "Logical", "A plan works for three cases but fails for one. What is the most useful next step?", ["Find what is different about the failed case", "Ignore it", "Change every part at once", "Assume the user is wrong"], 0, "Comparing the failed case with successful cases helps isolate the cause.", ["General"], "Aptitude"),
  make("dyn-universal-numerical", "Numerical", "A task takes 20 minutes and is repeated three times. How long does it take in total?", ["40 minutes", "50 minutes", "60 minutes", "80 minutes"], 2, "20 × 3 = 60 minutes.", ["General"], "Aptitude"),
  make("dyn-universal-communication", "Communication", "Which explanation is easiest to verify?", ["One with a clear claim and example", "One with only jargon", "One with no evidence", "One that changes the topic"], 0, "A clear claim plus example gives the listener something concrete to check.", ["General"], "Aptitude"),
  make("dyn-universal-organization", "Organization", "A deadline moves earlier. What should you do first?", ["Re-prioritize the remaining tasks", "Keep the old plan unchanged", "Add unrelated work", "Wait until the last hour"], 0, "A changed constraint requires updating priorities and sequencing.", ["General"], "Scenario"),
  make("dyn-universal-practical", "Practical", "A device suddenly stops working. What is a sensible first check?", ["Power and connections", "Buy a new device immediately", "Change your account name", "Ignore the issue"], 0, "Start with simple, likely causes before replacing the system.", ["General"], "Scenario"),
  make("dyn-universal-creativity", "Creativity", "You need three possible solutions to a problem. What is a useful first step?", ["Generate several ideas before judging them", "Commit to the first idea immediately", "Copy one answer without checking", "Avoid alternatives"], 0, "Separating idea generation from evaluation helps create more options.", ["General"], "Aptitude"),
];

const crossInterestQuestions: DynamicQuestion[] = [
  make("cross-programming-ai", "Logical", "A data-based app gives inconsistent predictions. Which investigation combines programming and AI thinking best?", ["Check the input data and trace the prediction pipeline", "Change the app icon", "Add more pages", "Rename the model"], 0, "Both data quality and program flow can affect model predictions.", ["Programming", "AI & Data"], "Cross-interest", "Applied"),
  make("cross-math-ai", "Numerical", "A model is correct on 84 of 100 test examples. What is its accuracy?", ["16%", "42%", "84%", "100%"], 2, "84 correct out of 100 is 84% accuracy.", ["Mathematics", "AI & Data"], "Cross-interest"),
  make("cross-programming-problem", "Logical", "A bug appears only after the fifth step of a workflow. What is the strongest debugging approach?", ["Inspect the state around step five and reproduce it", "Rewrite unrelated screens", "Ignore the sequence", "Change the colours"], 0, "Reproducing the sequence and checking state near failure narrows the cause.", ["Programming", "Problem Solving"], "Cross-interest", "Applied"),
  make("cross-design-communication", "Communication", "Users misread a call-to-action. Which change best combines design and communication?", ["Rewrite the label clearly and test its visual prominence", "Add decorative shapes only", "Use smaller text", "Remove the action"], 0, "Clear wording and visual hierarchy work together to communicate action.", ["Design", "Communication"], "Cross-interest", "Applied"),
  make("cross-business-finance", "Numerical", "A business earns ₹1,20,000 and spends ₹90,000 in a month. What is the monthly surplus?", ["₹20,000", "₹30,000", "₹90,000", "₹2,10,000"], 1, "₹1,20,000 − ₹90,000 = ₹30,000.", ["Business", "Finance"], "Cross-interest"),
  make("cross-teaching-speaking", "Communication", "During a short lesson, what best combines teaching and public speaking?", ["Explain one idea clearly, use an example, then check understanding", "Speak continuously without questions", "Use maximum jargon", "Read every word from the slide"], 0, "Clear explanation plus a comprehension check supports both delivery and learning.", ["Teaching", "Public Speaking"], "Cross-interest"),
  make("cross-medicine-helping", "Communication", "Someone describes a health concern. What is the safest helpful response if you are not a clinician?", ["Diagnose them", "Listen, avoid medical claims, and encourage qualified help when needed", "Suggest random medicine", "Promise recovery"], 1, "Helpful communication should respect the limits of non-clinical advice.", ["Medicine", "Helping People"], "Cross-interest"),
  make("cross-robotics-programming", "Practical", "A robot sensor reads correctly, but the robot does not react. What should you inspect next?", ["The code path that uses the sensor value", "The poster design", "The robot's name", "The classroom lighting only"], 0, "If sensing works, the next likely issue is how software processes and acts on that input.", ["Robotics", "Programming"], "Cross-interest", "Applied"),
  make("cross-marketing-writing", "Communication", "Which headline test best combines writing and marketing evidence?", ["Create two clear variants and compare response rates", "Pick the longest one", "Use different audiences and offers for each", "Ask only the writer"], 0, "Comparable variants and response data make the result more meaningful.", ["Marketing", "Writing"], "Cross-interest", "Applied"),
  make("cross-leadership-communication", "Communication", "A team misses a milestone. What is the strongest leadership conversation?", ["Clarify what happened, agree on responsibilities, and set the next checkpoint", "Blame one person immediately", "Avoid discussing it", "Change the goal without explanation"], 0, "Clear facts, ownership and next steps support accountability.", ["Leadership", "Communication"], "Cross-interest", "Applied"),
];

function includesAll(selected: Set<string>, related: string[]) {
  return related.every((interest) => selected.has(interest));
}

/**
 * Builds a stable 10-question assessment from the learner's selected interests.
 * No API key is required; this is intentionally deterministic for a reliable SIH demo.
 */
export function generatePersonalizedAssessment(profile: StudentProfile, count = 10): Question[] {
  const selectedInterests = [...new Set(profile.interests)]
    .filter((item) => interestQuestionBank[item])
    .slice(0, 6);
  const selectedSet = new Set(selectedInterests);
  const output: DynamicQuestion[] = [];
  const used = new Set<string>();

  const add = (question?: DynamicQuestion) => {
    if (!question || used.has(question.id) || output.length >= count) return;
    used.add(question.id);
    output.push(question);
  };

  // 1) Every selected interest gets direct representation.
  selectedInterests.forEach((interest) => add(interestQuestionBank[interest]?.[0]));

  // 2) Add at most two pair questions so the assessment can test combinations
  // such as Programming + AI & Data without crowding out broad evidence.
  crossInterestQuestions
    .filter((question) => question.relatedInterests && includesAll(selectedSet, question.relatedInterests))
    .slice(0, 2)
    .forEach(add);

  // 3) Reserve broad transferable questions. Pick skills that are currently
  // under-represented by the selected field questions.
  const skillCount = (skill: CoreSkill) => output.filter((q) => q.skill === skill).length;
  [...universalQuestions]
    .sort((a, b) => skillCount(a.skill) - skillCount(b.skill))
    .slice(0, Math.min(2, Math.max(0, count - output.length)))
    .forEach(add);

  // 4) Add a second evidence question from the learner's selected interests.
  selectedInterests.forEach((interest) => add(interestQuestionBank[interest]?.[1]));

  // 5) Fill any remaining slots with broad questions, prioritising missing skills.
  [...universalQuestions]
    .sort((a, b) => skillCount(a.skill) - skillCount(b.skill))
    .forEach(add);

  return output.slice(0, count);
}
