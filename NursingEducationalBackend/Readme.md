File: NursingEducationalBackend\NursingEducationalBackend.Tests\Test1.cs

Test1.cs contains test methods for inserting and retrieving data from the database. For example, it includes sample code for retrieving data from the ADL table. We need to create tests for all tables, ensuring that both data retrieval and insertion work correctly.

Note on Insertion:
Insert operations can be a bit tricky due to foreign key constraints. For instance, since the patientID field in the ADL table is non-nullable, you cannot insert an ADL record without first having a valid patient record. Therefore, if the database does not already contain a patient record, you must create one before inserting an ADL record.

SQLite Dependency:

This project uses SQLite as its database. Ensure you have installed the appropriate NuGet packages:

	•	Microsoft.EntityFrameworkCore.Sqlite
	•	Microsoft.EntityFrameworkCore.Tools
 
Ensure that the Data/NursingInit.db file property is set to “Copy if newer” (or “Copy always”) so that a fresh copy of the database is placed in the output directory each time you build or run the project.


Test Unit Dependencies:
The test project also requires specific packages for running unit tests. Make sure to install the following (depending on your chosen test framework):
	
	•	For MSTest:
	•	MSTest.TestFramework
	•	MSTest.TestAdapter
	•	Microsoft.NET.Test.Sdk
	

I have completed setting up the test unit and ran a retrieval test on the ADL table, and the test was successful.

ENUM input needs validation on both the frontend and backend, with only the available options selectable. For more detail, please refer to the ERD.
