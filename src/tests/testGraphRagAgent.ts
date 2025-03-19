import * as models from "../models";
import chalk from "chalk";
import { ragMastra } from "./testSetup";

// Get all model names from the models index
// const modelNames = Object.keys(models);
const modelNames = [
//   // 'ollamaMistral',
//   // 'ollamaMistralNemo',
//   // 'ollamaGranite31Dense',
//   // 'ollamaModel',
//   // 'ollamaNemotronMini',
//   'ollamaQwen',
//   // 'ollamaSmollm2',
//   // 'ollama31Model',
  'gpt4o',
  'gpt4oMini'
];

// Test query
const query = "What does the info in the vector database say about market data?";
const filterQuery = "Use a topK of 3 and a filter of {asd:{ nested: { field: 'market data' }}}";

// Results storage
interface TestResult {
  modelName: string;
  success: boolean;
  usedTool: boolean;
  error?: string;
  response?: string;
  filter?: boolean;
}

const results: TestResult[] = [];

/**
 * Test GraphRAG functionality with a specific model
 */
async function testModel(modelName: string, enableFilter: boolean = false): Promise<TestResult> {
  console.log(chalk.blue(`\n=== Testing GraphRAG with model: ${modelName} ===`));
  console.log(chalk.yellow(`Config: Filter: ${enableFilter ? 'Enabled' : 'Disabled'}`));
  
  try {
    // Get the agent from the ragMastra instance
    const agentKey = `${modelName}_graphRagAgent${enableFilter ? 'Filter' : 'NoFilter'}`;
    const agent = ragMastra.getAgent(agentKey);
    
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
    console.log(`Tool was ${usedTool ? chalk.green('USED') : chalk.red('NOT USED')}`);
    console.log(chalk.gray("Response:"));
    console.log(chalk.gray("-------------------------------------------"));
    console.log(result.text);
    console.log(chalk.gray("-------------------------------------------"));
    
    return {
      modelName,
      success: true,
      usedTool,
      response: result.text,
      filter: enableFilter
    };
  } catch (error) {
    console.log(chalk.red("Error generating response:"));
    console.log(chalk.red(error instanceof Error ? error.message : String(error)));
    
    return {
      modelName,
      success: false,
      usedTool: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Test GraphRAG functionality with filter query
 */
async function testModelWithFilter(modelName: string, enableFilter: boolean = true): Promise<TestResult> {
  console.log(chalk.blue(`\n=== Testing GraphRAG with filter for model: ${modelName} ===`));
  console.log(chalk.yellow(`Config: Filter: ${enableFilter ? 'Enabled' : 'Disabled'}`));
  
  try {
    // Get the agent from the ragMastra instance
    const agentKey = `${modelName}_graphRagAgent${enableFilter ? 'Filter' : 'NoFilter'}`;
    const agent = ragMastra.getAgent(agentKey);
    
    // Generate response with filter
    console.log(chalk.yellow("Generating response with filter..."));
    const result = await agent.generate(`${query} ${filterQuery}`);
    
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
    
    console.log(chalk.green("Response with filter generated successfully"));
    console.log(`Tool was ${usedTool ? chalk.green('USED') : chalk.red('NOT USED')}`);
    console.log(chalk.gray("Response:"));
    console.log(chalk.gray("-------------------------------------------"));
    console.log(result.text);
    console.log(chalk.gray("-------------------------------------------"));
    
    return {
      modelName: `${modelName} (with filter)`,
      success: true,
      usedTool,
      response: result.text,
      filter: enableFilter
    };
  } catch (error) {
    console.log(chalk.red("Error generating response with filter:"));
    console.log(chalk.red(error instanceof Error ? error.message : String(error)));
    
    return {
      modelName: `${modelName} (with filter)`,
      success: false,
      usedTool: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Run tests for a specific model
 */
async function runModelTests(modelName: string) {
  // Test configurations
  const configs = [
    { enableFilter: false, label: "Basic" },
    { enableFilter: true, label: "With Filter" }
  ];
  
  // Run tests with different configurations
  for (const config of configs) {
    console.log(chalk.yellow(`\n--- Testing ${config.label} Configuration ---`));
    
    // Test with basic query
    const basicResult = await testModel(modelName, config.enableFilter);
    results.push(basicResult);
    
    // Test with filter query (only if filter is enabled)
    const filterResult = await testModelWithFilter(modelName, config.enableFilter);
    results.push(filterResult);
  }
}

/**
 * Generate a summary of the test results
 */
function generateSummary() {
  console.log(chalk.blue("\n=== GraphRAG Agent Test Summary ==="));
  console.log(chalk.yellow("Total tests run:"), results.length);
  console.log(chalk.green("Successful tests:"), results.filter(r => r.success).length);
  console.log(chalk.red("Failed tests:"), results.filter(r => !r.success).length);
  console.log(chalk.green("Tests where tool was used:"), results.filter(r => r.usedTool).length);
  
  console.log(chalk.blue("\n=== Detailed Results ==="));
  console.log("| Model | Config | Success | Tool Used | Error |");
  console.log("| ----- | ------ | ------- | --------- | ----- |");
  
  for (const result of results) {
    const successStatus = result.success ? chalk.green("✓") : chalk.red("✗");
    const toolStatus = result.usedTool ? chalk.green("✓") : chalk.red("✗");
    const error = result.error ? chalk.red(result.error.substring(0, 50) + "...") : "";
    const config = `Filter: ${result.filter ? '✓' : '✗'}`;
    
    console.log(`| ${result.modelName} | ${config} | ${successStatus} | ${toolStatus} | ${error} |`);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(chalk.blue("=== Testing GraphRAG Agent with All Models ==="));
  console.log(chalk.yellow("Available models:"), modelNames.join(", "));
  
  for (const modelName of modelNames) {
    await runModelTests(modelName);
  }
  
  generateSummary();
}

// Run all tests
runAllTests().catch(error => {
  console.error(chalk.red("Test execution failed:"), error);
});
