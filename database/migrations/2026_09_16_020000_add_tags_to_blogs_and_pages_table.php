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
        if (Schema::hasTable('blogs')) {
            Schema::table('blogs', function (Blueprint $table) {
                if (!Schema::hasColumn('blogs', 'tags')) {
                    $table->text('tags')->nullable()->after('meta_description');
                }
                if (!Schema::hasColumn('blogs', 'meta_keywords')) {
                    $table->text('meta_keywords')->nullable()->after('tags');
                }
            });
        }

        if (Schema::hasTable('pages')) {
            Schema::table('pages', function (Blueprint $table) {
                if (!Schema::hasColumn('pages', 'tags')) {
                    $table->text('tags')->nullable()->after('meta_keywords');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('blogs')) {
            Schema::table('blogs', function (Blueprint $table) {
                $columns = [];
                if (Schema::hasColumn('blogs', 'tags')) $columns[] = 'tags';
                if (Schema::hasColumn('blogs', 'meta_keywords')) $columns[] = 'meta_keywords';
                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }

        if (Schema::hasTable('pages')) {
            Schema::table('pages', function (Blueprint $table) {
                if (Schema::hasColumn('pages', 'tags')) {
                    $table->dropColumn('tags');
                }
            });
        }
    }
};
