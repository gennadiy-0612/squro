<?php
/**
 * Created by PhpStorm.
 * User: Gennadiy
 * Date: 11.12.2015
 * Time: 13:33
 */
error_reporting(E_ALL);
ob_start("ob_gzhandler");

/**
 * Simple example of extending the SQLite3 class and changing the __construct
 * parameters, then using the open method to initialize the DB.
 */
class MyDB extends SQLite3
{
    function __construct()
    {
        $this->open('squro.db');
    }
}

//$ulcontent = $_POST['ulcontent'];
$db = new MyDB();

$db->exec('DROP TABLE IF EXISTS `foo`;');
$db->exec('CREATE TABLE foo (bar STRING)');
$db->exec("INSERT INTO foo (bar) VALUES ('<ul>
    <li>Home</li>
    <li>Home1</li>
    <li>Solutions
        <ul>
            <li>Education</li>
            <li>Solutions
                <ul>
                    <li>Consumer photo and video</li>
                    <li>Mobile</li>
                </ul>
            </li>
            <li>Financial services</li>
            <li>Government</li>
            <li>Manufacturing</li>
            <li>All industries and solutions</li>
        </ul>
    </li>
    <li>Solutions1
        <ul>
            <li>Education1</li>
            <li>Financial services1</li>
            <li>Government1</li>
            <li>Manufacturing1</li>
            <li>Solutions
                <ul>
                    <li>Consumer photo and video1</li>
                    <li>Mobile1</li>
                </ul>
            </li>
            <li>All industries and solutions1</li>
        </ul>
    </li>
</ul>');");

$result = $db->query('SELECT bar FROM foo');
echo $result->fetchArray()[0];