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
        <title>Stuff to buy</title>
        <link href="assets/style.css" rel="stylesheet">
        <link href="https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css" rel="stylesheet">
        <script src="https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js"></script>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <body>
        <div id="content">
            <img alt="Stuff to buy" src="assets/logo.svg" />

            <div id="maincontent">

                <div class="fullwidth mdc-text-field mdc-text-field--with-leading-icon">
                    <i class="material-icons mdc-text-field__icon">link</i>
                    <input class="mdc-text-field__input" id="urlinput" onchange="loadUrl(event)">
                    <div class="mdc-line-ripple"></div>
                    <label for="text-field-hero-input" class="mdc-floating-label">Paste product URL here and press enter</label>
                </div>

                <ul class="white mdc-list mdc-list--two-line" id="articlelist">                 
                </ul>                    
            </div>
        </div>
        
        <template>
            <li class="mdc-list-item">
                <span class="mdc-list-item__graphic" aria-hidden="true"><img width="50" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/></span>
                <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">Two-line item</span>                
                    <span class="mdc-list-item__secondary-text">Secondary text</span>
                </span>
                <span class="mdc-list-item__meta material-icons" aria-hidden="true">delete</span>                
            </li>
        </template>

        <script src="assets/page.js"></script>
    </body>
</html>