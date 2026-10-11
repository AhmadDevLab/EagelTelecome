<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('form_submissions', function (Blueprint $table) {
            $table->string('email')->nullable()->after('last_name');
            $table->string('state', 2)->nullable()->after('zip_code');
            $table->string('sa')->nullable();
            $table->text('trusted_form_cert_url')->nullable();
            $table->boolean('banana_consent')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_submissions', function (Blueprint $table) {
            $table->dropColumn(['email', 'state', 'sa', 'trusted_form_cert_url', 'banana_consent']);
        });
    }
};
