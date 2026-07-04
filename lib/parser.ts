import { PackageJson } from "@/types/package";

export function parsePackageJson(fileContent: string): PackageJson | null {
  try {
    // Trim whitespace
    const trimmed = fileContent.trim();

    if (!trimmed) {
      throw new Error("File is empty.");
    }

    const parsed = JSON.parse(trimmed);

    // Check if it's a valid object
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("File content is not a valid JSON object.");
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Extract line and column from error message if available
      const match = error.message.match(/at position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lines = fileContent.substring(0, position).split("\n");
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        throw new Error(
          `Invalid JSON at line ${line}, column ${column}. Please check your package.json syntax.`,
        );
      }
      throw new Error(
        "Invalid JSON format. Please check your package.json syntax.",
      );
    }
    throw error;
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file. No data received."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file. Please try again."));
    };

    reader.onabort = () => {
      reject(new Error("File reading was aborted."));
    };

    reader.readAsText(file);
  });
}
