<?php
//Read incoming requests and decide what to do with them.
$request = json_decode(file_get_contents('php://input'),true);
echo json_encode($request);