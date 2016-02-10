<?php

/**
 * Created by PhpStorm.
 * User: Gennadiy
 * Date: 11.12.2015
 * Time: 13:43
 */
class Crud extends SQLite3
{
    public $conn = '';
    public $result = '';
    public $show = '';

    function __construct()
    {
        $this->open('test.db');
    }

    public function read()
    {
        $this->result = $this->query('SELECT ID, STATE, TIMESTAMP FROM HISTORY WHERE ID = (SELECT max(ID)FROM HISTORY);');
        $this->show = $this->result->fetchArray()[1];
    }

    public function readhistory()
    {
        $this->result = $this->query('SELECT ID, timestamp FROM HISTORY');
        $i = 0;
        while ($row = $this->result->fetchArray()) {
            $this->show .= '<li>
            <span class="number">' . $row[0] . '</span>
            <span class="date">' . $row[1] . '</span>
            <span class="remove" title="Remove item history">-</span>
            <span class="clone" title="Clone item history">+</span></li>';
            $i++;
        }
    }

    public function updatehistory($id)
    {
        $this->result = $this->query('SELECT STATE FROM HISTORY WHERE ID = ' . $id . ';');
        $this->show = $this->result->fetchArray()[0];
    }

    public function insethistory($ul)
    {
        $this->result = $this->query('SELECT ID, STATE, TIMESTAMP FROM HISTORY WHERE ID = ' . $ul . ';');
        $this->query('INSERT INTO HISTORY (STATE) VALUES (\'' . $this->result->fetchArray()[1] . '\');');
        $this->result = $this->query('SELECT STATE FROM HISTORY WHERE ID = (SELECT max(ID)FROM HISTORY);');
        $this->show = $this->result->fetchArray()[0];
    }

    public function insertul($ul)
    {
        $this->query('INSERT INTO HISTORY (STATE) VALUES (\'' . $ul . '\');');
        $this->result = $this->query('SELECT STATE FROM HISTORY WHERE ID = (SELECT max(ID)FROM HISTORY);');
        $this->show = $this->result->fetchArray()[0];
    }

    public function deletehistory($id)
    {
        $this->result = $this->query('DELETE  FROM HISTORY WHERE ID = ' . $id . ';');
    }
}

$dbData = new Crud();
if (isset($_POST['readhistory'])) {
    $dbData->readhistory();
    echo $dbData->show;
}
if (isset($_POST['updatehistory'])) {
    $num = intval($_POST['updatehistory']);
    $dbData->updatehistory($num);
    echo $dbData->show;
}
if (isset($_POST['insethistory'])) {
    $dbData->insethistory($_POST['insethistory']);
    echo $dbData->show;
}
if (isset($_POST['insertul'])) {
    $dbData->insertul($_POST['insertul']);
    echo $dbData->show;
}
if (isset($_POST['deletehistory'])) {
    $num = intval($_POST['deletehistory']);
    $dbData->deletehistory($num);
}