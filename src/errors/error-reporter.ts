import axios from "axios"

export class ErrorReporter {
  async reportErrorAndExit(error: unknown): Promise<void> {
    if (!axios.isAxiosError(error)) throw error
    const report: Record<string, any> = { message: error.message }
    if (error.response?.data) report.details = error.response.data
    console.dir(report, { depth: null })
    process.exit(1)
  }
}
