<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('description')->nullable()->index();
            $table->string('table')->nullable();
            $table->string('path')->nullable();
            $table->text('notes')->nullable();
            $table->text('userName')->nullable();
            $table->uuid('tenant_uuid')->nullable();
            $table->foreign('tenant_uuid')->references('uuid')->on('tenants');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('files');
    }
}
