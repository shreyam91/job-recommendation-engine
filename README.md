Job Recommendation Engine

A simple rule-based API that recommends jobs to candidates based on their skills, experience, location, and expected salary.

The main idea of this project is to take a candidate and a list of jobs, calculate how well each job matches the candidate, and return the best matches in ranked order.

Tech Stack

Node.js

Express.js

PostgreSQL

Jest

What this project does

The API supports:

Creating candidate profiles

Creating job postings

Finding recommended jobs for a candidate

Filtering jobs when a must-have skill is missing

Scoring nice-to-have skills

Comparing candidate and job experience

Checking location compatibility

Checking salary fit

Returning a score breakdown for each recommendation

Limiting the number of recommendations using limit

Project Structure
src/
├── controllers/
├── routes/
├── services/
├── scoring/
├── db/
└── app.js

tests/
└── jobScorer.test.js

Setup
Requirements

You will need:

Node.js

PostgreSQL (or a Supabase PostgreSQL database)

Install

Clone the repository:

git clone <your-repository-url>
cd job-recommendation-engine
npm install

Environment variables

Create a .env file:

PORT=3000
DATABASE_URL=your_postgresql_connection_string

Run the project

For development:

npm run dev


For production:

npm start

API
Create a candidate

POST /api/candidates

Example:

{
  "name": "Shrey",
  "skills": ["Java", "Spring Boot", "React"],
  "yearsOfExperience": 3,
  "location": "Noida",
  "expectedSalary": 7
}

Create a job

POST /api/jobs

Example:

{
  "title": "Java Full Stack Developer",
  "requiredSkills": [
    {
      "name": "Java",
      "type": "MUST_HAVE"
    },
    {
      "name": "Spring Boot",
      "type": "MUST_HAVE"
    },
    {
      "name": "React",
      "type": "NICE_TO_HAVE"
    }
  ],
  "minYearsExperience": 3,
  "location": "Noida",
  "salaryRange": {
    "min": 6,
    "max": 10
  },
  "remoteAllowed": true
}

Get job recommendations

GET /api/candidates/:id/recommendations

You can also pass a limit:

GET /api/candidates/1/recommendations?limit=5


The recommendations are sorted by their score, with the highest-scoring jobs returned first.

How scoring works

The total score is out of 100.

Factor	Points
Skills	50
Experience	20
Location	15
Salary	15
Total	100
Skills - 50 points

Skills are given the highest weight because they are the main indicator of whether someone is suitable for a job.

There are two types of skills:

Must-have: 35 points

Nice-to-have: 15 points

A missing must-have skill means the job is not recommended at all.

Nice-to-have skills are scored based on how many of them the candidate has.

For example, if a job has 4 nice-to-have skills and the candidate has 2:

(2 / 4) × 15 = 7.5 points


If there are no nice-to-have skills, the candidate gets all 50 skill points after passing the must-have skill check.

Experience - 20 points

Experience does not completely exclude a candidate.

If the candidate has enough experience, they get the full 20 points.

If they have less experience, the score is reduced proportionally.

For example:

Candidate: 2 years
Job requirement: 4 years

(2 / 4) × 20 = 10 points


I decided not to make experience a hard filter because someone with slightly less experience can still be a good match if they have the required skills.

Location - 15 points

The location score works like this:

Situation	Points
Same location	15
Different location but remote is allowed	10
Different location and remote is not allowed	0
Salary - 15 points

Salary is compared with the candidate's expected salary.

If the job's maximum salary is below the candidate's expectation, the score is 0.

If the job's minimum salary is at or above the candidate's expectation, the score is 15.

If the expected salary is somewhere inside the job's salary range, a partial score is given.

For example, if the job pays 6-10 LPA and the candidate expects 7 LPA:

((10 - 7) / (10 - 6)) × 15
= 11.25 points


This gives a more useful score than simply saying that the salary either matches or doesn't match.

Recommendation flow

The basic flow is:

Candidate
   |
   v
Get available jobs
   |
   v
Check must-have skills
   |
   +---- Missing skill ---> Skip job
   |
   v
Calculate score
   |
   +-- Skills
   +-- Experience
   +-- Location
   +-- Salary
   |
   v
Sort by score
   |
   v
Apply limit
   |
   v
Return recommendations

Tests

The scoring logic is tested using Jest.

Some of the cases covered are:

Candidate missing a must-have skill

Candidate having less experience than required

Exact location match

Remote job with different location

Location mismatch

No salary overlap

Salary above candidate expectation

Partial salary overlap

Nice-to-have skill matching

Perfect match resulting in 100 points

Run the tests with:

npm test

Assumptions

A few assumptions were made while building the project:

Skills are matched without considering uppercase/lowercase differences.

Salary is represented in LPA.

Location is compared as a text value.

Experience can be a decimal number.

Missing a must-have skill always removes the job from the recommendations.

Not meeting the experience requirement reduces the score but does not remove the job.

A salary mismatch gives 0 salary points but does not automatically remove the job.

The recommendation system is rule-based and does not use machine learning.

AI Usage

I used AI tools during development to help with parts of the implementation, debugging, and coming up with test cases.

I did not treat the generated code or suggestions as final. I reviewed the logic and made changes where needed, especially around the scoring rules and edge cases.

The scoring weights and the overall recommendation logic were decided based on the requirements of the assignment and reviewed manually.

Future improvements

If I continue working on this project, some things I would like to add are:

Docker setup

Configurable scoring weights

Finding candidates for a particular job

Better skill matching/normalization

Pagination for a larger number of jobs and candidates
