<?php

$opts = array(
    'http'=>array(
        'method'=>"GET",
        'header'=>"Accept-language: en\r\n" .
                "user-agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36\r\n"
    )
);

$context = stream_context_create($opts);

$content = file_get_contents($_GET["url"], false, $context);

$data = array();
$data['title'] = '';
$data['desc'] = '';
$data['img'] = '';

preg_match_all('/<meta.*property="og:title".*content="(.*)"/', $content, $matches);
if(!isset($matches[1][0])) {
    preg_match_all('/<span.*id="productTitle".*>([^<]+)/', $content, $matches);
}
if(isset($matches[1]) && isset($matches[1][0])) {
    $data['title'] = trim($matches[1][0]);
}

preg_match_all('/<meta.*property="og:description".*content="(.*)"/', $content, $matches);
if(isset($matches[1]) && isset($matches[1][0])) {
    $data['desc'] = trim($matches[1][0]);
}

preg_match_all('/<meta.*property="og:image".*content="(.*)"/', $content, $matches);
if(!isset($matches[1][0])) {
    preg_match_all('/<img.*src="([^"]+)".*id="landingImage/', $content, $matches);
}

if(isset($matches[1]) && isset($matches[1][0])) {
    $data['img'] = trim($matches[1][0]); 
}

echo json_encode($data);