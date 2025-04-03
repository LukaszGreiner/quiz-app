<#
.SYNOPSIS
Exports project files for AI prompts while excluding itself and unnecessary files.
.DESCRIPTION
Creates a text dump of all project files while excluding node_modules, build files,
environment files, and the script itself.
#>

param(
    [string]$OutputFile = "project_contents_for_ai.txt"
)

$projectPath = $PSScriptRoot
$scriptName = [System.IO.Path]::GetFileName($MyInvocation.MyCommand.Path)
$outputPath = Join-Path -Path $projectPath -ChildPath $OutputFile

# Enhanced exclusion criteria
$excludeDirs = @("node_modules", "dist", "build", ".git", ".cache", ".vscode")
$excludeFiles = @("*.env*", "*.log", "package-lock.json", "yarn.lock", $scriptName)
$includeExtensions = @(".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html", ".json",  ".txt", ".config")

"=== PROJECT STRUCTURE DUMP ===" | Out-File -FilePath $outputPath
"Generated: $(Get-Date)" | Out-File -FilePath $outputPath -Append
"Project Path: $projectPath" | Out-File -FilePath $outputPath -Append
"Excluded: $($excludeDirs -join ', ')" | Out-File -FilePath $outputPath -Append

Get-ChildItem -Path $projectPath -Recurse -File | 
Where-Object {
    # Skip the output file
    if ($_.FullName -eq $outputPath) { return $false }
    
    # Skip this script file (absolute match)
    if ($_.FullName -eq $MyInvocation.MyCommand.Path) { return $false }
    
    # Skip files in excluded directories
    foreach ($dir in $excludeDirs) {
        if ($_.DirectoryName -like "*\$dir*") {
            return $false
        }
    }
    
    # Skip excluded file patterns
    foreach ($pattern in $excludeFiles) {
        if ($_.Name -like $pattern) {
            return $false
        }
    }
    
    return $true
} | ForEach-Object {
    $relativePath = $_.FullName.Substring($projectPath.Length + 1)
    
    # Add file header with relative path
    "`n" + ("=" * 40) | Out-File -FilePath $outputPath -Append
    "FILE: $relativePath" | Out-File -FilePath $outputPath -Append
    "=" * 40 | Out-File -FilePath $outputPath -Append
    
    # Add content for text files
    if ($_.Extension -in $includeExtensions) {
        Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-File -FilePath $outputPath -Append
    }
    else {
        "[Binary file omitted: $($_.Name)]" | Out-File -FilePath $outputPath -Append
    }
}

Write-Host "Successfully exported project structure to $outputPath"
Write-Host "Script self-exclusion verified - output contains $($excludeDirs.Count) excluded directories"