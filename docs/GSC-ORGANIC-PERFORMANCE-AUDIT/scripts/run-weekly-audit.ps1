# ============================================================
#  run-weekly-audit.ps1 — Weekly GSC Organic Performance Pipeline
#  dreamlab.id | Re-runs full 16-month audit + archives snapshot
#  Schedule via Windows Task Scheduler (see APPENDIX Part 2)
# ============================================================
param(
    [string]$PythonExe = "python"
)
$ErrorActionPreference = "Stop"
$Scripts   = $PSScriptRoot
$ReportRoot = Split-Path $Scripts -Parent
$Snapshot  = Join-Path $ReportRoot "weekly-snapshots"
New-Item -ItemType Directory -Force -Path $Snapshot | Out-Null

$stamp = Get-Date -Format "yyyy-MM-dd"
$log   = Join-Path $Snapshot "run-$stamp.log"
"=== GSC Weekly Audit $stamp ===" | Out-File -FilePath $log -Encoding utf8

function Run-Step([int]$n, [int]$total, [string]$label, [string]$script) {
    Write-Host "[$n/$total] $label ..."
    "`n[$n/$total] $label" | Out-File -FilePath $log -Append -Encoding utf8
    & $PythonExe (Join-Path $Scripts $script) 2>&1 | Tee-Object -FilePath $log -Append
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  !! FAILED (exit $LASTEXITCODE)" -ForegroundColor Red
        exit 1
    }
    Write-Host "  OK" -ForegroundColor Green
}

Run-Step 1 9 "Pull GSC data (16 months + windows)"   "10_collect_data.py"
Run-Step 2 9 "Page-level analysis"                   "20_analysis_pages.py"
Run-Step 3 9 "Query-level analysis"                  "21_analysis_queries.py"
Run-Step 4 9 "Folders, trends, redesign, dashboard"  "22_folders_dashboard.py"
Run-Step 5 9 "Insights for reports"                  "23_insights.py"
Run-Step 6 9 "Executive summary"                     "40_report_exec.py"
Run-Step 7 9 "Full analysis"                         "41_report_full.py"
Run-Step 8 9 "Recommendations / quick wins / content" "42_report_actions.py"
Run-Step 9 9 "Final exports + README"                "50_final_exports.py"

# ---- archive snapshot ----
$dest = Join-Path $Snapshot $stamp
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item (Join-Path $ReportRoot "exports\*") -Destination $dest -Recurse -Force
Copy-Item (Join-Path $ReportRoot "*.md") -Destination $dest -Force
"`nSnapshot archived to: $dest" | Out-File -FilePath $log -Append -Encoding utf8
Write-Host "`nDONE. Snapshot: $dest" -ForegroundColor Green
Write-Host "Review: executive-summary.md, dashboard.json, monthly-trend.csv"
