# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

| Ticket # | 0001 |
| --- | --- |
| **Title** | Create migration to add `FacilityAgentIds` table |
| **Description** | Currently, our internal Agent ID's are used in the reporting modules for Facilities. We need to support the functionality for Facility managers to assign their own ID's to Agents. For this, add a database table to track a Facility's custom Agent data (initially only ID). This data cannot be saved in the Agent table itself, for they might work at multiple Facilities.|
| **Acceptance Criteria** | [ ] Migration creates a table `FacilityAgentIds` with 4 columns (`id (autoincrement)`, `facilityId (fk -> Facilities)`, `agentId (fk -> Agents)`, `facilityAgentId (varchar)`).<br>[ ] Migration includes rollback script.<br>[ ] Migration is tested on Development. |
| **Estimate** | 3pts. |


| Ticket # | 0002 |
| --- | --- |
| **Title** | Create API endpoint to fetch and update FacilityAgentId's |
| **Description** | A table to track FacilityAgentId's has been created in #0001. Expose an API endpoint to create, read and update rows from this table. Only Facility administrators are permitted to manage FacilityAgentId's. |
| **Acceptance Criteria** | [ ] API endpoint exists at `/facilities/{facilityId}/agents/{agentId}`<br>[ ] Endpoint authorizes user (Facility Administrator at facilityId).<br>[ ] Endpoint throws if Agent has not worked at FacilityID.<br>[ ] GET endpoint is updated to include `facilityAgentId` field in returned Agent data.<br>[ ] PUT endpoint is created to update `facilityAgentId` field.<br>[ ] Endpoint validates custom Agent ID [a-z, A-Z, 0-9].<br>[ ] Endpoints include testcases.|
| **Estimate** | 5pts. |
| **Blocked by** | #0001 |


| Ticket # | 0003 |
| --- | --- |
| **Title** | Create UI for Facility Member to update custom Agent ID |
| **Description** | In the Agent management screen in the Facility's portal, add an input field to allow a Facility Administrator to set a custom Agent ID. |
| **Acceptance Criteria** | [ ] Input is disabled for users without Administrator permissions.<br>[ ] Input accepts only a-z, A-Z, 0-9 characters.<br>[ ] Input is pre-filled with the `facilityAgentId` from `/facilities/{facilityId}/agents/{agentId}`.<br>[ ] On submit, update endpoint is called.<br>[ ] UI shows proper error messaging on form submission failed.<br>[ ] UI Component is tested and has a Storybook component. |
| **Estimate** | 5pts. |
| **Blocked by** | #0002 |


| Ticket # | 0004 |
| --- | --- |
| **Title** | Update `getShiftsByFacility()` method to include `facilityAgentId`'s |
| **Description** | Functionality for Facilities to assign their own custom ID's to agents has been added. These ID's need to be included when generating reports. The current `getShifsByFacility()` function returns some metadata about Agents. This metadata should now also include the `facilityAgentId`. |
| **Acceptance Criteria** | [ ] `facilityAgentId` is included in metadata when fetching Agent data (join `FacilityAgentIds.agentId` table on `Agents.id`).<br> [ ] Unit tests for `getShiftsByFacility()` are updated to reflect change in Agent metadata. |
| **Estimate** | 2pts. |
| **Blocked by** | #0001 |


| Ticket # | 0005 |
| --- | --- |
| **Title** | Update Facility quarter report PDF to include custom Agent ID's |
| **Description** | Functionality for Facilities to assign their own custom ID's to agents has been added, and included in the Agent metadata. Update the PDF template to render the custom ID when available. |
| **Acceptance Criteria** | [ ] PDF template includes custom Agent ID.<br>[ ] PDF template falls back to internal Agent ID, if custom ID is undefined.<br> |
| **Estimate** | 2pts. |
| **Blocked by** | #0004 |
