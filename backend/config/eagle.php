<?php

return [
    'fake_email_domain' => env('FAKE_EMAIL_DOMAIN', 'gmail.com'),
    'admin_password' => env('ADMIN_PASSWORD'),
    // Timezone the admin panel and date filters use. Storage stays UTC.
    'display_timezone' => env('DISPLAY_TIMEZONE', 'America/New_York'),
    'admin_token_ttl_minutes' => env('ADMIN_TOKEN_TTL_MINUTES', 480),
];
