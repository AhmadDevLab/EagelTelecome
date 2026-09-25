<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('form_id')->unique();
            $table->string('verification_code')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('generated_email');
            $table->string('zip_code');
            $table->string('phone_number');
            $table->string('ip_address')->nullable();
            $table->timestamp('submitted_at');
            $table->timestamps();

            $table->index('form_id');
            $table->index(['first_name', 'last_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
    }
};
