<?php
function uniqueId() {
    $bytes = random_bytes(42);
    $url = base64_encode($bytes);
    $url = str_replace("+", "-", $url);
    $url = str_replace("/", "_", $url);
    return $url;
}
if(!isset($_GET["id"])) {
    header("Refresh:0; url=?id=" . uniqueId());
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="description" content="Simple page to help you remember what you want to buy in the future">

        <link rel="manifest" href="manifest.json" />
        <!-- ios support -->
        <link rel="apple-touch-icon" href="assets/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" href="assets/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" href="assets/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" href="assets/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" href="assets/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" href="assets/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="assets/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" href="assets/icons/icon-512x512.png" />
        <meta name="apple-mobile-web-app-status-bar" content="#b63ff6" />
        <meta name="theme-color" content="#b63ff6" />

        <title>Stuff to buy</title>

        <style>
            <?php echo require_once("assets/style.css") ?>
        </style>
    </head>
    <body>
        <div id="content">
            <img id="logo" alt="Stuff to buy" src="assets/logo.svg" />

            <div id="maincontent">
            
                <div class="fullwidth flex-row">
                    <div class="textfield-box">
                        <input aria-label="Paste product URL here and press enter" placeholder=" " />
                        <label>Paste product URL here and press enter<label>
                    </div>

                    <button id="addItem">ADD</button>
                </div>

                <ul class="white" id="articlelist">                 
                </ul>                    
            </div>
        </div>
        
        <template>
            <li class="list-item">
                <span class="list-item__graphic" aria-hidden="true"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/></span>
                <span class="list-item__text">
                    <span class="list-item__primary-text">Two-line item</span>                
                    <span class="list-item__secondary-text">Secondary text</span>
                </span>
                <button class="list-item__button delete-button">Delete</button>
            </li>
        </template>

        <script>
            <?php echo require_once("assets/page.js") ?>

            if('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./sw.js');
            };
        </script>
    </body>
</html>