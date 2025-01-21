# Define the command and arguments
$pnpmPath = "C:\Users\bahra\AppData\Local\pnpm\pnpm.exe"
$arguments = "make"

# Define the interval in seconds
$interval = 5

# Function to run the command
function Run-Command {
    try {
        $process = Start-Process -FilePath $pnpmPath -ArgumentList $arguments -NoNewWindow -PassThru -Wait
        $output = $process.StandardOutput.ReadToEnd()
        $errorOutput = $process.StandardError.ReadToEnd()
        
        if ($output) {
            Write-Output $output
        }
        if ($errorOutput) {
            Write-Error $errorOutput
        }
    } catch {
        Write-Error $_.Exception.Message
    }
}

# Run the command every interval
while ($true) {
    Run-Command
    Start-Sleep -Seconds $interval
}