'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { toast } from 'sonner'
import { bulkImportProblems } from '@/lib/actions/admin'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react'
import type { Problem, ProblemCategory } from '@/types'

interface Props {
  onClose?: () => void
}

export default function CsvImport({ onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<Partial<Problem>[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setErrors([])
    setParsedData([])

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[]
        const validProblems: Partial<Problem>[] = []
        const errList: string[] = []

        rows.forEach((row, idx) => {
          const rowNum = idx + 2 // header is row 1
          const ps_id = (row.ps_id || row['PS ID'] || row['Problem ID'] || '').trim()
          const title = (row.title || row['Title'] || row['Problem Title'] || '').trim()
          const categoryRaw = (row.category || row['Category'] || row['Type'] || 'Software').trim()
          const category: ProblemCategory = categoryRaw.toLowerCase().includes('hard') ? 'Hardware' : 'Software'
          const theme = (row.theme || row['Theme'] || row['Domain'] || 'Miscellaneous').trim()
          const ministry = (row.ministry || row['Ministry'] || '').trim() || undefined
          const organization = (row.organization || row['Organization'] || row['Department'] || 'DSMNRU').trim()
          const description = (row.description || row['Description'] || row['Problem Statement'] || '').trim()
          const background = (row.background || row['Background'] || '').trim() || undefined
          const expected_solution = (row.expected_solution || row['Expected Solution'] || '').trim() || undefined
          const constraints = (row.constraints || row['Constraints'] || '').trim() || undefined
          const max_teams = parseInt(row.max_teams || row['Max Teams'] || '3') || 3

          if (!ps_id) {
            errList.push(`Row ${rowNum}: Missing PS ID`)
            return
          }
          if (!title) {
            errList.push(`Row ${rowNum}: Missing Title for PS ID ${ps_id}`)
            return
          }
          if (!description) {
            errList.push(`Row ${rowNum}: Missing Description for PS ID ${ps_id}`)
            return
          }

          validProblems.push({
            ps_id,
            title,
            category,
            theme,
            ministry,
            organization,
            description,
            background,
            expected_solution,
            constraints,
            max_teams,
            status: 'active',
          })
        })

        setParsedData(validProblems)
        setErrors(errList)
      },
      error: (err) => {
        toast.error(`CSV Parsing error: ${err.message}`)
      },
    })
  }

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('No valid rows to import')
      return
    }

    setLoading(true)
    try {
      const result = await bulkImportProblems(parsedData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Successfully imported ${result.count} problem statements!`)
        setSuccess(true)
        if (onClose) setTimeout(onClose, 1500)
      }
    } catch {
      toast.error('Import failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <h2 className="font-black text-slate-900 text-lg">CSV Problem Import</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Template Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 space-y-1">
        <p className="font-black">Expected CSV Headers:</p>
        <p className="font-mono bg-white/70 p-2 rounded-lg border border-blue-200 text-[11px] overflow-x-auto">
          ps_id, title, category, theme, ministry, organization, description, background, expected_solution, constraints, max_teams
        </p>
      </div>

      {/* File Upload Box */}
      <div className="border-2 border-dashed border-slate-300 hover:border-[#1a237e] rounded-3xl p-8 text-center transition-all bg-slate-50">
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">Click to choose a CSV file or drag and drop</p>
        <p className="text-xs text-slate-400 mt-1">Supports UTF-8 encoded .csv files</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mt-4 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1a237e] file:text-white hover:file:bg-[#283593] cursor-pointer"
        />
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-black text-red-800 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Validation Warnings ({errors.length} skipped rows)
          </p>
          <div className="max-h-32 overflow-y-auto space-y-1 text-xs text-red-700 font-mono">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        </div>
      )}

      {/* Preview Table */}
      {parsedData.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Preview ({parsedData.length} Valid Rows Ready for Import)
            </p>
          </div>
          <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-black text-slate-700 sticky top-0">
                <tr>
                  <th className="p-2.5">PS ID</th>
                  <th className="p-2.5">Title</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Theme</th>
                  <th className="p-2.5">Organization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-[#1a237e]">{row.ps_id}</td>
                    <td className="p-2.5 font-bold text-slate-800 max-w-[200px] truncate">{row.title}</td>
                    <td className="p-2.5 font-semibold">{row.category}</td>
                    <td className="p-2.5 text-slate-600 max-w-[120px] truncate">{row.theme}</td>
                    <td className="p-2.5 text-slate-600 max-w-[120px] truncate">{row.organization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 10 && (
              <p className="text-center py-2 text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
                + {parsedData.length - 10} more rows
              </p>
            )}
          </div>
        </div>
      )}

      {/* Import Action */}
      {parsedData.length > 0 && (
        <button
          onClick={handleImport}
          disabled={loading || success}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Importing Problems...</>
          ) : success ? (
            <><CheckCircle2 className="w-4 h-4" /> Import Complete!</>
          ) : (
            <><FileSpreadsheet className="w-4 h-4" /> Confirm & Import {parsedData.length} Problems</>
          )}
        </button>
      )}
    </div>
  )
}
