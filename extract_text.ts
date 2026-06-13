import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const extracted: Record<string, string[]> = {};

const dirsToProcess = [
  "src/components/layout",
  "src/components/features/dashboard",
  "src/components/features/about",
  "src/components/features/hero",
  "src/components/features/news",
  "src/components/features/projects",
  "src/components/features/services",
  "src/components/features/faqs"
];

for (const sf of project.getSourceFiles()) {
  const filePath = sf.getFilePath();
  if (!dirsToProcess.some(dir => filePath.includes(dir))) continue;
  
  const componentName = sf.getBaseNameWithoutExtension();
  const texts = new Set<string>();
  
  const jsxTexts = sf.getDescendantsOfKind(SyntaxKind.JsxText);
  for (const jsxText of jsxTexts) {
    const text = jsxText.getLiteralText().replace(/\s+/g, ' ').trim();
    if (text.length > 1 && /[a-zA-Z]/.test(text) && !text.includes('{') && !text.includes('}')) {
      texts.add(text);
    }
  }

  if (texts.size > 0) {
    extracted[componentName] = Array.from(texts);
  }
}

fs.writeFileSync("extracted_texts.json", JSON.stringify(extracted, null, 2));
console.log("Extraction complete.");
