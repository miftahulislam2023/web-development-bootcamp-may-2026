<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('monthly_limit', 12, 2)->nullable()->after('theme');
            $table->decimal('savings_target', 12, 2)->nullable()->after('monthly_limit');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['monthly_limit', 'savings_target']);
        });
    }
};
