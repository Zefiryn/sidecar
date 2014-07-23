<?php

$response = array('valid' => false);
if (isset($_GET['id']) && isset($_GET['user'])) {
    $response['valid'] = strstr($_GET['user'] , '@kobugi.pl') ? true : false;
    $response['id'] = $_GET['id'];
    $response['user'] = $_GET['user'];
}

echo json_encode($response);
