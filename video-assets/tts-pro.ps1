param([string]$OutDir = "C:\Users\Harun\.gemini\antigravity\scratch\izmir-yol-yardim\video-assets\voice-pro")

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

# ZERO artificial pitch shifting! We use natural rate and SSML emphasis so it sounds 100% natural human without robotic buzz.
$dialogue = @(
  @{ id = 'd1_emre'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody rate="0.88">Of ya...<break time="300ms"/> Offff.</prosody></speak>' },
  @{ id = 'd2_mert'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody rate="1.04">Ne oldu kanka?<break time="200ms"/> Niye öyle ofluyorsun?</prosody></speak>' },
  @{ id = 'd3_emre'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody rate="0.94">Sorma kanka.<break time="200ms"/> İşler çok yoğun.<break time="200ms"/> Arabanın bakımı geldi ama sanayiye gidemiyorum.<break time="250ms"/> Hem çok sıra var,<break time="150ms"/> hem de vaktim yok.</prosody></speak>' },
  @{ id = 'd4_mert'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody rate="1.05">Bak oğlum!<break time="250ms"/> izmiryolservis.com.tr sitesine gir.<break time="250ms"/> Oradan belgeli ustalar on beş dakikada kapında!<break time="250ms"/> Uygun fiyata kaliteli hizmet,<break time="150ms"/> yerinde tamir ve bakım yapıyorlar.</prosody></speak>' },
  @{ id = 'd5_emre'; ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody rate="1.02">Ciddi misin?<break time="200ms"/> Valla süper,<break time="150ms"/> hemen giriyorum!</prosody></speak>' }
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
