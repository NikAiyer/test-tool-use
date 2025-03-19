import * as models from "../models";
import chalk from "chalk";
import { filterQuery, query, ragMastra } from "./testSetup";

const modelNames = Object.keys(models);

console.log(modelNames)

// Results storage
interface TestResult {
  company: string;
  modelName: string;
  success: boolean;
  error?: string;
  response?: string;
  filter?: boolean;
  instructionType: 'Basic' | 'Detailed';
}

const results: TestResult[] = [];

/**
 * Test RAG functionality with a specific model
 */
async function testModel(modelName: string, company: string, enableFilter: boolean = false, instructionType: 'Basic' | 'Detailed' = 'Basic'): Promise<TestResult> {
  console.log(chalk.blue(`\n=== Testing RAG with ${company} model: ${modelName} ===`));
  console.log(chalk.yellow(`Config: Filter: ${enableFilter ? 'Enabled' : 'Disabled'}`));
  
  try {
    // Get the agent from the ragMastra instance
    const agentKey = `${modelName}_rag${instructionType}${enableFilter ? 'Filter' : 'NoFilter'}`;
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
      company,
      modelName,
      success: usedTool,
      response: result.text,
      filter: enableFilter,
      instructionType
    };
  } catch (error) {
    console.log(chalk.red("Error generating response:"));
    console.log(chalk.red(error instanceof Error ? error.message : String(error)));
    
    return {
      company,
      modelName,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      instructionType
    };
  }
}

/**
 * Test RAG functionality with filter query
 */
async function testModelWithFilter(modelName: string, company: string, enableFilter: boolean = true, instructionType: 'Basic' | 'Detailed' = 'Basic'): Promise<TestResult> {
  console.log(chalk.blue(`\n=== Testing RAG with filter for ${company} model: ${modelName} ===`));
  console.log(chalk.yellow(`Config: Filter: ${enableFilter ? 'Enabled' : 'Disabled'}`));
  
  try {
    // Get the agent from the ragMastra instance
    const agentKey = `${modelName}_rag${instructionType}${enableFilter ? 'Filter' : 'NoFilter'}`;
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
      company,
      modelName: `${modelName} (with filter)`,
      success: usedTool,
      response: result.text,
      filter: enableFilter,
      instructionType,
    };
  } catch (error) {
    console.log(chalk.red("Error generating response with filter:"));
    console.log(chalk.red(error instanceof Error ? error.message : String(error)));
    
    return {
      company,
      modelName: `${modelName} (with filter)`,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      instructionType
    };
  }
}

/**
 * Run tests for a specific model
 */
async function runModelTests(modelName: string, company: string) {
  // Test configurations
  const configs = [
    { enableFilter: false, label: "Basic", instructionType: 'Basic' as const },
    { enableFilter: false, label: "Basic", instructionType: 'Detailed' as const },
    { enableFilter: true, label: "With Filter", instructionType: 'Basic' as const },
    { enableFilter: true, label: "With Filter", instructionType: 'Detailed' as const }
  ];
  
  // Run tests with different configurations
  for (const config of configs) {
    console.log(chalk.yellow(`\n--- Testing ${config.label} Configuration ---`));
    
    // Test with basic query
    const basicResult = await testModel(modelName, company, config.enableFilter, config.instructionType);
    results.push(basicResult);
    
    // Test with filter query (only if filter is enabled)
    const filterResult = await testModelWithFilter(modelName, company, config.enableFilter, config.instructionType);
    results.push(filterResult);
  }
}

/**
 * Generate a summary of the test results
 */
function generateSummary() {
  console.log(chalk.blue("\n=== RAG Agent Test Summary ==="));
  console.log("Total Models:", modelNames.length);

  // Log instruction sets
  console.log(chalk.yellow("\nInstruction Sets:"));

  // Test statistics
  console.log(chalk.yellow("\nTest Statistics:"));
  console.log(chalk.yellow("Total tests run:"), results.length);
  console.log(chalk.green("Successful tests (tool was used):"), results.filter(r => r.success).length);
  console.log(chalk.red("Failed tests (tool was not used or errored out):"), results.filter(r => !r.success).length);
  
  console.log(chalk.blue("\n=== Detailed Results ==="));
  console.log("| Company | Model | Instructions | Config | Success | Error |");
  console.log("| ------- | ----- | ------------ | ------ | ------- | ----- |");
  
  for (const result of results) {
    const successStatus = result.success ? chalk.green("✓") : chalk.red("✗");
    const error = result.error ? chalk.red(result.error.substring(0, 50) + "...") : "";
    const config = `Filter: ${result.filter ? '✓' : '✗'}`;
    
    console.log(`| ${result.company} | ${result.modelName} | ${result.instructionType} | ${config} | ${successStatus} | ${error} |`);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(chalk.blue("=== Testing RAG Agent with All Models ==="));
  
  // Iterate through each company's models
  for (const [company, companyModels] of Object.entries(models)) {
    console.log(chalk.yellow(`\nTesting ${company} models...`));
    for (const [modelName] of Object.entries(companyModels)) {
      await runModelTests(modelName, company);
    }
  }
  
  generateSummary();
}

// Run all tests
runAllTests().catch(error => {
  console.error(chalk.red("Test execution failed:"), error);
});
