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

    public function history()
    {
        $this->result = $this->query('SELECT ID, timestamp FROM HISTORY');
        $show = '';
        $i = 0;
        while ($row = $this->result->fetchArray()) {
            $show .= '<li><span class="number">' . $row[0] . '</span>
            <span class="date">' . $row[1] . '</span>
            <span class="remove">-</span>
            <span class="clone">+</span></li>';
            $i++;
        }
        echo '<ol start="0" id="history"><li class="close">X</li>', $show, '<li class="opacity"><span class="plus">-</span><span class="minus">+</span></li></ol>';
    }

    public function going($id)
    {
        $this->result = $this->query('SELECT ID, STATE, TIMESTAMP FROM HISTORY WHERE ID = ' . $id . ';');
        echo $this->result->fetchArray()[1];
    }

    public function removeItem($id)
    {
        $this->result = $this->query('DELETE  FROM HISTORY WHERE ID = ' . $id . ';');
        $this->result = $this->query('SELECT ID, STATE, TIMESTAMP FROM HISTORY WHERE ID = (SELECT max(ID)FROM HISTORY);');
        echo $this->result->fetchArray()[1];
    }

    public function movehistory($id)
    {
        $this->result = $this->query('SELECT ID, STATE, TIMESTAMP FROM HISTORY WHERE ID = ' . $id . ';');
        echo $this->result->fetchArray()[1];
    }

    public function insert($ul)
    {
        $this->exec('INSERT INTO HISTORY (STATE) VALUES (\'' . SQLite3::escapeString($ul) . '\');');
        $this->result = $this->query('SELECT ID, STATE, TIMESTAMP FROM HISTORY WHERE ID = (SELECT max(ID)FROM HISTORY);');
        echo $this->result->fetchArray()[1];
    }
}

$insertul = new Crud();
if (isset($_POST['history'])) {
    $insertul->history();
}
if (isset($_POST['insert'])) {
    $insertul->insert($_POST['insert']);
}
if (isset($_POST['id'])) {
    $num = intval($_POST['id']);
    $insertul->going($num);
}
if (isset($_POST['removeitem'])) {
    $num = intval($_POST['removeitem']);
    $insertul->removeItem($num);
}
if (isset($_POST['movehistory'])) {
    $num = intval($_POST['movehistory']);
    $insertul->movehistory($num);
}