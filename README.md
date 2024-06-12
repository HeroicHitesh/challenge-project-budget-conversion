# Challenge - Budget Currency Rates

1. Create an application that finds a project's final budget in USD based on name using the data provided in ```/data```. 
2.  Add capability to convert the currency for the following projects to Trinidad and Tobago dollar (TTD):
	- ```Peking roasted duck Chanel```
	- ```Choucroute Cartier```
	- ```Rigua Nintendo```
	- ```Llapingacho Instagram```
	- use ```/api-conversion``` as the endpoint 
3. Add capability to update, add, and delete project budget data.

### The application should have the following API: 

1. Find budget details for projects with specified name within specified year

	```
	// POST /api/project/budget/currency - Request Example Body
	{
		"year": 2024,
		"projectName": "Humitas Hewlett Packard",
		"currency": "TTD"
	}
	```
	```
	// POST /api/project/budget/currency - Response Example Body
	{
		"success": true,
		"data": [{
				"projectId": 1,
				"projectName": "Humitas Hewlett Packard",
				"year": 2024,
				"currency": "EUR",
				"initialBudgetLocal": 316974.5,
				"budgetUsd": 233724.23,
				"initialScheduleEstimateMonths": 13,
				"adjustedScheduleEstimateMonths": 12,
				"contingencyRate": 2.19,
				"escalationRate": 3.46,
				"finalBudgetUsd": 247106.75,
				"finalBudgetTtd": 1680000.00 // Converted to TTD
			}]
	}
	```
2. Get a project's budget data by id
	```
	// GET /api/project/budget/:id Response Example Body
	{
		"projectId": 1,
		"projectName": "Humitas Hewlett Packard",
		"year": 2024,
		"currency": "EUR",
		"initialBudgetLocal": 316974.5,
		"budgetUsd": 233724.23,
		"initialScheduleEstimateMonths": 13,
		"adjustedScheduleEstimateMonths": 12,
		"contingencyRate": 2.19,
		"escalationRate": 3.46,
		"finalBudgetUsd": 247106.75
	}

	```

3. Add project budget data to the database
	```
	// POST /api/project/budget - Request Example Body
	{
		"projectId": 10001,
		"projectName": "Humitas Hewlett Packard",
		"year": 2024,
		"currency": "EUR",
		"initialBudgetLocal": 316974.5,
		"budgetUsd": 233724.23,
		"initialScheduleEstimateMonths": 13,
		"adjustedScheduleEstimateMonths": 12,
		"contingencyRate": 2.19,
		"escalationRate": 3.46,
		"finalBudgetUsd": 247106.75
	}

	```

4. Update project budget data in the database
	```
	// PUT /api/project/budget/:id - Request Example Body
	{
		"projectName": "Humitas Hewlett Packard",
		"year": 2025,
		"currency": "EUR",
		"initialBudgetLocal": 316974.5,
		"budgetUsd": 233724.23,
		"initialScheduleEstimateMonths": 13,
		"adjustedScheduleEstimateMonths": 12,
		"contingencyRate": 2.19,
		"escalationRate": 3.46,
		"finalBudgetUsd": 247106.75
	}
	```

5. Delete project budget data from the database
	```
	// DELETE /api/project/budget/:id
	```


# Requirements
1. Use MySQL for persistence
2. New project budget data should be added to the database in same format as existing seed -

	```
	npm run db:seed
	``` 
2. Use this currency conversion API to get historical currency rates: [app.exchangerate-api.com](https://www.exchangerate-api.com/docs/historical-data-requests)
3. API Tests
    - Each endpoint should have its own test
    - Write all tests in test/endpoints.js
    - Use `servertest` to test the endpoints

# Instructions
1. Create a new repo in your account and note the git url
2. Clone this repo
3. Solve the challenge, following our [coding guidelines](https://github.com/superstruct-tech/onboarding)
4. Set your new repo as the origin: `git remote set-url origin ${your repo url}`
5. Push your solution to your repo

You must follow these steps for your solution to be accepted -- forks or other methods will not be considered.
