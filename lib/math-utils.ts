// Calculate Pearson correlation coefficient between two arrays
export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0

  const n = x.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0

  for (let i = 0; i < n; i++) {
    sumX += x[i]
    sumY += y[i]
    sumXY += x[i] * y[i]
    sumX2 += x[i] * x[i]
    sumY2 += y[i] * y[i]
  }

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}

// Compute a correlation matrix for given columns
export function computeCorrelationMatrix(rows: any[], columns: string[]): number[][] {
  const matrix: number[][] = []
  
  // Pre-extract arrays for speed
  const data: Record<string, number[]> = {}
  for (const col of columns) {
    data[col] = []
  }
  
  for (const row of rows) {
    for (const col of columns) {
      if (typeof row[col] === "number") {
        data[col].push(row[col])
      } else {
        data[col].push(0) // basic fallback for missing/NaN in correlation
      }
    }
  }

  for (let i = 0; i < columns.length; i++) {
    matrix[i] = []
    for (let j = 0; j < columns.length; j++) {
      if (i === j) {
        matrix[i][j] = 1
      } else if (j < i) {
        matrix[i][j] = matrix[j][i] // symmetrical
      } else {
        matrix[i][j] = pearsonCorrelation(data[columns[i]], data[columns[j]])
      }
    }
  }
  return matrix
}

// Compute histogram bins for a given numeric array
export function computeHistogram(values: number[], binsCount = 12) {
  if (values.length === 0) return []

  const min = Math.min(...values)
  const max = Math.max(...values)
  
  if (min === max) {
    return [{ binStart: min, binEnd: max, count: values.length }]
  }

  const binSize = (max - min) / binsCount
  const bins: { binStart: number; binEnd: number; count: number }[] = Array(binsCount).fill(0).map((_, i) => ({
    binStart: min + i * binSize,
    binEnd: min + (i + 1) * binSize,
    count: 0
  }))

  for (const v of values) {
    let binIndex = Math.floor((v - min) / binSize)
    if (binIndex === binsCount) binIndex-- // Include max value in last bin
    if (bins[binIndex]) {
      bins[binIndex].count++
    }
  }

  return bins
}

// Compute class frequencies
export function computeFrequencies(values: any[]) {
  const freqs: Record<string, number> = {}
  let total = 0
  for (const v of values) {
    if (v === null || v === undefined) continue
    const key = String(v)
    freqs[key] = (freqs[key] || 0) + 1
    total++
  }

  return Object.entries(freqs)
    .map(([name, count]) => ({ name, count, pct: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count)
}
