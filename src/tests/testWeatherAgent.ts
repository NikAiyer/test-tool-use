import * as models from "../models/model";
import chalk from "chalk";
import { query, weatherMastra } from "./testWeatherSetup";

const modelNames = Object.keys(models);

// Results storage
interface TestResult {
  company: string;
  modelName: string;
  success: boolean;
  error?: string;
  response?: string;
}

const results: TestResult[] = [];

/**
 * Test Weather functionality with a specific model
 */
async function testModel(
  modelName: string,
  company: string
): Promise<TestResult> {
  console.log(
    chalk.blue(
      `\n=== Testing Weather Agent with ${company} model: ${modelName} ===`
    )
  );

  try {
    // Get the agent from the ragMastra instance
    const agentKey = `${modelName}_weatherAgent`;
    const agent = weatherMastra.getAgent(agentKey);

    // Generate response
    console.log(chalk.yellow("Generating response..."));
    const result = await agent.generate(query);

    // Check if the tool was called by examining the steps
    let usedTool = false;

    // Look through steps to find tool calls
    if (result.steps && Array.isArray(result.steps)) {
      for (const step of result.steps) {
        if (step.toolCalls && Array.isArray(step.toolCalls)) {
          // Check if any tool call exists
          if (step.toolCalls.length > 0) {
            usedTool = true;
            break;
          }
        }
      }
    }

    console.log(chalk.green("Response generated successfully"));
    console.log(
      `Tool was ${usedTool ? chalk.green("USED") : chalk.red("NOT USED")}`
    );
    console.log(chalk.gray("Response:"));
    console.log(chalk.gray("-------------------------------------------"));
    console.log(result.text);
    console.log(chalk.gray("-------------------------------------------"));

    return {
      company,
      modelName,
      success: usedTool,
      response: result.text,
    };
  } catch (error) {
    console.log(chalk.red("Error generating response:"));
    console.log(
      chalk.red(error instanceof Error ? error.message : String(error))
    );

    return {
      company,
      modelName,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate a summary of the test results
 */
function generateSummary() {
  console.log(chalk.blue("\n=== Weather Agent Test Summary ==="));
  console.log("Total Models:", modelNames.length);

  // Test statistics
  console.log(chalk.yellow("\nTest Statistics:"));
  console.log(chalk.yellow("Total tests run:"), results.length);
  console.log(
    chalk.green("Successful tests (tool was used):"),
    results.filter((r) => r.success).length
  );
  console.log(
    chalk.red("Failed tests (tool was not used or errored out):"),
    results.filter((r) => !r.success).length
  );

  console.log(chalk.blue("\n=== Detailed Results ==="));
  console.log("| Company | Model | Success | Error |");
  console.log("| ------- | ----- | ------- | ----- |");

  for (const result of results) {
    const successStatus = result.success ? chalk.green("✓") : chalk.red("✗");
    const error = result.error
      ? chalk.red(result.error.substring(0, 50) + "...")
      : "";

    console.log(
      `| ${result.company} | ${result.modelName} | ${successStatus} | ${error} |`
    );
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(chalk.blue("=== Testing Weather Agent with All Models ==="));

  // Iterate through each company's models
  for (const [company, companyModels] of Object.entries(models)) {
    console.log(chalk.yellow(`\nTesting ${company} models...`));
    for (const [modelName] of Object.entries(companyModels)) {
      const result = await testModel(modelName, company);
      results.push(result);
    }
  }

  generateSummary();
}

// Run all tests
runAllTests().catch((error) => {
  console.error(chalk.red("Test execution failed:"), error);
});
