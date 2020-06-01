<?php
require_once("config.php");

function only_allow_base64_url( $s ) {
    if ( ! preg_match( '/^[a-zA-Z0-9_-]*$/', $s ) ) {
        echo "NOT A VALID ID";
        die();
    }
}

only_allow_base64_url($_GET["id"]);

if(!file_exists($_GET["id"])) {
    echo "[]";
    exit();
}
echo base64_decode(file_get_contents(DATADIR . $_GET["id"]));