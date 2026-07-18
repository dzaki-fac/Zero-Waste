<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distribusi', function (Blueprint $table) {
            $table->string('review_status')->default('pending')->index()->after('lokasi');
            $table->text('review_note')->nullable()->after('review_status');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete()->after('review_note');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->timestamp('revision_submitted_at')->nullable()->after('reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::table('distribusi', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['review_status', 'review_note', 'reviewed_by', 'reviewed_at', 'revision_submitted_at']);
        });
    }
};
