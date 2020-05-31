<?php
function only_allow_base64_url( $s ) {
    if ( ! preg_match( '/^[a-zA-Z0-9_-]*$/', $s ) ) {
        echo "NOT A VALID ID";
        die();
    }
}
function only_allow_base64( $s ) {
    if ( ! preg_match( '/^[a-zA-Z0-9+\/]*=*$/', $s ) ) {
        echo "NOT VALID DATA";
        die();
    } 
}
only_allow_base64_url($_POST["id"]);
only_allow_base64($_POST["data"]);

file_put_contents($_POST["id"], $_POST["data"]);