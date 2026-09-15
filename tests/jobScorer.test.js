const { calculateJobScore } = require("../src/scoring/jobScorer");

describe("Job Scorer", () => {
  test("should exclude job when candidate is missing a must-have skill", () => {
    const candidate = {
      skills: ["Java", "React"],
      years_of_experience: 3,
      location: "Noida",
      expected_salary: 7,
    };

    const job = {
      required_skills: [
        { name: "Java", type: "MUST_HAVE" },
        { name: "Spring Boot", type: "MUST_HAVE" },
        { name: "React", type: "NICE_TO_HAVE" },
      ],
      min_years_experience: 3,
      location: "Noida",
      salary_range: {
        min: 6,
        max: 10,
      },
      remote_allowed: true,
    };

    expect(calculateJobScore(candidate, job)).toBeNull();
  });

  test("should penalize candidate who has less experience than required", () => {
    const candidate = {
      skills: ["Java"],
      years_of_experience: 2,
      location: "Noida",
      expected_salary: 7,
    };

    const job = {
      required_skills: [
        { name: "Java", type: "MUST_HAVE" },
      ],
      min_years_experience: 4,
      location: "Noida",
      salary_range: {
        min: 6,
        max: 10,
      },
      remote_allowed: true,
    };

    const result = calculateJobScore(candidate, job);

    expect(result).not.toBeNull();
    expect(result.breakdown.experience).toBe(10);
  });

  test("should give higher score for exact location match", () => {
    const candidate = {
      skills: ["Java"],
      years_of_experience: 3,
      location: "Noida",
      expected_salary: 7,
    };

    const job = {
      required_skills: [
        { name: "Java", type: "MUST_HAVE" },
      ],
      min_years_experience: 3,
      location: "Noida",
      salary_range: {
        min: 6,
        max: 10,
      },
      remote_allowed: true,
    };

    const result = calculateJobScore(candidate, job);

    console.log("\nLocation Match Result:");
    console.log(result);

    expect(result.breakdown.location).toBe(15);
  });

  test("should give zero salary score when job max is below expected salary", () => {
  const candidate = {
    skills: ["Java"],
    years_of_experience: 3,
    location: "Noida",
    expected_salary: 10,
  };

  const job = {
    required_skills: [
      { name: "Java", type: "MUST_HAVE" },
    ],
    min_years_experience: 3,
    location: "Noida",
    salary_range: {
      min: 5,
      max: 8,
    },
    remote_allowed: false,
  };

  const result = calculateJobScore(candidate, job);

  console.log("\nNo Salary Overlap:");
  console.log(result.breakdown.salary);

  expect(result.breakdown.salary).toBe(0);
});

test("should give full salary score when job comfortably exceeds expectation", () => {
  const candidate = {
    skills: ["Java"],
    years_of_experience: 3,
    location: "Noida",
    expected_salary: 7,
  };

  const job = {
    required_skills: [
      { name: "Java", type: "MUST_HAVE" },
    ],
    min_years_experience: 3,
    location: "Noida",
    salary_range: {
      min: 8,
      max: 12,
    },
    remote_allowed: false,
  };

  const result = calculateJobScore(candidate, job);

  console.log("\nSalary Above Expectation:");
  console.log(result.breakdown.salary);

  expect(result.breakdown.salary).toBe(15);
});

test("should give partial salary score when expected salary falls inside job range", () => {
  const candidate = {
    skills: ["Java"],
    years_of_experience: 3,
    location: "Noida",
    expected_salary: 8,
  };

  const job = {
    required_skills: [
      { name: "Java", type: "MUST_HAVE" },
    ],
    min_years_experience: 3,
    location: "Noida",
    salary_range: {
      min: 6,
      max: 10,
    },
    remote_allowed: false,
  };

  const result = calculateJobScore(candidate, job);

  console.log("\nPartial Salary Overlap:");
  console.log(result.breakdown.salary);

  expect(result.breakdown.salary).toBe(8);
});

test("should give remote score when location does not match but remote is allowed", () => {
  const candidate = {
    skills: ["Java"],
    years_of_experience: 3,
    location: "Kanpur",
    expected_salary: 7,
  };

  const job = {
    required_skills: [
      { name: "Java", type: "MUST_HAVE" },
    ],
    min_years_experience: 3,
    location: "Noida",
    salary_range: {
      min: 6,
      max: 10,
    },
    remote_allowed: true,
  };

  const result = calculateJobScore(candidate, job);

  console.log("\nRemote Location Result:");
  console.log(result.breakdown.location);

  expect(result.breakdown.location).toBe(10);
});

test("should give zero location score for non-remote location mismatch", () => {
  const candidate = {
    skills: ["Java"],
    years_of_experience: 3,
    location: "Kanpur",
    expected_salary: 7,
  };

  const job = {
    required_skills: [
      { name: "Java", type: "MUST_HAVE" },
    ],
    min_years_experience: 3,
    location: "Noida",
    salary_range: {
      min: 6,
      max: 10,
    },
    remote_allowed: false,
  };

  const result = calculateJobScore(candidate, job);

  console.log("\nLocation Mismatch Result:");
  console.log(result.breakdown.location);

  expect(result.breakdown.location).toBe(0);
});

test("should increase skill score when nice-to-have skills match", () => {
  const candidate = {
    skills: ["Java", "React"],
    years_of_experience: 3,
    location: "Noida",
    expected_salary: 7,
  };

  const job = {
    required_skills: [
      { name: "Java", type: "MUST_HAVE" },
      { name: "Spring Boot", type: "NICE_TO_HAVE" },
      { name: "React", type: "NICE_TO_HAVE" },
    ],
    min_years_experience: 3,
    location: "Noida",
    salary_range: {
      min: 6,
      max: 10,
    },
    remote_allowed: true,
  };

  const result = calculateJobScore(candidate, job);

  console.log("\nNice-to-have Skill Result:");
  console.log(result.breakdown);

  expect(result).not.toBeNull();
  expect(result.breakdown.skills).toBe(43);
});

test("should give a perfect score when all factors match", () => {
  const candidate = {
    skills: ["Java", "React", "Docker"],
    years_of_experience: 5,
    location: "Noida",
    expected_salary: 7,
  };

  const job = {
    required_skills: [
      { name: "Java", type: "MUST_HAVE" },
      { name: "React", type: "NICE_TO_HAVE" },
      { name: "Docker", type: "NICE_TO_HAVE" },
    ],
    min_years_experience: 3,
    location: "Noida",
    salary_range: {
      min: 7,
      max: 10,
    },
    remote_allowed: true,
  };

  const result = calculateJobScore(candidate, job);

  console.log("\nPerfect Match:");
  console.log(result);

  expect(result.score).toBe(100);
  expect(result.breakdown).toEqual({
    skills: 50,
    experience: 20,
    location: 15,
    salary: 15,
  });
});
});