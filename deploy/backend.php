<?php

use Illuminate\Http\Request;

/*
 * Laravel front controller for Hostinger shared hosting.
 *
 * The app lives OUTSIDE public_html, in ../laravel, so .env, vendor/ and
 * storage/ are never web-accessible. public_html/.htaccess routes /api/*
 * and /up here.
 */

define('LARAVEL_START', microtime(true));

$app_path = dirname(__DIR__).'/laravel';

if (file_exists($maintenance = $app_path.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $app_path.'/vendor/autoload.php';

$app = require_once $app_path.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
