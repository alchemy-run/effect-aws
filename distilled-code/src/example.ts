import { Agent } from "./agent.ts";
import * as File from "./file/index.ts";
import * as Toolkit from "./toolkits/index.ts";

class Design extends File.Document("design/todo.md")`
A TODO service for a user to manage their TODO items.

The design should cover:
1. Requirements and user stories
2. Route design to inform development of ${() => API}
3. Test design to inform development of ${() => Tests}
` {}

class API extends File.TypeScript("src/api.ts")`
Implementation of the API routes described in the ${Design}
` {}

class Tests extends File.TypeScript("test/api.test.ts")`
Implementation of the tests for the API ${API} described in the ${Design}
` {}

class Designer extends Agent(
  "Design",
)`Work with the ${() => Developer} and ${() => Reviewer} to iteratively refine the ${Design}.` {}

class Developer extends Agent(
  "Developer",
)`Use ${Toolkit.Coding} toolkit to implement the ${API} and ${Tests} according to the ${Design}.` {}

class Reviewer extends Agent(
  "Reviewer",
)`Review the ${API} and ${Tests} developed by the ${Developer} to ensure they implement the ${Design} correctly and completely.
Work with the ${Designer} to update the ${Design} and prepare change requests for the ${Developer}.
Report your findings to the ${() => Manager}.` {}

export default class Manager extends Agent(
  "Manager",
)`You are the single point of contact for the team developing a TODO service:

Process:
1. Have the ${Designer} created or update the ${Design} to describe the TODO service.
2. Pass that to the ${Developer} to implement the ${API} and ${Tests}.
3. Get a summary of the changes from the ${Developer}
4. Pass that to the ${Reviewer} to review the changes.
5. If the ${Reviewer} approves, have the ${Developer} commit the changes to the ${API} and ${Tests}.
6. If the ${Reviewer} does not approve, have the ${Designer} update the ${Design} and prepare change requests for the ${Developer}.
7. Repeat steps 3-6 until the ${Reviewer} approves the changes.
` {}
