<?php
error_reporting(E_ALL);
ob_start("ob_gzhandler");

require_once('CrudClass.php');
$read = new Crud;
$read->read();

echo '<!DOCTYPE html>
<html lang="en">
 <head>
    <meta charset="UTF-8">
    <title>Squro tree</title>
    <link rel="stylesheet" href="squro.css">
    <script type="text/javascript" src="squro.js"></script>
 </head>
 <body>
  <h1>Squro tree</h1>
   <ul class="node">' .
    $read->show .
    '</ul>
 </body>
</html>';