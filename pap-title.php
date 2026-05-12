<?php
if (!isset($_GET['run']) || $_GET['run'] !== 'pap2025') { http_response_code(403); die(); }
require_once(__DIR__ . '/wp-load.php');

update_option('blogname', 'Passo a Passo Uniformes');
update_option('blogdescription', 'Uniformes Escolares Premium desde 1998');

unlink(__FILE__);
header('Content-Type: application/json');
echo json_encode(['success' => true, 'title' => get_option('blogname')]);
