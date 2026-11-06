param([string]$OutDir = "C:\Users\Harun\.gemini\antigravity\scratch\izmir-yol-yardim\video-assets\voice-clean")

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]

$asTaskOp = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [Type]$t) {
  $task = $asTaskOp.MakeGenericMethod($t).Invoke($null, @($op))
  $task.Wait() | Out-Null
  return $task.Result
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = ([Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.Language -eq 'tr-TR' })[0]

# Natural, human Turkish dialogue without metallic pitch distortion
$phrases = @(
  @{ id = 'e1'; text = 'Offff, of ya.' },
  @{ id = 'm1'; text = 'Ne oldu kanka? Niye ofluyorsun?' },
  @{ id = 'e2'; text = 'İşler çok yoğun. Arabanın bakımı geldi ama sanayiye gidemiyorum, sıra bekleyecek vaktim yok.' },
  @{ id = 'm2'; text = 'Oğlum izmiryolservis.com.tr sitesine baksana! Belgeli ustalar on beş dakikada kapına geliyor.' },
  @{ id = 'm3'; text = 'Hem uygun fiyata kaliteli hizmet veriyorlar, hem de yerinde tamir ve bakım yapıyorlar.' },
  @{ id = 'e3'; text = 'Ciddi misin? Valla süpermiş, hemen giriyorum!' }
)

foreach ($l in $phrases) {
  $stream = Await ($synth.SynthesizeTextToStreamAsync($l.text)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $size = [uint32]$stream.Size
  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
  $null = Await ($reader.LoadAsync($size)) ([uint32])
  $bytes = New-Object byte[] $size
  $reader.ReadBytes($bytes)
  $path = Join-Path $OutDir ($l.id + '.wav')
  [System.IO.File]::WriteAllBytes($path, $bytes)
  Write-Output ("{0} -> {1} bytes" -f $l.id, $size)
}
