Wireframes for Uni-Borrow System

Files in this folder:
- dashboard.svg           — dashboard overview wireframe
- equipment-catalog.svg   — equipment catalog/grid wireframe
- my-requests.svg         — user requests list wireframe
- request-details.svg     — single request detail/timeline wireframe
- approvals.svg           — staff approvals queue wireframe
- borrow-dialog.svg       — borrow request modal/dialog wireframe

How to export to PNG (Windows PowerShell):

Using ImageMagick (magick):

  Set-Location 'C:\bits\uni-borrow-system\design\wireframes'
  New-Item -Path . -Name png -ItemType Directory -Force

  Get-ChildItem -Filter '*.svg' | ForEach-Object {
    $out = Join-Path 'png' ($_.BaseName + '.png')
    magick $_.FullName -density 150 -background white -flatten $out
  }

  Compress-Archive -Path .\png\* -DestinationPath .\wireframes-pngs.zip -Force

Using Inkscape:

  inkscape "file.svg" --export-type=png --export-filename="file.png"

If you want, I can also create the PNGs and a ZIP here (if you want me to run commands), or provide them as downloads if the environment supports it.
