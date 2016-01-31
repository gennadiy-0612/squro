<?php
/**
 * Created by PhpStorm.
 * User: Gennadiy
 * Date: 07.12.2015
 * Time: 13:06
 */

namespace ajax;

class MyDB extends SQLite3
{
    function __construct()
    {
        $this->open('squro.db');
    }
}

$db = new MyDB();
$db->exec('DROP TABLE IF EXISTS `foo`;');
$db->exec('CREATE TABLE foo (bar STRING)');
$db->exec("INSERT INTO foo (bar) VALUES ('kkkkkkkkkkkkkkkk')");
$result = $db->query('SELECT bar FROM foo');
echo $result->fetchArray()[0];