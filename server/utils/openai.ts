import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const endpoint = process.env.OPENAI_API_ENDPOINT;
const azureApiKey = process.env.OPENAI_API_KEY;

if (!endpoint || !azureApiKey) {
  throw new Error("OPENAI_API_ENDPOINT or OPENAI_API_KEY not found in env.");
}

const Client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

export default Client;