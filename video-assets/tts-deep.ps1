param([string]$OutDir = "C:\Users\Harun\.gemini\antigravity\scratch\izmir-yol-yardim\video-assets\voice-deep")

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]

$asTaskOp = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [Type]$t) {
  $task = $asTaskOp.MakeGenericMethod($t).Invoke($null, @($op))
  $task.Wait() | Out-Null
  return $task.Result
}

if (Test-Path $OutDir) { Remove-Item "$OutDir\*.wav" -Force }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = ([Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.Language -eq 'tr-TR' })[0]

# Deep, masculine, punchy voices (No dragging, no delay)
$dialogue = @(
  @{ id = 'd1_emre'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody pitch="-6%" rate="0.95">Of ya...<break time="150ms"/> Offff.</prosody></speak>' },
  @{ id = 'd2_mert'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody pitch="-5%" rate="1.12">Ne oldu kanka?<break time="100ms"/> Niye ofluyorsun?</prosody></speak>' },
  @{ id = 'd3_emre'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody pitch="-6%" rate="1.08">Sorma kanka.<break time="120ms"/> İşler çok yoğun.<break time="120ms"/> Arabamın bakımı geldi ama sanayiye gidemiyorum.<break time="120ms"/> Çok sıra var, vaktim yok.</prosody></speak>' },
  @{ id = 'd4_mert'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody pitch="-5%" rate="1.14">Bak oğlum!<break time="150ms"/> izmiryolservis.com.tr sitesine gir.<break time="150ms"/> Belgeli ustalar on beş dakikada kapında!<break time="150ms"/> Uygun fiyata kaliteli hizmet, yerinde tamir ve bakım yapıyorlar.</prosody></speak>' },
  @{ id = 'd5_emre'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody pitch="-5%" rate="1.12">Ciddi misin?<break time="100ms"/> Valla süper, hemen giriyorum!</prosody></speak>' }
)

foreach ($d in $dialogue) {
  $stream = Await ($synth.SynthesizeSsmlToStreamAsync($d.ssml)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $size = [uint32]$stream.Size
  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
  $null = Await ($reader.LoadAsync($size)) ([uint32])
  $bytes = New-Object byte[] $size
  $reader.ReadBytes($bytes)
  $path = Join-Path $OutDir ($d.id + '.wav')
  [System.IO.File]::WriteAllBytes($path, $bytes)
  Write-Output ("{0} -> {1} bytes" -f $d.id, $size)
}
