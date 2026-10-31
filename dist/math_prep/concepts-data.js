// Original learning notes and hypothetical engineering examples; reviewed 2026-10-31.
// A concept's stage is its first useful home, not a claim that one reading masters it.
export const concepts = [
  {
    id: 'fractions-as-units', stage: 'arithmetic', title: 'Fractions: choose a smaller unit',
    question: 'Why do denominators need to match when I add?',
    intuition: 'A denominator names the size of the pieces. Thirds and quarters are different units, just as meters and centimeters are. Rewrite both quantities in the same size pieces before counting them together.',
    why: 'Equivalent fractions change the description without changing the amount. This is your first practice at preserving meaning while changing notation.',
    example: '1/3 + 1/4 = 4/12 + 3/12 = 7/12. Multiplying by 1/4 instead means taking a quarter of an amount: (1/4) × 12 = 3.',
    trap: 'Adding denominators: 1/3 + 1/4 is not 2/7.',
    engineering: 'Mixtures, gear ratios, scale drawings, and fractions of an hour all depend on this same reasoning.',
    tryThis: 'Explain 3/4 + 1/8 using eighths. Check: 7/8.',
    source: { title: 'OpenStax: fractions', url: 'https://openstax.org/books/prealgebra-2e/pages/4-introduction-to-fractions' }
  },
  {
    id: 'rates-and-ratios', stage: 'arithmetic', title: 'Ratios: what changes together?',
    question: 'What does “per” actually tell me?',
    intuition: 'A ratio compares two quantities. A rate often compares different units. “Three meters per second” packages a change in distance with each unit of time; it is more useful than a distance alone.',
    why: 'Unit rates let you compare differently sized situations on the same basis.',
    example: 'A model rover travels 18 meters in 6 seconds. Its average speed is 18/6 = 3 m/s. At that constant speed, another 5 seconds corresponds to 15 meters.',
    trap: 'An average rate does not prove the rate stayed constant at every instant.',
    engineering: 'Speed, energy per kilogram, data per second, and mass per volume describe how systems behave.',
    tryThis: 'A test uses 12 liters in 8 minutes. Find liters per minute. Check: 1.5 L/min.',
    source: { title: 'OpenStax: ratios and rates', url: 'https://openstax.org/books/prealgebra-2e/pages/5-6-ratios-and-rate' }
  },
  {
    id: 'percent-base', stage: 'arithmetic', title: 'Percent: always ask “of what?”',
    question: 'Why does a 20% rise followed by a 20% fall not cancel?',
    intuition: 'Percent means a fraction out of one hundred. Its value depends on the quantity it acts on. When the starting quantity changes, the same percentage describes a different amount.',
    why: 'Naming the base prevents misleading comparisons and incorrect estimates of remaining capacity.',
    example: 'Starting at 100, a 20% increase gives 120. A 20% decrease from 120 removes 24, leaving 96. The second percentage used a larger base.',
    trap: 'Treating percentage points and percent change as interchangeable.',
    engineering: 'Mass reserves, battery charge, efficiency, uncertainty, and test improvements all need a clearly stated base.',
    tryThis: 'A 40 kg allocation has 10 kg unused. What percent of the allocation is unused? Check: 25%.',
    source: { title: 'OpenStax: understand percent', url: 'https://openstax.org/books/prealgebra-2e/pages/6-1-understand-percent' }
  },
  {
    id: 'signed-numbers', stage: 'arithmetic', title: 'Negative numbers: direction relative to a reference',
    question: 'Can a negative answer be physically meaningful?',
    intuition: 'Zero is a chosen reference. A sign can tell you which side of that reference you are on, or which direction a change points. Negative does not automatically mean impossible.',
    why: 'Once you choose a positive direction, signed arithmetic tracks opposing changes without a new verbal rule for every situation.',
    example: 'Define upward as positive. A lift moves +8 meters and then −11 meters. Its net displacement is −3 meters: three meters below its starting point.',
    trap: 'Confusing displacement with total distance. The lift traveled 19 meters.',
    engineering: 'Velocity components, electrical potential differences, and temperature changes can carry signs.',
    tryThis: 'Explain −4 − (−7) on a number line. Check: 3.',
    source: { title: 'OpenStax: elementary algebra foundations', url: 'https://openstax.org/books/elementary-algebra-2e/pages/1-introduction' }
  },
  {
    id: 'variables-meaning', stage: 'prealgebra', title: 'Variables: give a quantity a name',
    question: 'Why replace perfectly good numbers with letters?',
    intuition: 'A letter lets one statement describe many cases. It may name an unknown, a quantity that varies, or a fixed parameter. Write what it means and its units before manipulating it.',
    why: 'A formula preserves a relationship when the particular numbers change. You solve a family of problems instead of memorizing individual answers.',
    example: 'If a device uses P watts for t hours, E = Pt gives energy in watt-hours. With P = 12 and t = 3, E = 36 Wh.',
    trap: 'Reading Pt as a two-letter word, or assuming every letter is an unknown to solve.',
    engineering: 'Named quantities connect a physical sketch to a reusable model.',
    tryThis: 'Write a formula for the total mass of n identical 2 kg modules. Check: M = 2n kg.',
    source: { title: 'OpenStax: the language of algebra', url: 'https://openstax.org/books/prealgebra-2e/pages/2-1-use-the-language-of-algebra' }
  },
  {
    id: 'equations-balance', stage: 'prealgebra', title: 'Equations: preserve the balance',
    question: 'What am I actually doing when I “move” a term?',
    intuition: 'An equals sign claims that two expressions have the same value. Solving keeps that claim true while revealing the unknown. “Moving” is shorthand for applying a valid operation to both sides.',
    why: 'Understanding the operation makes the method survive unfamiliar symbols and complicated formulas.',
    example: 'For 3x + 5 = 20, subtract 5 from both sides: 3x = 15. Divide both sides by 3: x = 5. Substitute back: 3(5) + 5 = 20.',
    trap: 'Changing just one side, or dividing by an expression that might be zero.',
    engineering: 'Rearranging a known physical relationship is often the main mathematical step in a design calculation.',
    tryThis: 'Solve 4m − 6 = 18 and check it. Answer: m = 6.',
    source: { title: 'OpenStax: properties of equality', url: 'https://openstax.org/books/elementary-algebra-2e/pages/2-1-solve-equations-using-the-subtraction-and-addition-properties-of-equality' }
  },
  {
    id: 'units-as-algebra', stage: 'prealgebra', title: 'Units: a second line of reasoning',
    question: 'How can units tell me my answer is wrong?',
    intuition: 'A measured quantity is a number attached to a unit. Unit conversions multiply by a ratio equal to one. Arrange the ratio so the unwanted units cancel and the desired ones remain.',
    why: 'Units expose many wrong formulas before you trust their numerical answers. Matching dimensions is necessary, although it does not prove a formula is correct.',
    example: '72 km/h × (1,000 m / 1 km) × (1 h / 3,600 s) = 20 m/s.',
    trap: 'Treating kilograms as force, or converting square centimeters with only one factor of 100.',
    engineering: 'NASA’s Mars Climate Orbiter loss illustrates why units and interface checks belong in engineering work.',
    tryThis: 'Convert 250 milliseconds to seconds. Check: 0.250 s.',
    source: { title: 'NASA: Mars Climate Orbiter', url: 'https://science.nasa.gov/mission/mars-climate-orbiter/' }
  },
  {
    id: 'powers-scale', stage: 'prealgebra', title: 'Powers: keep track of scale',
    question: 'What does a negative exponent mean?',
    intuition: 'Positive whole-number powers repeat multiplication. Extending the same pattern backward introduces reciprocals: 10³, 10², 10¹, 10⁰, 10⁻¹ become 1,000, 100, 10, 1, 0.1.',
    why: 'Scientific notation separates an ordinary-size coefficient from a power of ten, making huge and tiny quantities easier to compare.',
    example: '0.00042 = 4.2 × 10⁻⁴. Multiplying (3 × 10⁵)(2 × 10⁻²) gives 6 × 10³.',
    trap: 'A negative exponent does not mean a negative value. Also, −3² and (−3)² differ.',
    engineering: 'Space distances, sensor voltages, and computational tolerances span many orders of magnitude.',
    tryThis: 'Write 7,200,000 in scientific notation. Check: 7.2 × 10⁶.',
    source: { title: 'OpenStax: integer exponents and scientific notation', url: 'https://openstax.org/books/elementary-algebra-2e/pages/6-7-integer-exponents-and-scientific-notation' }
  },
  {
    id: 'distributive-structure', stage: 'algebra', title: 'Distribute: account for every part',
    question: 'Why does the multiplier reach every term?',
    intuition: 'Three copies of a bundle containing x objects and two extra objects means three copies of x and three copies of two. Parentheses group a complete quantity, not just the nearest term.',
    why: 'Distributing and factoring are opposite ways to describe the same structure. One exposes terms; the other exposes shared factors.',
    example: '3(x + 2) = 3x + 6. A rectangle of height 3 and width x + 2 can be split into areas 3x and 6.',
    trap: 'Writing 3(x + 2) = 3x + 2, or losing a sign in −2(x − 5).',
    engineering: 'Grouped component budgets and symbolic models become easier to simplify when you recognize structure.',
    tryThis: 'Expand −2(x − 5). Check: −2x + 10.',
    source: { title: 'OpenStax: real-number properties', url: 'https://openstax.org/books/elementary-algebra-2e/pages/1-9-properties-of-real-numbers' }
  },
  {
    id: 'slope-change', stage: 'algebra', title: 'Slope: change divided by change',
    question: 'How does a line become a useful model?',
    intuition: 'Slope tells you how much the output changes for each unit of input change. The intercept tells you the output at an input of zero. Together they describe a constant-rate relationship.',
    why: 'Reading a graph as quantities with units is more valuable than merely recognizing a diagonal line.',
    example: 'A tank starts with 20 liters and gains 3 liters each minute. V = 20 + 3t. The slope is 3 L/min; the intercept is 20 L.',
    trap: 'Calculating y/x instead of a change ratio when the line does not pass through the origin.',
    engineering: 'Calibration curves and simple sensor models often begin with a linear approximation.',
    tryThis: 'Find the slope through (2, 7) and (5, 19). Check: 4.',
    source: { title: 'OpenStax: slope of a line', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-4-understand-slope-of-a-line' }
  },
  {
    id: 'systems-constraints', stage: 'algebra', title: 'Systems: satisfy two constraints at once',
    question: 'Why can one equation be insufficient?',
    intuition: 'One equation with two unknowns often permits many pairs. A second independent condition narrows the possibilities. A solution must satisfy every condition simultaneously.',
    why: 'Design problems involve several requirements at once: counts, masses, lengths, capacities, or costs. Systems make those shared requirements explicit.',
    example: 'A kit has 8 parts. Some weigh 1 kg and others 2 kg; total mass is 11 kg. With x + y = 8 and x + 2y = 11, subtraction gives y = 3 and x = 5.',
    trap: 'Checking the answer in only one equation. Some systems have no solution or infinitely many.',
    engineering: 'Balancing flows and interpreting several sensor measurements eventually builds on this idea.',
    tryThis: 'Solve x + y = 10 and x − y = 4. Check: x = 7, y = 3.',
    source: { title: 'OpenStax: systems of linear equations', url: 'https://openstax.org/books/elementary-algebra-2e/pages/5-introduction' }
  },
  {
    id: 'inequalities-limits', stage: 'algebra', title: 'Inequalities: a design can have a range',
    question: 'What if I need an acceptable region instead of one answer?',
    intuition: 'An inequality describes a boundary and the values on an allowed side. It matches everyday requirements such as at most, at least, below a limit, or within a budget.',
    why: 'Engineering rarely asks for a single magic value. It asks which choices satisfy constraints, including room for uncertainty.',
    example: 'A 10 kg carrier holds identical 2 kg units under a 24 kg total limit. 10 + 2n ≤ 24 gives n ≤ 7. Because n counts units, use nonnegative whole numbers.',
    trap: 'Forgetting that multiplying or dividing both sides by a negative reverses the inequality.',
    engineering: 'Mass limits and power allocations are naturally expressed as inequalities.',
    tryThis: 'Solve −2x < 6. Check: x > −3.',
    source: { title: 'OpenStax: linear inequalities', url: 'https://openstax.org/books/elementary-algebra-2e/pages/2-7-solve-linear-inequalities' }
  },
  {
    id: 'similarity-shape', stage: 'geometry', title: 'Similarity: same shape, new size',
    question: 'What stays unchanged in a scale drawing?',
    intuition: 'Similar figures share corresponding angles and one common scale factor for corresponding lengths. Ratios between their own corresponding sides stay the same even as size changes.',
    why: 'Similarity lets you infer an inaccessible length from a smaller measurable version. It also explains why right-triangle trigonometry can depend on angle rather than triangle size.',
    example: 'A 1:20 drawing shows a 6 cm arm. The real length is 6 × 20 = 120 cm, or 1.2 m.',
    trap: 'Applying a length scale factor directly to area or volume.',
    engineering: 'Scale drawings describe geometry; a small physical model does not automatically reproduce full-size forces or airflow.',
    tryThis: 'At 1:50 scale, how long is a drawing of a 4 m beam? Check: 8 cm.',
    source: { title: 'OpenStax: similar figures and triangles', url: 'https://openstax.org/books/prealgebra-2e/pages/9-3-use-properties-of-angles-triangles-and-the-pythagorean-theorem' }
  },
  {
    id: 'pythagorean-distance', stage: 'geometry', title: 'Pythagoras: combine perpendicular distances',
    question: 'Why is the diagonal not just the sum of the sides?',
    intuition: 'Walking east and then north traces two sides. The straight-line route is shorter. In a right triangle, the squares of the two perpendicular side lengths add to the square of the diagonal.',
    why: 'The theorem connects a coordinate description to an actual length. Later, the same structure gives the size of a vector.',
    example: 'A robot target is 3 m east and 4 m north. Its straight-line distance is √(3² + 4²) = 5 m, while that two-leg route is 7 m.',
    trap: 'Using a² + b² = c² for a triangle without a right angle.',
    engineering: 'Position errors, component geometry, and perpendicular motion all reuse this relationship.',
    tryThis: 'Find a diagonal with perpendicular components 5 and 12. Check: 13.',
    source: { title: 'OpenStax: right-triangle geometry', url: 'https://openstax.org/books/prealgebra-2e/pages/9-3-use-properties-of-angles-triangles-and-the-pythagorean-theorem' }
  },
  {
    id: 'scale-area-volume', stage: 'geometry', title: 'Scaling: bigger changes more than length',
    question: 'Why does doubling a design do more than double everything?',
    intuition: 'Area combines two lengths; volume combines three. Scaling every length by k therefore multiplies area by k² and volume by k³.',
    why: 'Keeping the same shape does not keep the same relationship between surface and interior. Geometry alone can change the balance between competing requirements.',
    example: 'A cube with 1 m sides has 6 m² of surface and 1 m³ of volume. With 2 m sides it has 24 m² of surface and 8 m³ of volume.',
    trap: 'Assuming mass always scales with volume; hollow structures and changing materials need a different model.',
    engineering: 'Habitat size, exposed surfaces, and packaging make scaling a valuable early design question.',
    tryThis: 'Triple every length. Area changes by what factor? Volume? Check: 9 and 27.',
    source: { title: 'NIST: circumference, area, and volume', url: 'https://www.nist.gov/pml/owm/circumference-area-and-volume' }
  },
  {
    id: 'functions-machines', stage: 'algebra2', title: 'Functions: connect input to output',
    question: 'What does f(x) add beyond ordinary algebra?',
    intuition: 'A function assigns one output to each allowed input. A formula, a graph, a table, or a verbal rule can describe that assignment. The notation f(3) asks for the output when the input is 3.',
    why: 'Thinking about relationships prepares you for calculus, where you study how outputs change and accumulate.',
    example: 'For f(t) = 2t + 5, f(3) = 11. If t means seconds and f means meters, the formula is a position model with a starting position and constant velocity.',
    trap: 'Reading f(x) as f multiplied by x, or ignoring what the axes represent.',
    engineering: 'A sensor calibration is a mapping from a measured signal to an estimated physical quantity.',
    tryThis: 'If g(x) = x² − 1, find g(−3). Check: 8.',
    source: { title: 'OpenStax: functions and notation', url: 'https://openstax.org/books/precalculus-2e/pages/1-1-functions-and-function-notation' }
  },
  {
    id: 'domain-validity', stage: 'algebra2', title: 'Domain: where does the rule make sense?',
    question: 'Can a correct calculation answer an impossible question?',
    intuition: 'A domain is the set of permitted inputs. Some restrictions come from mathematics, such as avoiding division by zero. Others come from the situation, such as nonnegative time or a limited sensor range.',
    why: 'A model is a rule with conditions. Checking those conditions is part of using the rule correctly.',
    example: 'Travel time t = d/v requires v ≠ 0. For a positive distance traveled forward at a positive constant speed, the physical model uses v > 0.',
    trap: 'Canceling (x − 2) from (x² − 4)/(x − 2), then forgetting the original expression still excludes x = 2.',
    engineering: 'Calibration formulas and simplified motion models have operating ranges.',
    tryThis: 'Which input is excluded from 5/(x + 3)? Check: x = −3.',
    source: { title: 'OpenStax: rational expressions', url: 'https://openstax.org/books/intermediate-algebra-2e/pages/7-1-multiply-and-divide-rational-expressions' }
  },
  {
    id: 'factoring-structure', stage: 'algebra2', title: 'Factoring: reveal the hidden pieces',
    question: 'Why undo multiplication after learning to expand?',
    intuition: 'Different forms expose different information. An expanded polynomial is convenient for adding terms; a factored form shows the pieces being multiplied and helps reveal when the result is zero.',
    why: 'You are not changing the quantity. You are choosing a representation that makes the question easier.',
    example: 'x² − 5x + 6 = (x − 2)(x − 3). To solve x² − 5x + 6 = 0, one factor must be zero, so x = 2 or x = 3.',
    trap: 'Setting each factor to zero when their product equals something other than zero.',
    engineering: 'Recognizing algebraic structure later helps you interpret equations describing system behavior.',
    tryThis: 'Factor x² + 7x + 12. Check: (x + 3)(x + 4).',
    source: { title: 'OpenStax: factoring', url: 'https://openstax.org/books/elementary-algebra-2e/pages/7-introduction' }
  },
  {
    id: 'quadratics-curvature', stage: 'algebra2', title: 'Quadratics: change need not be constant',
    question: 'What is different about a squared input?',
    intuition: 'Starting at x = 0 and moving right in equal steps, y = x² produces increasingly large increases in y. A quadratic graph curves rather than maintaining a constant slope. Its vertex marks a turning point.',
    why: 'This is an early way to describe behavior that a straight-line model cannot capture.',
    example: 'For y = x² at x = 0, 1, 2, 3, the outputs are 0, 1, 4, 9. Successive output changes are 1, 3, 5, not a constant amount.',
    trap: 'Assuming every curved graph is a parabola, or every algebraic root is physically acceptable.',
    engineering: 'Constant-acceleration position models contain a squared time term; their assumptions matter.',
    tryThis: 'Find the vertex of y = (x − 3)² + 2. Check: (3, 2).',
    source: { title: 'OpenStax: quadratic-function graphs', url: 'https://openstax.org/books/intermediate-algebra-2e/pages/9-6-graph-quadratic-functions-using-properties' }
  },
  {
    id: 'exponentials-multiplication', stage: 'algebra2', title: 'Exponentials: repeated proportional change',
    question: 'How is multiplying each step different from adding each step?',
    intuition: 'A linear sequence adds the same amount. An exponential sequence multiplies by the same factor. Repeated percentage growth or decay therefore changes the amount added or removed at each step.',
    why: 'Distinguishing additive and multiplicative processes prevents major prediction errors.',
    example: 'A hypothetical quantity keeps 80% of its value each cycle. Starting at 100 gives 100, 80, 64, 51.2. After n cycles, Q = 100(0.8)ⁿ.',
    trap: 'Modeling a 20% loss each cycle by subtracting 20 units forever.',
    engineering: 'Some decay and response models are exponential, but the model must fit the physical process and data.',
    tryThis: 'Starting with 50 and doubling three times gives what? Check: 400.',
    source: { title: 'OpenStax: exponential functions', url: 'https://openstax.org/books/intermediate-algebra-2e/pages/10-2-evaluate-and-graph-exponential-functions' }
  },
  {
    id: 'radians-rotation', stage: 'precalculus', title: 'Radians: measure turns using the circle itself',
    question: 'Why introduce another unit for angles?',
    intuition: 'An angle in radians equals its intercepted arc length divided by the circle’s radius. One radian sweeps an arc as long as the radius. A full turn is 2π radians because circumference is 2πr.',
    why: 'Radians connect angular motion directly to distance, and they are the natural angle measure used in calculus.',
    example: 'A radius of 2 m turning through π/2 radians traces an arc s = rθ = π m. That angle is a quarter turn, or 90°.',
    trap: 'Putting degrees into s = rθ without converting them to radians.',
    engineering: 'Rotating joints, wheels, and angular motion use this connection between rotation and length.',
    tryThis: 'Convert 180° to radians. Check: π radians.',
    source: { title: 'OpenStax: angles and radians', url: 'https://openstax.org/books/precalculus-2e/pages/5-1-angles' }
  },
  {
    id: 'trig-projections', stage: 'precalculus', title: 'Trigonometry: connect angle and length',
    question: 'What are sine and cosine useful for?',
    intuition: 'In a right triangle, sine and cosine express side lengths as fractions of the hypotenuse. Because similar triangles share these ratios, the angle determines the fractions regardless of size.',
    why: 'An angle can become a measurable horizontal or vertical distance. Later, the circle extends this idea to rotations and repeating behavior.',
    example: 'A 2 m arm at 30° above horizontal reaches 2 cos(30°) ≈ 1.73 m horizontally and 2 sin(30°) = 1 m vertically.',
    trap: 'Mixing up the reference angle, or using the wrong degree/radian calculator mode.',
    engineering: 'Robot joint geometry, orientation, and component calculations build on these ratios.',
    tryThis: 'A 10-unit hypotenuse makes a 30° angle with the base. Opposite side? Check: 5.',
    source: { title: 'OpenStax: right-triangle trigonometry', url: 'https://openstax.org/books/precalculus-2e/pages/5-4-right-triangle-trigonometry' }
  },
  {
    id: 'vectors-direction', stage: 'precalculus', title: 'Vectors: magnitude is only half the story',
    question: 'Why can two large pushes cancel?',
    intuition: 'A vector has magnitude and direction. Components describe how much points along each chosen axis. Add matching components rather than adding magnitudes indiscriminately.',
    why: 'Direction matters for motion, forces, and orientation. A scalar number alone cannot preserve that information.',
    example: 'A displacement of (3, 4) meters has magnitude 5 m. Add (−3, 1) meters component by component and the result is (0, 5) meters.',
    trap: 'Assuming the magnitude of a sum equals the sum of magnitudes. Opposing vectors can cancel.',
    engineering: 'Robot position and spacecraft motion are naturally described with vectors in a specified coordinate frame.',
    tryThis: 'Add (2, −1) and (−5, 4). Check: (−3, 3).',
    source: { title: 'OpenStax: vectors', url: 'https://openstax.org/books/precalculus/pages/8-8-vectors' }
  },
  {
    id: 'logarithms-undo-powers', stage: 'precalculus', title: 'Logarithms: ask for the exponent',
    question: 'What question does a logarithm answer?',
    intuition: 'A logarithm reverses an exponential relationship. log₂(8) asks which exponent on 2 produces 8. Since 2³ = 8, the answer is 3.',
    why: 'When the unknown is an exponent, ordinary division will not isolate it. Logarithms also compress very wide numerical ranges into manageable scales.',
    example: 'If 100(2ⁿ) = 800, divide by 100 to get 2ⁿ = 8. Then n = log₂(8) = 3. This says three doublings are needed.',
    trap: 'Thinking log(a + b) equals log(a) + log(b); it generally does not.',
    engineering: 'Logarithmic scales appear in signal measurements and orders-of-magnitude comparisons.',
    tryThis: 'Evaluate log₁₀(1,000) and log₁₀(0.01). Check: 3 and −2.',
    source: { title: 'OpenStax: logarithmic functions', url: 'https://openstax.org/books/precalculus-2e/pages/4-3-logarithmic-functions' }
  }
];

export const missions = [
  {
    id: 'mission-units', title: 'The number was fine. The unit was not.',
    subtitle: 'Turn unit conversions into a habit you can trust.', level: 'Arithmetic → prealgebra',
    math: 'Rates, fractions, unit conversion, estimating',
    story: 'NASA lost contact with Mars Climate Orbiter in 1999. A mismatch between English-unit ground software output and metric expectations contributed to the navigation failure. This is a lesson about interfaces, documentation, and verification as well as arithmetic. Your beginner version is much smaller: a rover specification says 72 km/h, but your simulation expects meters per second. The bare number 72 is not a complete input.',
    worked: 'Write the quantity with its units: 72 km/h. Multiply by 1,000 m/1 km and 1 h/3,600 s. Kilometers and hours cancel, leaving 20 m/s. As a rough check, 72 kilometers per hour is about 1.2 kilometers per minute; roughly twenty meters each second is plausible.',
    assumptions: 'This conversion is exact for the stated units. It says nothing about whether a rover can achieve that speed or whether the measurement is accurate. The rover is a hypothetical teaching example.',
    next: 'Make units visible beside every input and output. Convert 18 km/h yourself, then explain why a plausible-looking number alone is not verification. Check: 5 m/s.',
    source: { title: 'NASA: Mars Climate Orbiter mishap lesson', url: 'https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf' }
  },
  {
    id: 'mission-mass', title: 'Build a spacecraft mass budget',
    subtitle: 'Subtraction becomes room for uncertainty.', level: 'Arithmetic → algebra',
    math: 'Addition, fractions, percents, inequalities',
    story: 'Imagine a small research vehicle with a hypothetical 40 kg mass allocation. Structure uses 12 kg, power hardware 8 kg, instruments 6 kg, and computing plus communications 4 kg. The interesting question is not only whether the total fits today. Early estimates can change, so engineers track allowances and margins. NASA’s systems engineering guidance treats such reserves as a way to manage uncertainty; the appropriate amount depends on the actual project.',
    worked: 'Current estimate: 12 + 8 + 6 + 4 = 30 kg. Unused allocation: 40 − 30 = 10 kg. Relative to the allocation, that is 10/40 = 25%. Relative to the current estimate, it permits 10/30 ≈ 33.3% growth. Both percentages are valid, but they answer different questions.',
    assumptions: 'These are invented numbers, not a flight design or a recommended reserve. Every relevant component would need an agreed accounting boundary; an omitted item can make a neat total misleading.',
    next: 'Add a 3 kg instrument. Recalculate the unused allocation and its percentage of 40 kg. Check: 7 kg and 17.5%. What changes if the mass estimate itself is uncertain?',
    source: { title: 'NASA: systems engineering terminology and margins', url: 'https://www.nasa.gov/reference/system-engineering-handbook-appendix/' }
  },
  {
    id: 'mission-energy', title: 'Keep the lights on in orbital night',
    subtitle: 'Power is a rate. Energy is the accumulated amount.', level: 'Arithmetic → algebra',
    math: 'Rates, time conversion, multiplication, efficiency fractions',
    story: 'A solar-powered spacecraft may spend part of an orbit in Earth’s shadow. NASA’s Hubble power description explains how batteries store energy for that period. For a hypothetical small vehicle, suppose essential equipment draws a constant 60 W during a 35-minute eclipse. This is a direct use of the distinction between power, the rate of using energy, and energy, the amount available.',
    worked: 'Convert the duration: 35/60 hours. Required delivered energy is 60 W × (35/60 h) = 35 Wh. If a deliberately simplified battery model allows only 80% of a named capacity to be delivered usefully, the modeled minimum is 35/0.80 = 43.75 Wh.',
    assumptions: 'The 60 W load, 35-minute duration, and combined 80% factor are teaching assumptions. This is not battery selection guidance. Real sizing includes changing loads, temperature, aging, discharge limits, conversion losses, and operating margins; those factors should not be silently bundled without a definition.',
    next: 'At the same load, what delivered energy is needed for 45 minutes? Check: 45 Wh. Explain why “a 60-watt battery” does not by itself tell you how long the equipment runs.',
    source: { title: 'NASA: Hubble electrical power', url: 'https://science.nasa.gov/mission/hubble/observatory/design/electrical-power/' }
  },
  {
    id: 'mission-scale', title: 'Double a habitat. Get eight times the interior.',
    subtitle: 'A bigger version has different proportions between its needs.', level: 'Geometry',
    math: 'Powers, surface area, volume, ratios',
    story: 'Picture a cube-shaped teaching model of a habitat. Its sides are initially 2 m long. You propose a geometrically similar version with 4 m sides. This is not a realistic habitat design; it is a way to uncover an important question before advanced engineering: how does the boundary grow compared with the interior? NASA’s lunar-habitat education activity uses geometry to explore this kind of relationship.',
    worked: 'The first cube has volume 2³ = 8 m³ and surface area 6 × 2² = 24 m². The larger cube has volume 4³ = 64 m³ and area 6 × 4² = 96 m². Doubling length multiplies volume by eight and surface area by four. Surface area per unit volume falls from 3 m⁻¹ to 1.5 m⁻¹.',
    assumptions: 'This calculation covers geometry only. A hollow pressure vessel does not have mass equal to interior volume times material density. Wall thickness, structural loads, penetrations, equipment, radiation protection, and thermal design add separate requirements.',
    next: 'Predict the factors for a threefold increase in every length before calculating: area ×9 and volume ×27. Ask which parts of a real design follow each scaling rule, and which do not.',
    source: { title: 'NASA eClips: lunar habitats geometry activity', url: 'https://assets.science.nasa.gov/content/dam/science/cds/eclips/assets/documents/educator-guide-launchpad-lunar-habitats-home-on-the-moon.pdf' }
  },
  {
    id: 'mission-force', title: 'Two pushes do not always add the way you expect',
    subtitle: 'Give every force a direction before calculating.', level: 'Algebra → precalculus',
    math: 'Signed numbers, vectors, rearranging F = ma',
    story: 'Imagine a hypothetical 10 kg robotic test platform in a simplified planar experiment. One applied force is 6 N east and another is 8 N north. To predict its acceleration, you need their combined direction as well as their sizes. NASA’s introduction to Newton’s laws emphasizes that force and acceleration are vectors. The beginner skill is careful bookkeeping by direction, not memorizing a more impressive equation.',
    worked: 'Choose east as x and north as y. The net force is (6, 8) N, assuming these are the only uncanceled forces. Its magnitude is √(6² + 8²) = 10 N. Divide each component by the 10 kg mass: acceleration is (0.6, 0.8) m/s², with magnitude 1 m/s².',
    assumptions: 'Mass is constant; the coordinate frame is treated as inertial. Other forces are absent or balanced. This is not a variable-mass rocket calculation. A net force changes velocity; it is not required merely to maintain constant velocity in this idealized model.',
    next: 'Replace the northward force with 6 N west. The east and west forces cancel, so their net force and resulting acceleration are zero. Why is adding magnitudes alone wrong?',
    source: { title: 'NASA Glenn: Newton’s laws of motion', url: 'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/newtons-laws-of-motion/' }
  },
  {
    id: 'mission-orbit', title: 'Falling down and falling around Earth',
    subtitle: 'A useful simple model also needs an honest boundary.', level: 'Algebra 2; orbit is a conceptual preview',
    math: 'Squares, functions, proportional reasoning, model assumptions',
    story: 'For an object dropped from rest near Earth’s surface, a simple constant-gravity model gives downward distance d = ½gt². It produces a curved distance-versus-time graph: the object covers more distance in each successive second. Orbit is a related but different situation. NASA explains orbit through the idea of an object moving sideways while continually falling around Earth. Being in orbit does not mean gravity disappeared.',
    worked: 'Using g ≈ 9.8 m/s², the idealized drop distance after 1 second is 4.9 m. After 2 seconds it is 19.6 m. Doubling the time quadrupled the distance because time is squared. These are distances below the release point, so the model ends when the object hits a surface.',
    assumptions: 'The drop model neglects air resistance, assumes release from rest, and treats gravity as uniform over a small region. It is not an orbital trajectory calculator. Orbit requires curved-Earth geometry and a gravity direction that changes along the path.',
    next: 'Predict the 3-second distance in this model: 44.1 m, if there is room to fall. Explain why extrapolating the same downward line for an hour would misuse the model.',
    source: { title: 'NASA: how orbits work', url: 'https://science.nasa.gov/learn/basics-of-space-flight/chapter3-4/' }
  },
  {
    id: 'mission-thermal', title: 'Space does not automatically keep electronics cool',
    subtitle: 'Start with an energy budget before learning thermal equations.', level: 'Arithmetic → algebra',
    math: 'Signed sums, rates, accumulated energy',
    story: 'A spacecraft’s temperature depends on energy entering, leaving, and being stored. NASA’s spacecraft thermal guidance describes radiation, surface properties, and thermal-control hardware. In vacuum, a vehicle cannot rely on the surrounding air to carry heat away as a room fan would. Before learning detailed heat-transfer equations, you can practice the accounting: what is coming in, what is leaving, and what remains?',
    worked: 'For a hypothetical short interval, let absorbed external power be 70 W, internal equipment dissipation 30 W, and outgoing thermal radiation 80 W. Net stored-energy rate is 70 + 30 − 80 = 20 W. Over 60 seconds, if these rates stay constant, stored energy increases by 20 × 60 = 1,200 J.',
    assumptions: 'These are invented fixed rates, not a thermal design. Real outgoing radiation depends strongly on temperature, and external heating changes with geometry and environment. An energy increase does not specify a temperature rise without a thermal model, including heat capacity and possible phase changes.',
    next: 'What outgoing rate would balance the two incoming contributions in this snapshot? Check: 100 W. What would a negative net rate mean? The system is losing stored energy.',
    source: { title: 'NASA: small-spacecraft thermal control', url: 'https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/' }
  },
  {
    id: 'mission-delay', title: 'Why a Mars robot cannot wait for every instruction',
    subtitle: 'Distance ÷ speed becomes an operational constraint.', level: 'Arithmetic → prealgebra',
    math: 'Rates, scientific notation, time conversion, round trips',
    story: 'Radio signals travel at the speed of light, but interplanetary distances still create meaningful delays. NASA describes how changing Earth–Mars separation makes communication take minutes rather than an instant. That delay helps explain the value of autonomy, clear procedures, and local decision-making. You do not need calculus to understand the basic constraint: divide distance by signal speed, then distinguish a one-way message from a complete exchange.',
    worked: 'Choose a hypothetical separation of 180,000,000 km and approximate light speed as 300,000 km/s. One-way light time is (1.8 × 10⁸)/(3 × 10⁵) = 600 seconds = 10 minutes. An immediate reply would take another 10 minutes, making a minimum signal round trip of about 20 minutes.',
    assumptions: 'The distance is an illustrative value, not today’s Earth–Mars separation. This simple estimate holds distance constant and omits processing, scheduling, routing, interruptions, and human reaction time. A faster data rate does not remove the speed-of-light propagation delay.',
    next: 'At 90,000,000 km, what is the one-way delay under the same assumptions? Check: 5 minutes. Consider which rover actions should be handled locally instead of waiting for an Earth response.',
    source: { title: 'NASA: space communications essentials', url: 'https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/' }
  }
];

export const mistakes = [
  { id: 'mistake-fractions', title: 'Adding the labels of the pieces', stage: 'arithmetic', wrong: '1/2 + 1/3 = 2/5', right: '1/2 + 1/3 = 3/6 + 2/6 = 5/6', reason: 'The denominator names the piece size. Rename both amounts with the same size pieces, then add their counts.', check: 'Your sum must exceed 1/2. Since 2/5 is smaller, that proposed answer fails immediately.' },
  { id: 'mistake-decimals', title: 'Expecting multiplication to always make things bigger', stage: 'arithmetic', wrong: '8 × 0.25 must exceed 8.', right: '8 × 0.25 = 2', reason: 'Multiplying by a positive fraction below one takes a portion of the original amount. Division by such a fraction can make the result larger.', check: 'Read 0.25 as one quarter. One quarter of eight is two.' },
  { id: 'mistake-percent', title: 'Forgetting which amount the percent acts on', stage: 'arithmetic', wrong: '20% off 80 removes 20.', right: '0.20 × 80 = 16; the remaining amount is 64.', reason: 'A percentage is a multiplier, not a fixed number of units. Write the base explicitly.', check: '10% of 80 is 8, so 20% must be 16.' },
  { id: 'mistake-negative-square', title: 'Losing the scope of a negative sign', stage: 'prealgebra', wrong: '−3² = (−3)²', right: '−3² = −9; (−3)² = 9.', reason: 'In the first expression, the exponent acts on 3 before the leading negative. In the second, parentheses make the whole negative number the base.', check: 'Rewrite the first as −(3 × 3) and the second as (−3)(−3).' },
  { id: 'mistake-distribution', title: 'Only multiplying the first term', stage: 'algebra', wrong: '−2(x − 5) = −2x − 5', right: '−2(x − 5) = −2x + 10', reason: 'The outside factor multiplies every term in the grouped quantity, including its sign.', check: 'Try x = 0. The original becomes 10, so your expanded version must also become 10.' },
  { id: 'mistake-equality', title: 'Treating equals as “and then”', stage: 'prealgebra', wrong: '3 + 4 = 7 × 2 = 14', right: '(3 + 4) × 2 = 7 × 2 = 14', reason: 'Every expression connected by equals must have the same value. The first incorrect chain claims that 7 equals 14.', check: 'Read every equals sign aloud as “has the same value as.”' },
  { id: 'mistake-square-sum', title: 'Squaring terms separately and dropping the cross term', stage: 'algebra2', wrong: '(a + b)² = a² + b²', right: '(a + b)² = a² + 2ab + b²', reason: 'Squaring means multiplying the whole expression by itself. Distribute (a + b)(a + b) to account for all four products.', check: 'With a = b = 1, the left side is 4, while the incorrect right side is 2.' },
  { id: 'mistake-cancel-terms', title: 'Canceling terms instead of factors', stage: 'algebra2', wrong: '(x + 2)/x = 2', right: '(x + 2)/x = 1 + 2/x, for x ≠ 0.', reason: 'Cancellation applies to common nonzero factors of a whole numerator and denominator. An x inside a sum is not a factor of the whole sum.', check: 'Try x = 2: the original is 2. Try x = 4: it is 1.5. A constant answer cannot describe both.' },
  { id: 'mistake-square-units', title: 'Converting area like length', stage: 'geometry', wrong: '1 m² = 100 cm²', right: '1 m² = (100 cm)(100 cm) = 10,000 cm²', reason: 'Area contains two length factors. Both must be converted. Volume contains three.', check: 'Draw a 1 m square as a 100-by-100 grid of 1 cm squares.' },
  { id: 'mistake-calculator-angle', title: 'Using the wrong angle mode', stage: 'precalculus', wrong: 'Typing sin(30) in radian mode and expecting 0.5.', right: 'sin(30°) = 0.5; in radians use sin(π/6).', reason: 'The calculator needs the angle unit as well as the number. Thirty radians and thirty degrees are different rotations.', check: 'Before a trigonometry calculation, verify that sin(90°) or sin(π/2 radians) gives 1 in the mode you intend.' }
];
