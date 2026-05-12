<?php
if (!isset($_GET['run']) || $_GET['run'] !== 'pap2025') {
    http_response_code(403);
    die('Forbidden');
}

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

$post_id = 69;

// Read the Stitch design HTML (already uploaded to public_html)
$html_file = __DIR__ . '/index.html';
if (!file_exists($html_file)) {
    die(json_encode(['error' => 'index.html not found at: ' . $html_file]));
}
$raw_html = file_get_contents($html_file);

// Extract head extras: Tailwind CDN, fonts, styles, tailwind config
$head_extras = '';

// Tailwind CDN
if (preg_match('/<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>/', $raw_html, $m)) {
    $head_extras .= $m[0] . "\n";
}

// Google Fonts links
preg_match_all('/<link href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*\/>/', $raw_html, $fm);
foreach (array_unique($fm[0]) as $link) {
    $head_extras .= $link . "\n";
}

// Tailwind config script
if (preg_match('/<script id="tailwind-config"[^>]*>.*?<\/script>/si', $raw_html, $m)) {
    $head_extras .= $m[0] . "\n";
}

// Custom styles
if (preg_match('/<style>(.*?)<\/style>/si', $raw_html, $m)) {
    $head_extras .= '<style>' . $m[1] . '</style>' . "\n";
}

// Extract body content
if (!preg_match('/<body[^>]*>(.*?)<\/body>/si', $raw_html, $bm)) {
    die(json_encode(['error' => 'Could not extract body content']));
}
$body_content = $bm[1];

// Full HTML widget content = head extras + body content
$html_widget_content = $head_extras . "\n" . $body_content;

// Build Elementor data structure (Container > HTML widget)
$elementor_data = [
    [
        'id'       => 'pap001',
        'elType'   => 'container',
        'isInner'  => false,
        'settings' => [
            'content_width'  => 'full',
            'padding'        => ['unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => false],
            'margin'         => ['unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => false],
            'flex_direction' => 'column',
        ],
        'elements' => [
            [
                'id'         => 'pap002',
                'elType'     => 'widget',
                'widgetType' => 'html',
                'isInner'    => false,
                'settings'   => [
                    'html' => $html_widget_content,
                ],
                'elements'   => [],
            ]
        ],
    ]
];

// Save Elementor data to post meta
$json = wp_json_encode($elementor_data);
update_post_meta($post_id, '_elementor_data', wp_slash($json));
update_post_meta($post_id, '_elementor_edit_mode', 'builder');
update_post_meta($post_id, '_elementor_template_type', 'wp-page');
update_post_meta($post_id, '_elementor_version', '3.27.0');

// Elementor Canvas = sem header/footer do tema WP (design limpo)
update_post_meta($post_id, '_wp_page_template', 'elementor_canvas');

// Definir como página inicial
update_option('page_on_front', $post_id);
update_option('show_on_front', 'page');

// Limpar cache CSS do Elementor
delete_post_meta($post_id, '_elementor_css');

// Publicar a página
wp_update_post([
    'ID'          => $post_id,
    'post_status' => 'publish',
    'post_title'  => 'Passo a Passo Uniformes Escolares',
    'post_name'   => 'home',
]);

// Auto-destruir o script
unlink(__FILE__);

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Elementor page updated! Stitch design injected.',
    'url'     => get_permalink($post_id),
    'html_size' => strlen($html_widget_content),
]);
