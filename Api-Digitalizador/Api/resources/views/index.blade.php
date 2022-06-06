<!DOCTYPE html>
<html lang="en">
<head>
    <title>Scanner.js demo: Scan as JPEG and display on the web page</title>
    <meta charset='utf-8'>
    <script src="{{ URL::asset('scannerjs/scanner.js') }}" type="text/javascript"></script>

    <script>
        function scanToLocalDisk() {
            scanner.scan(displayResponseOnPage,
                {
                    "output_settings": [
                        {
                            "type": "save",
                            "format": "jpg",
                            "save_path": "C:\\Users\\Familia\\Desktop\\Digitalizador de documentos\\frontend\\SPA-app\\src\\views\\pages\\terms\\scanner.jpg"
                        }
                    ]
                }
            );
        }

        function displayResponseOnPage(successful, mesg, response) {
            if(!successful) { 
                document.getElementById('response').innerHTML = 'Failed: ' + mesg;
                return;
            }

            if(successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
                document.getElementById('response').innerHTML = 'cancelled';
                return;
            }

            scanner.getSaveResponse(response);
            
            window.location.href = 'http://localhost:3000/digitalizar-arquivo-scanner'
        }
    </script>

    <style>
        img.scanned {
            height: 200px; /** Sets the display size */
            margin-right: 12px;
        }

        div#images {
            margin-top: 20px;
        }
    </style>
</head>
<body onload="scanToLocalDisk()">

    <h2>Scannendo...</h2>

    <div id="response"></div>
</body>
</html>