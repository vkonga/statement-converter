import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function jsonToCsv(jsonDataString: string): string {
  try {
    const jsonData = JSON.parse(jsonDataString);
    let dataArray: any[] = [];

    if (Array.isArray(jsonData)) {
      dataArray = jsonData;
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      const key = Object.keys(jsonData).find(k => Array.isArray((jsonData as any)[k]));
      if (key) {
        dataArray = (jsonData as any)[key];
      } else {
        console.error("No array found in JSON object");
        return "";
      }
    } else {
      console.error("Invalid JSON data format");
      return "";
    }

    if (dataArray.length === 0) return "";
  
    const headers = Object.keys(dataArray[0]);
    const csvRows = [headers.join(',')];
  
    for (const row of dataArray) {
      const values = headers.map(header => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? '' : String(value);
        const escaped = stringValue.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
  
    return csvRows.join('\n');
  } catch (error) {
    console.error("Error parsing JSON for CSV conversion:", error);
    return "";
  }
}

export function downloadFile(content: string, fileName: string, mimeType: string = 'text/csv;charset=utf-8;') {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
