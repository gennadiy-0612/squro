<?php
error_reporting(E_ALL);
ob_start("ob_gzhandler");
$site = 'http://espreso.tv';
$target = file_get_contents($site);
$list = '';
preg_match_all('|(<a href=")(http[s]?[\/]{0,2}[w]{0,3}[^\/]{1.50})?(.{1,655}">)(.{1,400}</a>)|', $target, $out, PREG_PATTERN_ORDER);
for ($i = 0; $i < count($out[0]); $i++) {
        $list[$i] = $out[1][$i] . $out[2][$i] . $out[3][$i] . $out[4][$i] . "<br> ";
}
$list_uniq = array_unique($list);
$string = implode($list);
$pattern = '/(href=")(\/[^"]{1,50}\">)/i';
$replacement = "$1$site$2";
echo preg_replace($pattern, $replacement, $string);
