<?php
error_reporting(E_ALL);
ob_start("ob_gzhandler");
$ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
    96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136,
    137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177,
    178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200];
$array_count = count($ar);
$column_count = 7;
$raw_count = ceil($array_count / $column_count);
$raw_number = 0;
$cell_number = 0;
$table = '<table style="border:1px solid #000;"><thead><tr><td colspan="' . $column_count . '" style="text-align: center;">' . $column_count . ' колонок</td></tr></thead><tbody>';
//$array_count % $array_count ? $column_count = $column_count : $column_count = $column_count + 1;
for ($raw_number = 0; $raw_number < $raw_count; $raw_number++) {
    $table .= '<tr>';
    for ($i = 0; $i < $column_count; $i++) {
        if (!isset($ar[$cell_number])) {
            $cell_number = $raw_number + 1;
            if ($i === $column_count - 1) {
                $i = $column_count;
                $table .= '<td class="cl-' . $i . '" style="border: 1px dotted #000; width: 4vw;text-align: center;"></td>';
                $cell_number = $raw_number + 2;
            }
        }
        if (isset($ar[$cell_number]) && $i < $column_count) {
            $table .= '<td class="i-' . $i . '" style="width: 4vw;text-align: center;">' . $ar[$cell_number] . '</td>';
            $cell_number = $cell_number + $raw_count;
        }
        if (isset($ar[$cell_number]) && $i === $column_count) {
            $cell_number = $raw_number + 1;
            $i = $column_count;
        }
    }
    $table .= '</tr>';
}
$table .= '</tbody></table>';
echo $table;