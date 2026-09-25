<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\FormSubmissionController;
use Illuminate\Support\Facades\Route;

Route::post('/submissions', [FormSubmissionController::class, 'store']);

Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::middleware('admin.auth')->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/submissions', [FormSubmissionController::class, 'index']);
    Route::get('/admin/submissions/{formId}', [FormSubmissionController::class, 'show']);
});
