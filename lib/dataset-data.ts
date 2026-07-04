export type DataType =
  | "Integer"
  | "Float"
  | "Categorical"
  | "Boolean"
  | "Datetime"

export type DatasetRow = {
  age: number
  salary: number | null
  gender: "Male" | "Female"
  department: string
  purchased: boolean
}

export const datasetRows: DatasetRow[] = [
  { age: 34, salary: 82000, gender: "Male", department: "Engineering", purchased: true },
  { age: 28, salary: 54000, gender: "Female", department: "Marketing", purchased: false },
  { age: 45, salary: null, gender: "Male", department: "Sales", purchased: true },
  { age: 39, salary: 96000, gender: "Female", department: "Engineering", purchased: true },
  { age: 52, salary: 120000, gender: "Male", department: "Executive", purchased: false },
  { age: 23, salary: 41000, gender: "Female", department: "Support", purchased: false },
  { age: 31, salary: 67000, gender: "Male", department: "Marketing", purchased: true },
  { age: 47, salary: null, gender: "Female", department: "Sales", purchased: false },
  { age: 29, salary: 58000, gender: "Male", department: "Support", purchased: true },
  { age: 41, salary: 88000, gender: "Female", department: "Engineering", purchased: true },
  { age: 36, salary: 73000, gender: "Male", department: "Sales", purchased: false },
  { age: 26, salary: 49000, gender: "Female", department: "Marketing", purchased: true },
  { age: 58, salary: 134000, gender: "Male", department: "Executive", purchased: true },
  { age: 33, salary: 71000, gender: "Female", department: "Support", purchased: false },
  { age: 44, salary: 92000, gender: "Male", department: "Engineering", purchased: true },
  { age: 30, salary: null, gender: "Female", department: "Sales", purchased: false },
  { age: 49, salary: 105000, gender: "Male", department: "Executive", purchased: true },
  { age: 27, salary: 52000, gender: "Female", department: "Support", purchased: true },
  { age: 38, salary: 79000, gender: "Male", department: "Marketing", purchased: false },
  { age: 42, salary: 87000, gender: "Female", department: "Engineering", purchased: true },
  { age: 35, salary: 76000, gender: "Male", department: "Sales", purchased: true },
  { age: 24, salary: 44000, gender: "Female", department: "Support", purchased: false },
  { age: 51, salary: 118000, gender: "Male", department: "Executive", purchased: true },
  { age: 32, salary: 68000, gender: "Female", department: "Marketing", purchased: false },
]

export const columnAnalysis: {
  name: string
  type: DataType
  missing: number
  missingPct: number
  unique: number
}[] = [
  { name: "Age", type: "Integer", missing: 12, missingPct: 2, unique: 41 },
  { name: "Salary", type: "Float", missing: 148, missingPct: 12, unique: 812 },
  { name: "Gender", type: "Categorical", missing: 0, missingPct: 0, unique: 2 },
  { name: "Department", type: "Categorical", missing: 6, missingPct: 0.5, unique: 5 },
  { name: "Purchased", type: "Boolean", missing: 0, missingPct: 0, unique: 2 },
  { name: "Income", type: "Float", missing: 296, missingPct: 24, unique: 934 },
  { name: "Signup Date", type: "Datetime", missing: 24, missingPct: 2, unique: 1198 },
]

export const missingValueBars: { column: string; pct: number }[] = [
  { column: "Income", pct: 24 },
  { column: "Salary", pct: 12 },
  { column: "Age", pct: 2 },
  { column: "Signup Date", pct: 2 },
  { column: "Department", pct: 0.5 },
]

export const datasetStats: { label: string; value: string }[] = [
  { label: "Mean", value: "78,420" },
  { label: "Median", value: "76,000" },
  { label: "Min", value: "41,000" },
  { label: "Max", value: "134,000" },
  { label: "Std Dev", value: "24,180" },
]

export const dataTypeStyles: Record<DataType, string> = {
  Integer: "bg-chart-1/15 text-chart-1 border-chart-1/25",
  Float: "bg-chart-2/15 text-chart-2 border-chart-2/25",
  Categorical: "bg-chart-3/15 text-chart-3 border-chart-3/25",
  Boolean: "bg-chart-4/15 text-chart-4 border-chart-4/25",
  Datetime: "bg-chart-5/15 text-chart-5 border-chart-5/25",
}
