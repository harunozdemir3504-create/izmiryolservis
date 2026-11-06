param([string]$OutDir = "C:\Users\Harun\.gemini\antigravity\scratch\izmir-yol-yardim\video-assets\voice")

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

# EMRE = yorgun, bıkkın, biraz kalın ses | MERT = enerjik, neşeli, biraz ince ses
$E = @{ pitch = '-14%'; rate = '0.98' }
$M = @{ pitch = '+10%'; rate = '1.10' }

$phrases = @(
  @{ id = 'e1'; p = @{ pitch = '-22%'; rate = '0.72' }; t = 'Offff. Of ya.' },
  @{ id = 'm1'; p = $M; t = 'Ne oldu kanka?' },
  @{ id = 'm2'; p = $M; t = 'Niye öyle ofluyorsun?' },
  @{ id = 'e3'; p = $E; t = 'Sorma kanka.' },
  @{ id = 'e4'; p = $E; t = 'İşler çok yoğun.' },
  @{ id = 'e5'; p = $E; t = 'Arabamın bakımı geldi ama gidemiyorum.' },
  @{ id = 'e6'; p = $E; t = 'Hem çok sıra var zaten, vaktim yok.' },
  @{ id = 'm3'; p = @{ pitch = '+12%'; rate = '1.0' }; t = 'Bak oğlum!' },
  @{ id = 'm4'; p = $M; t = 'İzmir yol servis, nokta kom, nokta te re sitesine gir.' },
  @{ id = 'm5'; p = $M; t = 'Oradan belgeli ustalar, on beş dakikada kapında!' },
  @{ id = 'm6'; p = $M; t = 'Uygun fiyata, kaliteli hizmet.' },
  @{ id = 'm7'; p = $M; t = 'Tamir de yapıyorlar!' },
  @{ id = 'e7'; p = @{ pitch = '-8%'; rate = '1.05' }; t = 'Ciddi misin?' },
  @{ id = 'e8'; p = @{ pitch = '-8%'; rate = '1.08' }; t = 'Valla süper, hemen giriyorum!' }
)

foreach ($l in $phrases) {
  $full = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR"><prosody pitch="' + $l.p.pitch + '" rate="' + $l.p.rate + '">' + $l.t + '</prosody></speak>'
  $stream = Await ($synth.SynthesizeSsmlToStreamAsync($full)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $size = [uint32]$stream.Size
  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
  $null = Await ($reader.LoadAsync($size)) ([uint32])
  $bytes = New-Object byte[] $size
  $reader.ReadBytes($bytes)
  $path = Join-Path $OutDir ($l.id + '.wav')
  [System.IO.File]::WriteAllBytes($path, $bytes)
  Write-Output ("{0} -> {1} bytes" -f $l.id, $size)
}
