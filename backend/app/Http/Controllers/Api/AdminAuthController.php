<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $adminPassword = config('eagle.admin_password');

        if (! $adminPassword || ! hash_equals($adminPassword, $request->input('password'))) {
            return response()->json([
                'message' => 'Incorrect admin password.',
            ], 401);
        }

        $token = Str::random(60);
        $ttl = now()->addMinutes((int) config('eagle.admin_token_ttl_minutes'));

        Cache::put("admin_token:{$token}", true, $ttl);

        return response()->json([
            'token' => $token,
            'expires_at' => $ttl,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            Cache::forget("admin_token:{$token}");
        }

        return response()->json(['message' => 'Logged out.']);
    }
}
