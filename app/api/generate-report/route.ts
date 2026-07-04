import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { apiSummary, model = "llama3.2" } = await req.json();

    if (!apiSummary) {
      return NextResponse.json({ error: "No dataset summary provided." }, { status: 400 });
    }

    const prompt = `You are a highly experienced Senior Data Scientist. Analyze the following dataset summary and provide a comprehensive report.

DATASET SUMMARY:
Rows: ${apiSummary.rows}
Columns: ${apiSummary.columns}
Missing Data: ${JSON.stringify(apiSummary.missing_percentage)}
Numeric Stats: ${JSON.stringify(apiSummary.numeric_summary)}
Categorical Info: ${JSON.stringify(apiSummary.column_info.filter((c: any) => c.dtype.includes('str') || c.dtype.includes('object')))}

Please format your response in clear Markdown with the following sections:
# 1. Executive Summary
A brief overview of the dataset size and composition.
# 2. Data Quality Issues
Highlight missing values, duplicates, or extreme outliers.
# 3. Feature Engineering Suggestions
Suggest encoding, scaling, or new features based on the types and distributions.
# 4. Recommended Modeling Approaches
Recommend baseline models and strategies based on the feature types.

Keep your tone professional, analytical, and concise. Do not include introductory chatter.`;

    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    // Return the readable stream directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report. Make sure Ollama is running locally." },
      { status: 500 }
    );
  }
}
